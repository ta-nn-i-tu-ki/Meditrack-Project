using MediTrack.Application.Symptoms.Commands;

namespace MediTrack.Application.Interfaces;

public interface IAiSymptomRoutingService
{
    Task<string> AnalyzeSymptomsAsync(string symptoms, CancellationToken cancellationToken = default);
    Task<string> ConductConsultationAsync(List<ChatMessage> history, PatientVitals vitals, string newMessage, CancellationToken cancellationToken = default);
}
