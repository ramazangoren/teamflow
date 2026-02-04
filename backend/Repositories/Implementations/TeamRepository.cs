using Backend.Data;
using Backend.DTOs.Teams;
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

    public async Task CreateWithOwnerAsync(Team team, Guid ownerId)
    {
        using var conn = _context.CreateConnection();

        await conn.ExecuteAsync(
            "INSERT INTO teams (id, name, description, avatar_url, created_at) VALUES (@Id, @Name, @Description, @AvatarUrl, @CreatedAt)",
            team);

        await conn.ExecuteAsync(
            "INSERT INTO team_members (team_id, user_id, role) VALUES (@TeamId, @UserId, 'Owner')",
            new { TeamId = team.Id, UserId = ownerId });
    }

    public Task<IEnumerable<Team>> GetByUserIdAsync(Guid userId)
        => _context.CreateConnection().QueryAsync<Team>(
            """
            SELECT t.id, t.name, t.description, t.avatar_url AS AvatarUrl, t.created_at AS CreatedAt
            FROM teams t
            JOIN team_members tm ON tm.team_id = t.id
            WHERE tm.user_id = @UserId AND t.deleted_at IS NULL
            """,
            new { UserId = userId });

    public Task<Team?> GetByIdAsync(Guid teamId)
        => _context.CreateConnection().QuerySingleOrDefaultAsync<Team>(
            "SELECT * FROM teams WHERE id = @TeamId AND deleted_at IS NULL",
            new { TeamId = teamId });

    public async Task<TeamDetailsDto?> GetDetailsByIdAsync(Guid teamId)
    {
        using var conn = _context.CreateConnection();

        var team = await conn.QuerySingleOrDefaultAsync<TeamDetailsDto>(
            """
            SELECT id, name, description, avatar_url AS AvatarUrl, created_at AS CreatedAt
            FROM teams WHERE id = @TeamId AND deleted_at IS NULL
            """,
            new { TeamId = teamId });

        if (team == null) return null;

        team.Members = (await GetMembersAsync(teamId)).ToList();
        return team;
    }

    public Task UpdateAsync(Team team)
        => _context.CreateConnection().ExecuteAsync(
            "UPDATE teams SET name=@Name, description=@Description, avatar_url=@AvatarUrl WHERE id=@Id",
            team);

    public Task DeleteAsync(Guid teamId)
        => _context.CreateConnection().ExecuteAsync(
            "UPDATE teams SET deleted_at = UTC_TIMESTAMP() WHERE id=@TeamId",
            new { TeamId = teamId });

    public Task<bool> IsUserMemberAsync(Guid teamId, Guid userId)
        => _context.CreateConnection().ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM team_members WHERE team_id=@TeamId AND user_id=@UserId",
            new { TeamId = teamId, UserId = userId })
        .ContinueWith(t => t.Result > 0);

    public Task<bool> IsUserOwnerAsync(Guid teamId, Guid userId)
        => _context.CreateConnection().ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM team_members WHERE team_id=@TeamId AND user_id=@UserId AND role='Owner'",
            new { TeamId = teamId, UserId = userId })
        .ContinueWith(t => t.Result > 0);

    public Task<bool> IsUserOwnerOrAdminAsync(Guid teamId, Guid userId)
        => _context.CreateConnection().ExecuteScalarAsync<int>(
            "SELECT COUNT(*) FROM team_members WHERE team_id=@TeamId AND user_id=@UserId AND role IN ('Owner','Admin')",
            new { TeamId = teamId, UserId = userId })
        .ContinueWith(t => t.Result > 0);

    public Task AddMemberAsync(Guid teamId, Guid userId, string role)
        => _context.CreateConnection().ExecuteAsync(
            "INSERT INTO team_members (team_id, user_id, role) VALUES (@TeamId, @UserId, @Role)",
            new { TeamId = teamId, UserId = userId, Role = role });

    public Task RemoveMemberAsync(Guid teamId, Guid userId)
        => _context.CreateConnection().ExecuteAsync(
            "DELETE FROM team_members WHERE team_id=@TeamId AND user_id=@UserId",
            new { TeamId = teamId, UserId = userId });

    public Task UpdateMemberRoleAsync(Guid teamId, Guid userId, string role)
        => _context.CreateConnection().ExecuteAsync(
            "UPDATE team_members SET role=@Role WHERE team_id=@TeamId AND user_id=@UserId",
            new { TeamId = teamId, UserId = userId, Role = role });

    public Task<IEnumerable<TeamMemberDto>> GetMembersAsync(Guid teamId)
        => _context.CreateConnection().QueryAsync<TeamMemberDto>(
            """
            SELECT u.id, u.full_name AS FullName, u.email,
                   tm.role, tm.joined_at AS JoinedAt
            FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE tm.team_id = @TeamId
            """,
            new { TeamId = teamId });
}



