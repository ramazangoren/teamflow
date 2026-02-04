using Backend.DTOs.Teams;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teamRepo;
    private readonly IUserRepository _userRepo;

    public TeamService(ITeamRepository teamRepo, IUserRepository userRepo)
    {
        _teamRepo = teamRepo;
        _userRepo = userRepo;
    }

    public async Task<Team> CreateAsync(CreateTeamDto dto, Guid ownerId)
    {
        var team = new Team
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            AvatarUrl = dto.AvatarUrl,
            CreatedAt = DateTime.UtcNow
        };

        await _teamRepo.CreateWithOwnerAsync(team, ownerId);
        return team;
    }

    public Task<IEnumerable<Team>> GetForUserAsync(Guid userId)
        => _teamRepo.GetByUserIdAsync(userId);

    public async Task<TeamDetailsDto> GetByIdAsync(Guid teamId, Guid userId)
    {
        if (!await _teamRepo.IsUserMemberAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        return await _teamRepo.GetDetailsByIdAsync(teamId)
            ?? throw new KeyNotFoundException("Team not found");
    }

    public async Task<Team> UpdateAsync(Guid teamId, UpdateTeamDto dto, Guid userId)
    {
        if (!await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        var team = await _teamRepo.GetByIdAsync(teamId)
            ?? throw new KeyNotFoundException("Team not found");

        if (dto.Name != null) team.Name = dto.Name;
        if (dto.Description != null) team.Description = dto.Description;
        if (dto.AvatarUrl != null) team.AvatarUrl = dto.AvatarUrl;

        await _teamRepo.UpdateAsync(team);
        return team;
    }

    public async Task DeleteAsync(Guid teamId, Guid userId)
    {
        if (!await _teamRepo.IsUserOwnerAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        await _teamRepo.DeleteAsync(teamId);
    }

    public async Task AddMemberAsync(Guid teamId, AddMemberDto dto, Guid userId)
    {
        if (!await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        var user = await _userRepo.GetByEmailAsync(dto.Email)
            ?? throw new KeyNotFoundException("User not found");

        if (await _teamRepo.IsUserMemberAsync(teamId, user.Id))
            throw new InvalidOperationException("Already a member");

        await _teamRepo.AddMemberAsync(teamId, user.Id, dto.Role);
    }

    public async Task RemoveMemberAsync(Guid teamId, Guid memberId, Guid userId)
    {
        if (!await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        if (userId == memberId && await _teamRepo.IsUserOwnerAsync(teamId, userId))
            throw new InvalidOperationException("Owner cannot remove themselves");

        await _teamRepo.RemoveMemberAsync(teamId, memberId);
    }

    public async Task UpdateMemberRoleAsync(Guid teamId, Guid memberId, string role, Guid userId)
    {
        if (!await _teamRepo.IsUserOwnerAsync(teamId, userId))
            throw new UnauthorizedAccessException();

        if (userId == memberId)
            throw new InvalidOperationException("Cannot change own role");

        if (!new[] { "Member", "Admin", "Owner" }.Contains(role))
            throw new ArgumentException("Invalid role");

        await _teamRepo.UpdateMemberRoleAsync(teamId, memberId, role);
    }
}



// using Backend.DTOs.Teams;
// using Backend.Models;
// using Backend.Repositories.Interfaces;
// using Backend.Services.Interfaces;

// namespace Backend.Services.Implementations;

// public class TeamService : ITeamService
// {
//     private readonly ITeamRepository _teamRepo;
//     private readonly IUserRepository _userRepo;

//     public TeamService(ITeamRepository teamRepo, IUserRepository userRepo)
//     {
//         _teamRepo = teamRepo;
//         _userRepo = userRepo;
//     }

//     public async Task<Team> CreateAsync(CreateTeamDto dto, string ownerId)
//     {
//         var team = new Team
//         {
//             Id = Guid.NewGuid().ToString(),
//             Name = dto.Name,
//             Description = dto.Description,
//             AvatarUrl = dto.AvatarUrl,
//             CreatedAt = DateTime.UtcNow
//         };

//         await _teamRepo.CreateWithOwnerAsync(team, ownerId);
//         return team;
//     }

//     public Task<IEnumerable<Team>> GetForUserAsync(string userId)
//         => _teamRepo.GetByUserIdAsync(userId);

//     public async Task<TeamDetailsDto?> GetByIdAsync(string teamId, string userId)
//     {
//         var isMember = await _teamRepo.IsUserMemberAsync(teamId, userId);
//         if (!isMember)
//             throw new UnauthorizedAccessException("You are not a member of this team");

//         return await _teamRepo.GetDetailsByIdAsync(teamId);
//     }

//     public async Task<Team> UpdateAsync(string teamId, UpdateTeamDto dto, string userId)
//     {
//         var hasPermission = await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId);
//         if (!hasPermission)
//             throw new UnauthorizedAccessException("Only team owners or admins can update team details");

//         var team = await _teamRepo.GetByIdAsync(teamId);
//         if (team == null)
//             throw new KeyNotFoundException("Team not found");

//         if (!string.IsNullOrEmpty(dto.Name))
//             team.Name = dto.Name;
        
//         if (dto.Description != null)
//             team.Description = dto.Description;

//         if (dto.AvatarUrl != null)
//             team.AvatarUrl = dto.AvatarUrl;

//         await _teamRepo.UpdateAsync(team);
//         return team;
//     }

//     public async Task DeleteAsync(string teamId, string userId)
//     {
//         var isOwner = await _teamRepo.IsUserOwnerAsync(teamId, userId);
//         if (!isOwner)
//             throw new UnauthorizedAccessException("Only team owners can delete teams");

//         var team = await _teamRepo.GetByIdAsync(teamId);
//         if (team == null)
//             throw new KeyNotFoundException("Team not found");

//         await _teamRepo.DeleteAsync(teamId);
//     }

//     public async Task AddMemberAsync(string teamId, AddMemberDto dto, string userId)
//     {
//         var hasPermission = await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId);
//         if (!hasPermission)
//             throw new UnauthorizedAccessException("Only team owners or admins can add members");

//         var newUser = await _userRepo.GetByEmailAsync(dto.Email);
//         if (newUser == null)
//             throw new KeyNotFoundException("User not found with this email");

//         var isMember = await _teamRepo.IsUserMemberAsync(teamId, newUser.Id.ToString());
//         if (isMember)
//             throw new InvalidOperationException("User is already a member of this team");

//         await _teamRepo.AddMemberAsync(teamId, newUser.Id.ToString(), dto.Role);
//     }

//     public async Task RemoveMemberAsync(string teamId, string memberId, string userId)
//     {
//         var hasPermission = await _teamRepo.IsUserOwnerOrAdminAsync(teamId, userId);
//         if (!hasPermission)
//             throw new UnauthorizedAccessException("Only team owners or admins can remove members");

//         if (userId == memberId)
//         {
//             var isOwner = await _teamRepo.IsUserOwnerAsync(teamId, userId);
//             if (isOwner)
//                 throw new InvalidOperationException("Team owner cannot remove themselves. Transfer ownership or delete the team instead.");
//         }

//         var isMember = await _teamRepo.IsUserMemberAsync(teamId, memberId);
//         if (!isMember)
//             throw new KeyNotFoundException("User is not a member of this team");

//         await _teamRepo.RemoveMemberAsync(teamId, memberId);
//     }

//     public async Task UpdateMemberRoleAsync(string teamId, string memberId, string newRole, string userId)
//     {
//         var isOwner = await _teamRepo.IsUserOwnerAsync(teamId, userId);
//         if (!isOwner)
//             throw new UnauthorizedAccessException("Only team owners can change member roles");

//         if (userId == memberId)
//             throw new InvalidOperationException("You cannot change your own role");

//         var isMember = await _teamRepo.IsUserMemberAsync(teamId, memberId);
//         if (!isMember)
//             throw new KeyNotFoundException("User is not a member of this team");

//         if (newRole != "Member" && newRole != "Admin" && newRole != "Owner")
//             throw new ArgumentException("Invalid role. Must be 'Member', 'Admin', or 'Owner'");

//         await _teamRepo.UpdateMemberRoleAsync(teamId, memberId, newRole);
//     }
// }