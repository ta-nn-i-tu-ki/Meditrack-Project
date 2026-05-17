using MailKit.Net.Smtp;
using MailKit.Security;
using MediTrack.Application.Interfaces;
using MediTrack.Application.Models;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace MediTrack.Infrastructure.Services;

public class MailKitEmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public MailKitEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(EmailMessage emailMessage, CancellationToken cancellationToken = default)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
        message.To.Add(new MailboxAddress("", emailMessage.To));
        message.Subject = emailMessage.Subject;

        message.Body = new TextPart("html")
        {
            Text = emailMessage.Body
        };

        using var client = new SmtpClient();
        
        await client.ConnectAsync(
            emailSettings["SmtpServer"], 
            int.Parse(emailSettings["SmtpPort"]!), 
            SecureSocketOptions.StartTls, 
            cancellationToken);

        await client.AuthenticateAsync(
            emailSettings["Username"], 
            emailSettings["Password"], 
            cancellationToken);

        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