// using Backend.Data;
// using Backend.Models;
// using Backend.DTOs.Teams;
// using Backend.Repositories.Interfaces;
// using Dapper;

// namespace Backend.Repositories.Implementations;

// public class TeamRepository : ITeamRepository
// {
//     private readonly DapperContext _context;

//     public TeamRepository(DapperContext context)
//     {
//         _context = context;
//     }

//     public async Task CreateWithOwnerAsync(Team team, string ownerId)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             "INSERT INTO teams (id, name, description, avatar_url, created_at) VALUES (@Id, @Name, @Description, @AvatarUrl, @CreatedAt)",
//             team
//         );

//         await conn.ExecuteAsync(
//             "INSERT INTO team_members (team_id, user_id, role) VALUES (@TeamId, @UserId, 'Owner')",
//             new { TeamId = team.Id, UserId = ownerId }
//         );
//     }

//     // public async Task<IEnumerable<Team>> GetByUserIdAsync(string userId)
//     // {
//     //     using var conn = _context.CreateConnection();

//     //     return await conn.QueryAsync<Team>(
//     //         """
//     //         SELECT t.id, t.name, t.description, t.avatar_url AS AvatarUrl, t.created_at AS CreatedAt
//     //         FROM teams t
//     //         JOIN team_members tm ON tm.team_id = t.id
//     //         WHERE tm.user_id = @UserId AND t.deleted_at IS NULL
//     //         ORDER BY t.created_at DESC
//     //         """,
//     //         new { UserId = userId }
//     //     );
//     // }

//     public async Task<IEnumerable<Team>> GetByUserIdAsync(string userId)
//     {
//         using var conn = _context.CreateConnection();

//         return await conn.QueryAsync<Team>(
//             """
//         SELECT 
//             CAST(t.id AS CHAR) AS Id,
//             t.name AS Name,
//             t.description AS Description,
//             t.avatar_url AS AvatarUrl,
//             t.created_at AS CreatedAt
//         FROM teams t
//         JOIN team_members tm ON tm.team_id = t.id
//         WHERE tm.user_id = @UserId AND t.deleted_at IS NULL
//         ORDER BY t.created_at DESC
//         """,
//             new { UserId = userId }
//         );
//     }

//     // public async Task<Team?> GetByIdAsync(string teamId)
//     // {
//     //     using var conn = _context.CreateConnection();

//     //     return await conn.QuerySingleOrDefaultAsync<Team>(
//     //         "SELECT id, name, description, avatar_url AS AvatarUrl, created_at AS CreatedAt FROM teams WHERE id = @TeamId AND deleted_at IS NULL",
//     //         new { TeamId = teamId }
//     //     );
//     // }


//     public async Task<Team?> GetByIdAsync(string teamId)
//     {
//         using var conn = _context.CreateConnection();

//         return await conn.QuerySingleOrDefaultAsync<Team>(
//             """
//         SELECT 
//             CAST(id AS CHAR) AS Id,
//             name AS Name,
//             description AS Description,
//             avatar_url AS AvatarUrl,
//             created_at AS CreatedAt
//         FROM teams 
//         WHERE id = @TeamId AND deleted_at IS NULL
//         """,
//             new { TeamId = teamId }
//         );
//     }



//     public async Task<TeamDetailsDto?> GetDetailsByIdAsync(string teamId)
//     {
//         using var conn = _context.CreateConnection();

//         var team = await conn.QuerySingleOrDefaultAsync<TeamDetailsDto>(
//             """
//             SELECT 
//                 t.id, 
//                 t.name, 
//                 t.description, 
//                 t.avatar_url AS AvatarUrl, 
//                 t.created_at AS CreatedAt,
//                 (SELECT COUNT(*) FROM projects WHERE team_id = t.id AND deleted_at IS NULL) AS ProjectCount,
//                 (SELECT COUNT(*) FROM tasks ta JOIN projects p ON ta.project_id = p.id WHERE p.team_id = t.id AND ta.deleted_at IS NULL) AS TaskCount
//             FROM teams t
//             WHERE t.id = @TeamId AND t.deleted_at IS NULL
//             """,
//             new { TeamId = teamId }
//         );

