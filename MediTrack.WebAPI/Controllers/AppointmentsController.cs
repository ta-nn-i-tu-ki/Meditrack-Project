using MediatR;
using MediTrack.Application.Appointments.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] CreateAppointmentCommand command)
    {
        try
        {
            var id = await _mediator.Send(command);
            return Ok(new { AppointmentId = id });
        }
        catch (Exception ex)
        {
            return Conflict(new { Error = ex.Message });
        }
    }
}
