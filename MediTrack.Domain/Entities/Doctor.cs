using System;
using System.Collections.Generic;

namespace MediTrack.Domain.Entities;

public class Doctor
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Department { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; } = true;
    
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