//         if (team == null) return null;

//         team.Members = (await GetMembersAsync(teamId)).ToList();
//         return team;
//     }

//     public async Task UpdateAsync(Team team)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             """
//             UPDATE teams 
//             SET name = @Name, description = @Description, avatar_url = @AvatarUrl
//             WHERE id = @Id
//             """,
//             team
//         );
//     }

//     public async Task DeleteAsync(string teamId)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             "UPDATE teams SET deleted_at = UTC_TIMESTAMP() WHERE id = @TeamId",
//             new { TeamId = teamId }
//         );
//     }

//     public async Task<bool> IsUserMemberAsync(string teamId, string userId)
//     {
//         using var conn = _context.CreateConnection();

//         var count = await conn.ExecuteScalarAsync<int>(
//             "SELECT COUNT(*) FROM team_members WHERE team_id = @TeamId AND user_id = @UserId",
//             new { TeamId = teamId, UserId = userId }
//         );

//         return count > 0;
//     }

//     public async Task<bool> IsUserOwnerAsync(string teamId, string userId)
//     {
//         using var conn = _context.CreateConnection();

//         var count = await conn.ExecuteScalarAsync<int>(
//             "SELECT COUNT(*) FROM team_members WHERE team_id = @TeamId AND user_id = @UserId AND role = 'Owner'",
//             new { TeamId = teamId, UserId = userId }
//         );

//         return count > 0;
//     }

//     public async Task<bool> IsUserOwnerOrAdminAsync(string teamId, string userId)
//     {
//         using var conn = _context.CreateConnection();

//         var count = await conn.ExecuteScalarAsync<int>(
//             "SELECT COUNT(*) FROM team_members WHERE team_id = @TeamId AND user_id = @UserId AND role IN ('Owner', 'Admin')",
//             new { TeamId = teamId, UserId = userId }
//         );

//         return count > 0;
//     }

//     public async Task<string?> GetUserRoleAsync(string teamId, string userId)
//     {
//         using var conn = _context.CreateConnection();

//         return await conn.QuerySingleOrDefaultAsync<string>(
//             "SELECT role FROM team_members WHERE team_id = @TeamId AND user_id = @UserId",
//             new { TeamId = teamId, UserId = userId }
//         );
//     }

//     public async Task AddMemberAsync(string teamId, string userId, string role)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             "INSERT INTO team_members (team_id, user_id, role) VALUES (@TeamId, @UserId, @Role)",
//             new { TeamId = teamId, UserId = userId, Role = role }
//         );
//     }

//     public async Task RemoveMemberAsync(string teamId, string userId)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             "DELETE FROM team_members WHERE team_id = @TeamId AND user_id = @UserId",
//             new { TeamId = teamId, UserId = userId }
//         );
//     }

//     public async Task UpdateMemberRoleAsync(string teamId, string userId, string role)
//     {
//         using var conn = _context.CreateConnection();

//         await conn.ExecuteAsync(
//             "UPDATE team_members SET role = @Role WHERE team_id = @TeamId AND user_id = @UserId",
//             new { TeamId = teamId, UserId = userId, Role = role }
//         );
//     }

//     public async Task<IEnumerable<TeamMemberDto>> GetMembersAsync(string teamId)
//     {
//         using var conn = _context.CreateConnection();

//         return await conn.QueryAsync<TeamMemberDto>(
//             """
//             SELECT 
//                 u.id AS Id,
//                 u.full_name AS FullName,
//                 u.email AS Email,
//                 u.avatar AS Avatar,
//                 tm.role AS Role,
//                 tm.joined_at AS JoinedAt
//             FROM team_members tm
//             JOIN users u ON u.id = tm.user_id
//             WHERE tm.team_id = @TeamId
//             ORDER BY 
//                 CASE tm.role 
//                     WHEN 'Owner' THEN 1 
//                     WHEN 'Admin' THEN 2 
//                     ELSE 3 
//                 END,
//                 tm.joined_at ASC
//             """,
//             new { TeamId = teamId }
//         );
//     }
// }