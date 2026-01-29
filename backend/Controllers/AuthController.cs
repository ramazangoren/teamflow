using Backend.Data;
using Backend.DTOs.Auth;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly IPasswordService _passwords;
    private readonly IJwtService _jwt;
    private readonly DapperContext _context;

    public AuthController(
        IUserRepository users,
        IPasswordService passwords,
        IJwtService jwt,
        DapperContext context)
    {
        _users = users;
        _passwords = passwords;
        _jwt = jwt;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _users.GetByEmailAsync(dto.Email);
        if (user == null || !_passwords.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized();

        var accessToken = _jwt.GenerateAccessToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();

        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(
            """
            INSERT INTO refresh_tokens (id, user_id, token, expires_at)
            VALUES (@Id, @UserId, @Token, @ExpiresAt)
            """,
            new
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

        return Ok(new AuthResponseDto(accessToken, refreshToken));
    }


 [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var existing = await _users.GetByEmailAsync(dto.Email);
        if (existing != null)
            return BadRequest(new { message = "Email already in use" });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FullName = dto.FullName,
            PasswordHash = _passwords.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        await _users.CreateAsync(user);

        var accessToken = _jwt.GenerateAccessToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();

        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(
            """
            INSERT INTO refresh_tokens (id, user_id, token, expires_at)
            VALUES (@Id, @UserId, @Token, @ExpiresAt)
            """,
            new
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

        return Ok(new AuthResponseDto(accessToken, refreshToken));
    }
}
