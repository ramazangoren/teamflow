using Backend.Data;
using Dapper;
using Backend.Models.Entities;
using System.Data;
using Backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DbConnectionFactory _dbFactory;

    public UserRepository(DbConnectionFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var conn = _dbFactory.CreateConnection();
        var sql = "SELECT id AS Id, email AS Email, password_hash AS PasswordHash, " +
                  "FullName AS FullName, created_at AS CreatedAt " +
                  "FROM users WHERE email = @Email";
        
        return await conn.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task<User> CreateAsync(string email, string passwordHash, string? FullName)
    {
        using var conn = _dbFactory.CreateConnection();
        var sql = @"INSERT INTO users (email, password_hash, FullName, created_at) 
                    VALUES (@Email, @PasswordHash, @FullName, @CreatedAt);
                    SELECT LAST_INSERT_ID();";
        
        var id = await conn.ExecuteScalarAsync<long>(sql, new 
        { 
            Email = email, 
            PasswordHash = passwordHash, 
            FullName = FullName,
            CreatedAt = DateTime.UtcNow
        });

        return new User
        {
            Id = id,
            Email = email,
            PasswordHash = passwordHash,
            FullName = FullName,
            CreatedAt = DateTime.UtcNow
        };
    }
}