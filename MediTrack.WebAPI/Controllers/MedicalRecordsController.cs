using MediatR;
using MediTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedicalRecordsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IPdfService _pdfService;

    public MedicalRecordsController(IApplicationDbContext context, IPdfService pdfService)
    {
        _context = context;
        _pdfService = pdfService;
    }

    [HttpGet("{id}/prescription/pdf")]
    public async Task<IActionResult> DownloadPrescriptionPdf(Guid id, CancellationToken cancellationToken)
    {
        // For simplicity, directly accessing context. In real app, use MediatR query
        var record = await _context.MedicalRecords.FindAsync(new object[] { id }, cancellationToken);

        if (record == null)
            return NotFound();

        var pdfBytes = _pdfService.GeneratePrescriptionPdf(record);
        return File(pdfBytes, "application/pdf", $"Prescription_{id}.pdf");
    }
}
