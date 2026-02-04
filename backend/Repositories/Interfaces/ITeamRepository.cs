using Backend.DTOs.Teams;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ITeamRepository
{
    Task CreateWithOwnerAsync(Team team, Guid ownerId);
    Task<IEnumerable<Team>> GetByUserIdAsync(Guid userId);
    Task<Team?> GetByIdAsync(Guid teamId);
    Task<TeamDetailsDto?> GetDetailsByIdAsync(Guid teamId);
    Task UpdateAsync(Team team);
    Task DeleteAsync(Guid teamId);
    Task<bool> IsUserMemberAsync(Guid teamId, Guid userId);
    Task<bool> IsUserOwnerAsync(Guid teamId, Guid userId);
    Task<bool> IsUserOwnerOrAdminAsync(Guid teamId, Guid userId);
    Task AddMemberAsync(Guid teamId, Guid userId, string role);
    Task RemoveMemberAsync(Guid teamId, Guid userId);
    Task UpdateMemberRoleAsync(Guid teamId, Guid userId, string role);
    Task<IEnumerable<TeamMemberDto>> GetMembersAsync(Guid teamId);
}



// using Backend.Models;
// using Backend.DTOs.Teams;

// namespace Backend.Repositories.Interfaces;

// public interface ITeamRepository
// {
//     Task CreateWithOwnerAsync(Team team, string ownerId);
//     Task<IEnumerable<Team>> GetByUserIdAsync(string userId);
//     Task<Team?> GetByIdAsync(string teamId);
//     Task<TeamDetailsDto?> GetDetailsByIdAsync(string teamId);
//     Task UpdateAsync(Team team);
//     Task DeleteAsync(string teamId);
//     Task<bool> IsUserMemberAsync(string teamId, string userId);
//     Task<bool> IsUserOwnerAsync(string teamId, string userId);
//     Task<bool> IsUserOwnerOrAdminAsync(string teamId, string userId);
//     Task<string?> GetUserRoleAsync(string teamId, string userId);
//     Task AddMemberAsync(string teamId, string userId, string role);
//     Task RemoveMemberAsync(string teamId, string userId);
//     Task UpdateMemberRoleAsync(string teamId, string userId, string role);
//     Task<IEnumerable<TeamMemberDto>> GetMembersAsync(string teamId);
// }