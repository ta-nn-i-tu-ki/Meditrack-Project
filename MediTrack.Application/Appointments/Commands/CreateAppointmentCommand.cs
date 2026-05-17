using MediatR;
using MediTrack.Application.Interfaces;
using MediTrack.Domain.Entities;
using MediTrack.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.Application.Appointments.Commands;

public record CreateAppointmentCommand(
    Guid PatientId,
    Guid DoctorId,
    DateTime AppointmentDate,
    TimeSpan StartTime,
    string Symptoms) : IRequest<Guid>;

public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;

    public CreateAppointmentCommandHandler(IApplicationDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Guid> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
        // Simple conflict check
        var hasConflict = await _context.Appointments
            .AnyAsync(a => a.DoctorId == request.DoctorId && 
                           a.AppointmentDate == request.AppointmentDate &&
                           a.StartTime == request.StartTime &&
                           a.Status != AppointmentStatus.Cancelled, 
                      cancellationToken);

        if (hasConflict)
        {
            throw new Exception("The selected time slot is no longer available.");
        }

        var appointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            AppointmentDate = request.AppointmentDate.Date,
            StartTime = request.StartTime,
            EndTime = request.StartTime.Add(TimeSpan.FromMinutes(30)), // 30 min slots
            Symptoms = request.Symptoms,
            Status = AppointmentStatus.Confirmed
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate cache
        var cacheKey = $"DoctorSchedule_{request.DoctorId}_{request.AppointmentDate:yyyyMMdd}";
        await _cacheService.RemoveAsync(cacheKey, cancellationToken);

        return appointment.Id;
    }
}
