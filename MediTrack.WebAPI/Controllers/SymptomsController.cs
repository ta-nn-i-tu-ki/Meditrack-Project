using MediatR;
using MediTrack.Application.Symptoms.Queries;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SymptomsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SymptomsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeSymptomsQuery query)
    {
        try
        {
            var result = await _mediator.Send(query);
            return Ok(new { Analysis = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }
}
