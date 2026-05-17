using MediatR;
using MediTrack.Application.Interfaces;
using MediTrack.Domain.Entities;
using MediTrack.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.Application.Auth.Commands;

public record RegisterUserCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string PhoneNumber,
    DateTime DateOfBirth,
    Role Role) : IRequest<string>;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public RegisterUserCommandHandler(
        IApplicationDbContext context, 
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
        {
            throw new Exception("Email already exists."); // Simplify for this prototype
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Role = request.Role
        };

        _context.Users.Add(user);
        
        // If registering as a doctor, we should also create a doctor record
        if (request.Role == Role.Doctor)
        {
            _context.Doctors.Add(new Doctor
            {
                UserId = user.Id,
                User = user,
                // These would normally be provided in a more detailed Doctor registration flow
                Department = "General",
                Specialization = "General Practitioner",
                ConsultationFee = 100m
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        return _jwtProvider.Generate(user);
    }
}
