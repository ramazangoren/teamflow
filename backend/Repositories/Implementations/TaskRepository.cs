using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Dapper;

namespace Backend.Repositories.Implementations;

public class TaskRepository : ITaskRepository
{
    private readonly DapperContext _context;

    public TaskRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(TaskItem task)
    {
        using var conn = _context.CreateConnection();

        await conn.ExecuteAsync(
            """
            INSERT INTO tasks (
                id,
                project_id,
                title,
                description,
                status_id,
                priority,
                assignee_id,
                due_date
            )
            VALUES (
                @Id,
                @ProjectId,
                @Title,
                @Description,
                @StatusId,
                @Priority,
                @AssigneeId,
                @DueDate
            )
            """,
            task
        );
    }

    public async Task<IEnumerable<TaskItem>> GetByProjectIdAsync(string projectId)
    {
        using var conn = _context.CreateConnection();

        return await conn.QueryAsync<TaskItem>(
            """
            SELECT
                id,
                project_id    AS ProjectId,
                title,
                description,
                status_id     AS StatusId,
                priority,
                assignee_id   AS AssigneeId,
                due_date      AS DueDate,
                created_at    AS CreatedAt
            FROM tasks
            WHERE project_id = @ProjectId
            ORDER BY created_at DESC
            """,
            new { ProjectId = projectId }
        );
    }

    public async Task<TaskItem?> GetByIdAsync(string taskId)
    {
        using var conn = _context.CreateConnection();

        return await conn.QuerySingleOrDefaultAsync<TaskItem>(
            """
            SELECT
                id,
                project_id    AS ProjectId,
                title,
                description,
                status_id     AS StatusId,
                priority,
                assignee_id   AS AssigneeId,
                due_date      AS DueDate,
                created_at    AS CreatedAt
            FROM tasks
            WHERE id = @Id
            """,
            new { Id = taskId }
        );
    }
}
