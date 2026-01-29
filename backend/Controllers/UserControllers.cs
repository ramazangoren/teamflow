using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Dapper;
using MySqlConnector;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Backend.DTOs.Users;
using Backend.Services.Interfaces;



[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly string _connectionString;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;

    public UserController(
        IConfiguration configuration,
        IPasswordService passwordService,
        IJwtService jwtService)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    // Helper method to get the authenticated user's ID from the JWT token
    private int GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }
        // Console.WriteLine($"Authenticated User ID: {userId}");
        return userId;
    }

    [HttpGet("profile/me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetAuthenticatedUserId();

        using var connection = CreateConnection();
        var sql = @"SELECT 
                id, 
                fullName, 
                email, 
                gender, 
                dateOfBirth, 
                phone_number AS phoneNumber, 
                created_at AS createdAt, 
                updated_at AS updatedAt 
                FROM users WHERE id = @Id";

        var user = await connection.QuerySingleOrDefaultAsync<UserDto>(sql, new { Id = userId });

        if (user == null)
            return NotFound(new { message = "User not found" });

        // Console.WriteLine($"User info fetched: Id={user.FullName}, Email={user.Email}");
        return Ok(user);
    }

    // Admin only: Get any user by ID
    [HttpGet("get-user/{id}")]
    [Authorize(Roles = "Admin")] // Only admins can view other users
    public async Task<IActionResult> GetUser(int id)
    {
        using var connection = CreateConnection();
        var sql = "SELECT id, FullName, email, created_at, updated_at FROM users WHERE id = @Id";
        var user = await connection.QuerySingleOrDefaultAsync<UserDto>(sql, new { Id = id });

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpGet("getuserbyemail/{email}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUserByEmail(string email)
    {
        using var connection = CreateConnection();
        var sql = "SELECT id, FullName, email, created_at, updated_at FROM users WHERE email = @Email";
        var user = await connection.QuerySingleOrDefaultAsync<UserDto>(sql, new { Email = email });

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    // Update current user's profile
    [HttpPut("update-user")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
    {
        var userId = GetAuthenticatedUserId();

        using var connection = CreateConnection();

        // Check if user exists
        var exists = await connection.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM users WHERE id = @Id", new { Id = userId });

        if (!exists)
            return NotFound(new { message = "User not found" });

        var sql = @"UPDATE users 
                    SET FullName = @FullName, 
                        gender = @Gender,
                        dateOfBirth = @DateOfBirth,
                        phone_number = @PhoneNumber,
                        updated_at = @UpdatedAt 
                    WHERE id = @Id";

        await connection.ExecuteAsync(sql, new
        {
            Id = userId,
            request.FullName,
            request.Gender,
            request.DateOfBirth,
            request.PhoneNumber,
            UpdatedAt = DateTime.UtcNow
        });

        return Ok(new { message = "User updated successfully" });
    }

    // Update current user's password
    [HttpPut("update-password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
    {
        var userId = GetAuthenticatedUserId();

        using var connection = CreateConnection();

        // Get current password hash
        var currentPasswordHash = await connection.QuerySingleOrDefaultAsync<string>(
            "SELECT password_hash FROM users WHERE id = @Id", new { Id = userId });

        if (currentPasswordHash == null)
            return NotFound(new { message = "User not found" });

        // Verify current password
        if (!_passwordService.VerifyPassword(request.CurrentPassword, currentPasswordHash))
            return BadRequest(new { message = "Current password is incorrect" });

        // Hash new password
        var newPasswordHash = _passwordService.HashPassword(request.NewPassword);

        // Update password
        var sql = @"UPDATE users 
                    SET password_hash = @PasswordHash, 
                        updated_at = @UpdatedAt 
                    WHERE id = @Id";

        await connection.ExecuteAsync(sql, new
        {
            Id = userId,
            PasswordHash = newPasswordHash,
            UpdatedAt = DateTime.UtcNow
        });

        return Ok(new { message = "Password updated successfully" });
    }

    [HttpGet("get-all-users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        using var connection = CreateConnection();

        var offset = (page - 1) * pageSize;

        var sql = @"SELECT id, email, FullName, created_at, updated_at 
                    FROM users 
                    ORDER BY created_at DESC 
                    LIMIT @PageSize OFFSET @Offset";

        var users = await connection.QueryAsync<UserDto>(sql, new { PageSize = pageSize, Offset = offset });

        var totalCount = await connection.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM users");

        return Ok(new
        {
            users,
            totalCount,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }
}