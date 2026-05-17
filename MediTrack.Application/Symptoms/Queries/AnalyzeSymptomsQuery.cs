using MediatR;
using MediTrack.Application.Interfaces;

namespace MediTrack.Application.Symptoms.Queries;

public record AnalyzeSymptomsQuery(string Symptoms) : IRequest<string>;

public class AnalyzeSymptomsQueryHandler : IRequestHandler<AnalyzeSymptomsQuery, string>
{
    private readonly IAiSymptomRoutingService _aiService;

    public AnalyzeSymptomsQueryHandler(IAiSymptomRoutingService aiService)
    {
        _aiService = aiService;
    }

    public async Task<string> Handle(AnalyzeSymptomsQuery request, CancellationToken cancellationToken)
    {
        return await _aiService.AnalyzeSymptomsAsync(request.Symptoms, cancellationToken);
    }
}
