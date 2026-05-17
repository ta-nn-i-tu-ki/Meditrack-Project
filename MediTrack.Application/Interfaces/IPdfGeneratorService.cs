using MediTrack.Application.Documents.Models;

namespace MediTrack.Application.Interfaces;

public interface IPdfGeneratorService
{
    byte[] GenerateAppointmentLetter(AppointmentPdfRequest request);
    byte[] GeneratePrescription(PrescriptionPdfRequest request);
}
