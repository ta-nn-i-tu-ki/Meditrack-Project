using MediTrack.Domain.Entities;

namespace MediTrack.Application.Interfaces;

public interface IPdfService
{
    byte[] GeneratePrescriptionPdf(MedicalRecord record);
}
