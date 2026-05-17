namespace MediTrack.Application.Interfaces;

public interface IAiSymptomRoutingService
{
    Task<string> AnalyzeSymptomsAsync(string symptoms, CancellationToken cancellationToken = default);
}
