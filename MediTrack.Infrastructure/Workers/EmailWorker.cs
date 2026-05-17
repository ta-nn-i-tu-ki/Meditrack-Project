using System.Text;
using System.Text.Json;
using MediTrack.Application.Interfaces;
using MediTrack.Application.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MediTrack.Infrastructure.Workers;

public class EmailWorker : BackgroundService
{
    private readonly ILogger<EmailWorker> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;
    private IConnection _connection;
    private IModel _channel;
    
    private const string QueueName = "email_queue";
    private const string ExchangeName = "meditrack_exchange";
    private const string RoutingKey = "email.send";

    public EmailWorker(ILogger<EmailWorker> logger, IServiceProvider serviceProvider, IConfiguration configuration)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _configuration = configuration;
        
        InitRabbitMq();
    }

    private void InitRabbitMq()
    {
        var factory = new ConnectionFactory { HostName = _configuration.GetConnectionString("RabbitMQ") ?? "localhost" };
        
        // In a real scenario, this might need retry logic if RabbitMQ isn't up yet
        try
        {
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.ExchangeDeclare(exchange: ExchangeName, type: ExchangeType.Direct);
            _channel.QueueDeclare(queue: QueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queue: QueueName, exchange: ExchangeName, routingKey: RoutingKey);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not connect to RabbitMQ.");
        }
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_channel == null) return Task.CompletedTask;

        stoppingToken.ThrowIfCancellationRequested();

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (ch, ea) =>
        {
            var content = Encoding.UTF8.GetString(ea.Body.ToArray());
            var emailMessage = JsonSerializer.Deserialize<EmailMessage>(content);

            if (emailMessage != null)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    await emailService.SendEmailAsync(emailMessage, stoppingToken);
                    
                    _logger.LogInformation("Email sent successfully to {To}", emailMessage.To);
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send email to {To}", emailMessage.To);
                    _channel.BasicNack(ea.DeliveryTag, false, true); // Requeue
                }
            }
        };

        _channel.BasicConsume(queue: QueueName, autoAck: false, consumer: consumer);

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}
