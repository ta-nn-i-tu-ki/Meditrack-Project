using MediatR;
using MediTrack.Application.Interfaces;
using MediTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.Application.Doctors.Queries;

public record GetDoctorScheduleQuery(Guid DoctorId, DateTime Date) : IRequest<List<Appointment>>;

public class GetDoctorScheduleQueryHandler : IRequestHandler<GetDoctorScheduleQuery, List<Appointment>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public GetDoctorScheduleQueryHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<List<Appointment>> Handle(GetDoctorScheduleQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"DoctorSchedule_{request.DoctorId}_{request.Date:yyyyMMdd}";
        
        var cachedSchedule = await _cacheService.GetAsync<List<Appointment>>(cacheKey, cancellationToken);
        if (cachedSchedule != null)
        {
            return cachedSchedule;
        }

        var schedule = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == request.DoctorId && a.AppointmentDate.Date == request.Date.Date)
            .OrderBy(a => a.StartTime)
            .ToListAsync(cancellationToken);

        await _cacheService.SetAsync(cacheKey, schedule, TimeSpan.FromMinutes(10), cancellationToken);

        return schedule;
    }
}
