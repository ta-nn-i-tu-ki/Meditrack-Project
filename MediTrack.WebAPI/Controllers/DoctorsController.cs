using MediatR;
using MediTrack.Application.Doctors.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Doctor,Admin")]
public class DoctorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DoctorsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{doctorId}/schedule")]
    public async Task<IActionResult> GetSchedule(Guid doctorId, [FromQuery] DateTime date)
    {
        var appointments = await _mediator.Send(new GetDoctorScheduleQuery(doctorId, date));
        return Ok(appointments);
    }
}
