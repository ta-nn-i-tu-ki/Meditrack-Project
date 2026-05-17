using MediTrack.Application.Documents.Models;
using MediTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IPdfGeneratorService _pdfGeneratorService;

    public DocumentsController(IPdfGeneratorService pdfGeneratorService)
    {
        _pdfGeneratorService = pdfGeneratorService;
    }

    [HttpPost("appointment")]
    public IActionResult GenerateAppointmentLetter([FromBody] AppointmentPdfRequest request)
    {
        try
        {
            var pdfBytes = _pdfGeneratorService.GenerateAppointmentLetter(request);
            return File(pdfBytes, "application/pdf", $"Appointment_{request.ReferenceNumber}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = "Failed to generate appointment letter.", Details = ex.Message });
        }
    }

    [HttpPost("prescription")]
    public IActionResult GeneratePrescription([FromBody] PrescriptionPdfRequest request)
    {
        try
        {
            var pdfBytes = _pdfGeneratorService.GeneratePrescription(request);
            var safeName = request.PatientName.Replace(" ", "_");
            return File(pdfBytes, "application/pdf", $"Prescription_{safeName}_{request.Date:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = "Failed to generate prescription.", Details = ex.Message });
        }
    }
}
