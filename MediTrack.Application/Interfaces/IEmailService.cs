using MediTrack.Application.Models;

namespace MediTrack.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage emailMessage, CancellationToken cancellationToken = default);
}
