namespace MediTrack.Application.Interfaces;

public interface IMessagePublisher
{
    void Publish<T>(T message, string routingKey) where T : class;
}
