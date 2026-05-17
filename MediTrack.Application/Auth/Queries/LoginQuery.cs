using MediatR;
using MediTrack.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.Application.Auth.Queries;

public record LoginQuery(string Email, string Password) : IRequest<string>;

public class LoginQueryHandler : IRequestHandler<LoginQuery, string>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public LoginQueryHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<string> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }

        return _jwtProvider.Generate(user);
    }
}
