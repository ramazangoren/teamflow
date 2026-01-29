using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Dapper;

namespace Backend.Repositories.Implementations;

public class ProjectRepository : IProjectRepository
{
    private readonly DapperContext _context;

    public ProjectRepository(DapperContext context)
    {
        _context = context;
    }


    public async Task CreateAsync(Project project)
    {
        using var conn = _context.CreateConnection();

        await conn.ExecuteAsync(
            """
        INSERT INTO projects (
            id,
            team_id,
            name,
            description
        )
        VALUES (
            @Id,
            @TeamId,
            @Name,
            @Description
        )
        """,
            project
        );
    }

    public async Task<IEnumerable<Project>> GetByTeamIdAsync(string teamId)
    {
        using var conn = _context.CreateConnection();

        return await conn.QueryAsync<Project>(
            """
        SELECT
            id,
            team_id     AS TeamId,
            name,
            description,
            created_at  AS CreatedAt
        FROM projects
        WHERE team_id = @TeamId
        ORDER BY created_at DESC
        """,
            new { TeamId = teamId }
        );
    }

}
