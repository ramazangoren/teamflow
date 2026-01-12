using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Dapper;
using MySqlConnector;
using System.Data;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;

    public AuthController(
        IUserRepository userRepo,
        IPasswordService passwordService,
        IJwtService jwtService)
    {
        _userRepo = userRepo;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        if (req.Password.Length < 6)
        {
            return BadRequest(new { message = "Password must be at least 6 characters" });
        }

        // Check if user already exists
        var existingUser = await _userRepo.GetByEmailAsync(req.Email);
        if (existingUser != null)
        {
            return Conflict(new { message = "Email already registered" });
        }

        // Hash password and create user
        var passwordHash = _passwordService.HashPassword(req.Password);
        var user = await _userRepo.CreateAsync(req.Email, passwordHash, req.FullName);

        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Token = token
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        // Get user by email
        var user = await _userRepo.GetByEmailAsync(req.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Verify password
        if (!_passwordService.VerifyPassword(req.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Token = token
        });
    }
}
