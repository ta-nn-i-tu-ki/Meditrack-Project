using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using MediTrack.Infrastructure.Data;
using MediTrack.Application.Interfaces;
using MediTrack.Infrastructure.Authentication;

namespace MediTrack.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // Configure Redis
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis") ?? "localhost:6379";
            options.InstanceName = "MediTrack_";
        });
        services.AddSingleton<ICacheService, Services.RedisCacheService>();

        // Configure AI Service
        services.AddHttpClient<IAiSymptomRoutingService, Services.GeminiSymptomRoutingService>();

        // Configure Messaging & Email
        services.AddSingleton<IMessagePublisher, Messaging.RabbitMqPublisher>();
        services.AddScoped<IEmailService, Services.MailKitEmailService>();
        services.AddHostedService<Workers.EmailWorker>();

        // Configure PDF Generation
        services.AddSingleton<IPdfService, Services.QuestPdfService>();
        services.AddSingleton<IPdfGeneratorService, Services.PdfGeneratorService>();

        // Configure SignalR Service
        services.AddScoped<INotificationService, Services.SignalRNotificationService>();

        services.AddSingleton<IJwtProvider, JwtProvider>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
