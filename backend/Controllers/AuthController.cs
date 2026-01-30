using System.Security.Claims;
using Backend.Data;
using Backend.DTOs.Auth;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        DapperContext context
    )
    {
        _users = users;
        _passwords = passwords;
        _jwt = jwt;
        _context = context;
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var name = User.FindFirst("name")?.Value;

        return Ok(
            new
            {
                id = userId,
                name,
                email,
                currentTeam = new
                {
                    id = User.FindFirst("teamId")?.Value,
                    name = User.FindFirst("teamName")?.Value,
                },
            }
        );
    }

    // ----------------------------
    // LOGIN
    // ----------------------------
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
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
            }
        );

        SetRefreshTokenCookie(refreshToken);

        Console.WriteLine($"[LOGIN] refreshToken set: {refreshToken}");

        return Ok(new { accessToken });
    }

    // ----------------------------
    // REGISTER
    // ----------------------------
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
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
            Role = "User",
            CreatedAt = DateTime.UtcNow,
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
                ExpiresAt = DateTime.UtcNow.AddDays(7),
            }
        );

        SetRefreshTokenCookie(refreshToken);

        Console.WriteLine($"[REGISTER] refreshToken set: {refreshToken}");

        return Ok(new { accessToken });
    }

    // ----------------------------
    // REFRESH
    // ----------------------------
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        foreach (var cookie in Request.Cookies)
            Console.WriteLine($"[COOKIE IN] {cookie.Key} = {cookie.Value}");

        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return Unauthorized();

        using var conn = _context.CreateConnection();

        var tokenRecord = await conn.QuerySingleOrDefaultAsync<dynamic>(
            """
            SELECT rt.*, u.*
            FROM refresh_tokens rt
            JOIN users u ON u.id = rt.user_id
            WHERE rt.token = @Token AND rt.expires_at > UTC_TIMESTAMP()
            """,
            new { Token = refreshToken }
        );

        if (tokenRecord == null)
            return Unauthorized();

        var user = new User
        {
            Id = tokenRecord.user_id,
            Email = tokenRecord.email,
            FullName = tokenRecord.full_name,
            Role = tokenRecord.role,
        };

        var newAccessToken = _jwt.GenerateAccessToken(user);

        Console.WriteLine("[REFRESH] Access token regenerated");

        return Ok(new { accessToken = newAccessToken });
    }

    // ----------------------------
    // LOGOUT
    // ----------------------------
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        {
            Console.WriteLine($"[LOGOUT] refreshToken removed: {refreshToken}");

            using var conn = _context.CreateConnection();
            await conn.ExecuteAsync(
                "DELETE FROM refresh_tokens WHERE token = @Token",
                new { Token = refreshToken }
            );
        }

        Response.Cookies.Delete("refreshToken");

        return Ok();
    }

    // ----------------------------
    // COOKIE HELPER
    // ----------------------------
    private void SetRefreshTokenCookie(string refreshToken)
    {
        Response.Cookies.Append(
            "refreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // IMPORTANT for localhost (true only with HTTPS)
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7),
            }
        );
    }
}




// using Backend.Data;
// using Backend.DTOs.Auth;
// using Backend.Models;
// using Backend.Repositories.Interfaces;
// using Backend.Services.Interfaces;
// using Dapper;
// using Microsoft.AspNetCore.Mvc;


// namespace Backend.Controllers;

// [ApiController]
// [Route("api/auth")]
// public class AuthController : ControllerBase
// {
//     private readonly IUserRepository _users;
//     private readonly IPasswordService _passwords;
//     private readonly IJwtService _jwt;
//     private readonly DapperContext _context;

//     public AuthController(
//         IUserRepository users,
//         IPasswordService passwords,
//         IJwtService jwt,
//         DapperContext context)
//     {
//         _users = users;
//         _passwords = passwords;
//         _jwt = jwt;
//         _context = context;
//     }

//     [HttpPost("login")]
//     public async Task<IActionResult> Login(LoginDto dto)
//     {
//         var user = await _users.GetByEmailAsync(dto.Email);
//         if (user == null || !_passwords.VerifyPassword(dto.Password, user.PasswordHash))
//             return Unauthorized();

//         var accessToken = _jwt.GenerateAccessToken(user);
//         var refreshToken = _jwt.GenerateRefreshToken();

//         using var conn = _context.CreateConnection();
//         await conn.ExecuteAsync(
//             """
//             INSERT INTO refresh_tokens (id, user_id, token, expires_at)
//             VALUES (@Id, @UserId, @Token, @ExpiresAt)
//             """,
//             new
//             {
//                 Id = Guid.NewGuid().ToString(),
//                 UserId = user.Id,
//                 Token = refreshToken,
//                 ExpiresAt = DateTime.UtcNow.AddDays(7)
//             });

//         return Ok(new AuthResponseDto(accessToken, refreshToken));
//     }


//  [HttpPost("register")]
//     public async Task<IActionResult> Register([FromBody] RegisterDto dto)
//     {
//         var existing = await _users.GetByEmailAsync(dto.Email);
//         if (existing != null)
//             return BadRequest(new { message = "Email already in use" });

//         var user = new User
//         {
//             Id = Guid.NewGuid(),
//             Email = dto.Email,
//             FullName = dto.FullName,
//             PasswordHash = _passwords.HashPassword(dto.Password),
//             CreatedAt = DateTime.UtcNow
//         };

//         await _users.CreateAsync(user);

//         var accessToken = _jwt.GenerateAccessToken(user);
//         var refreshToken = _jwt.GenerateRefreshToken();

//         using var conn = _context.CreateConnection();
//         await conn.ExecuteAsync(
//             """
//             INSERT INTO refresh_tokens (id, user_id, token, expires_at)
//             VALUES (@Id, @UserId, @Token, @ExpiresAt)
//             """,
//             new
//             {
//                 Id = Guid.NewGuid(),
//                 UserId = user.Id,
//                 Token = refreshToken,
//                 ExpiresAt = DateTime.UtcNow.AddDays(7)
//             });

//         return Ok(new AuthResponseDto(accessToken, refreshToken));
//     }
// }
