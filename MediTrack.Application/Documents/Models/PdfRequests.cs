namespace MediTrack.Application.Documents.Models;

public class AppointmentPdfRequest
{
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
}

public class PrescriptionPdfRequest
{
    public string PatientName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string Symptoms { get; set; } = string.Empty;
    public string BloodPressure { get; set; } = string.Empty;
    public string HeartRate { get; set; } = string.Empty;
    public List<MedicineItem> Medicines { get; set; } = new();
    public string Notes { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class MedicineItem
{
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
}
