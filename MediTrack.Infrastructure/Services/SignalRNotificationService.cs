using MediTrack.Application.Interfaces;
using MediTrack.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MediTrack.Infrastructure.Services;

public class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationToUserAsync(string userId, string message, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.Group($"User_{userId}").SendAsync("ReceiveNotification", message, cancellationToken);
    }

    public async Task SendNotificationToGroupAsync(string groupName, string message, CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients.Group(groupName).SendAsync("ReceiveNotification", message, cancellationToken);
    }
}
