using MediatR;
using MediTrack.Application.Interfaces;

namespace MediTrack.Application.Symptoms.Commands;

public class ChatMessage
{
    public string Role { get; set; } = string.Empty; // "user" or "model"
    public string Content { get; set; } = string.Empty;
}

public class PatientVitals
{
    public string BloodPressure { get; set; } = string.Empty;
    public string HeartRate { get; set; } = string.Empty;
    public string Temperature { get; set; } = string.Empty;
}

public record ChatWithAiDoctorCommand(List<ChatMessage> History, PatientVitals Vitals, string NewMessage) : IRequest<string>;

public class ChatWithAiDoctorCommandHandler : IRequestHandler<ChatWithAiDoctorCommand, string>
{
    private readonly IAiSymptomRoutingService _aiService;

    public ChatWithAiDoctorCommandHandler(IAiSymptomRoutingService aiService)
    {
        _aiService = aiService;
    }

    public async Task<string> Handle(ChatWithAiDoctorCommand request, CancellationToken cancellationToken)
    {
        return await _aiService.ConductConsultationAsync(request.History, request.Vitals, request.NewMessage, cancellationToken);
    }
}
