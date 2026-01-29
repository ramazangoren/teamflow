using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Dapper;

namespace Backend.Repositories.Implementations;

public class TeamRepository : ITeamRepository
{
    private readonly DapperContext _context;

    public TeamRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task CreateWithOwnerAsync(Team team, string ownerId)
    {
        using var conn = _context.CreateConnection();

        // Dapper will open/close the connection automatically
        await conn.ExecuteAsync(
            "INSERT INTO teams (id, name) VALUES (@Id, @Name)",
            team
        );

        await conn.ExecuteAsync(
            """
            INSERT INTO team_members (team_id, user_id, role)
            VALUES (@TeamId, @UserId, 'Owner')
            """,
            new
            {
                TeamId = team.Id,
                UserId = ownerId
            }
        );
    }

    public async Task<IEnumerable<Team>> GetByUserIdAsync(string userId)
    {
        using var conn = _context.CreateConnection();

        return await conn.QueryAsync<Team>(
            """
            SELECT
                t.id,
                t.name,
                t.created_at AS CreatedAt
            FROM teams t
            JOIN team_members tm ON tm.team_id = t.id
            WHERE tm.user_id = @UserId
            """,
            new { UserId = userId }
        );
    }
}
