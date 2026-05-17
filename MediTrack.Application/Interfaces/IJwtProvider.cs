using MediTrack.Domain.Entities;

namespace MediTrack.Application.Interfaces;

public interface IJwtProvider
{
    string Generate(User user);
}
