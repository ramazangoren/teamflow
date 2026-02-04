using Backend.DTOs.Teams;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ITeamService
{
    Task<Team> CreateAsync(CreateTeamDto dto, Guid ownerId);
    Task<IEnumerable<Team>> GetForUserAsync(Guid userId);
    Task<TeamDetailsDto> GetByIdAsync(Guid teamId, Guid userId);
    Task<Team> UpdateAsync(Guid teamId, UpdateTeamDto dto, Guid userId);
    Task DeleteAsync(Guid teamId, Guid userId);
    Task AddMemberAsync(Guid teamId, AddMemberDto dto, Guid userId);
    Task RemoveMemberAsync(Guid teamId, Guid memberId, Guid userId);
    Task UpdateMemberRoleAsync(Guid teamId, Guid memberId, string role, Guid userId);
}



// using Backend.DTOs.Teams;
// using Backend.Models;

// namespace Backend.Services.Interfaces;

// public interface ITeamService
// {
//     Task<Team> CreateAsync(CreateTeamDto dto, string ownerId);
//     Task<IEnumerable<Team>> GetForUserAsync(string userId);
//     Task<TeamDetailsDto?> GetByIdAsync(string teamId, string userId);
//     Task<Team> UpdateAsync(string teamId, UpdateTeamDto dto, string userId);
//     Task DeleteAsync(string teamId, string userId);
//     Task AddMemberAsync(string teamId, AddMemberDto dto, string userId);
//     Task RemoveMemberAsync(string teamId, string memberId, string userId);
//     Task UpdateMemberRoleAsync(string teamId, string memberId, string newRole, string userId);
// }