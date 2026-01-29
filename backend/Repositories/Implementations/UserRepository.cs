using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Dapper;

namespace Backend.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly DapperContext _context;

    public UserRepository(DapperContext context)
    {
        _context = context;
    }

    // public async Task<User?> GetByEmailAsync(string email)
    // {
    //     using var conn = _context.CreateConnection();
    //     return await conn.QuerySingleOrDefaultAsync<User>(
    //         "SELECT * FROM users WHERE email = @Email",
    //         new { Email = email });
    // }


    public async Task<User?> GetByEmailAsync(string email)
    {
        using var conn = _context.CreateConnection();

        return await conn.QuerySingleOrDefaultAsync<User>(
            """
        SELECT
            id,
            email,
            password_hash AS PasswordHash,
            full_name     AS FullName,
            role,
            is_active     AS IsActive,
            created_at    AS CreatedAt
        FROM users
        WHERE email = @Email
        """,
            new { Email = email }
        );
    }

    public async Task CreateAsync(User user)
    {
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(
            """
            INSERT INTO users (id, email, password_hash, full_name, role)
            VALUES (@Id, @Email, @PasswordHash, @FullName, @Role)
            """,
            user);
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        using var conn = _context.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(
            "SELECT * FROM users WHERE id = @Id",
            new { Id = id });
    }
}
