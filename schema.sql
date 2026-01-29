-- ================================
-- TeamFlow Database Schema (PostgreSQL)
-- ================================
-- Multi-tenant SaaS with teams, projects, tasks, and collaboration features

-- ================================
-- EXTENSIONS
-- ================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- USERS & AUTHENTICATION
-- ================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    job_title VARCHAR(100),
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ================================
-- TEAMS (Organizations/Workspaces)
-- ================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    avatar_url TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- Team Members (Junction Table with Roles)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);

-- ================================
-- PROJECTS
-- ================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'on-hold')),
    color VARCHAR(7) DEFAULT '#667eea',
    icon VARCHAR(10),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_deleted ON projects(is_deleted);

-- ================================
-- TASKS
-- ================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'in-review', 'done')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    position INTEGER DEFAULT 0, -- For ordering within status columns
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_reporter_id ON tasks(reporter_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_is_deleted ON tasks(is_deleted);

-- Task Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#6b7280',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, name)
);

CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

-- Subtasks
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_completed ON subtasks(completed);

-- ================================
-- COMMENTS
-- ================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- ================================
-- ACTIVITY LOG
-- ================================

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- 'task_created', 'task_updated', 'comment_added', etc.
    entity_type VARCHAR(50), -- 'task', 'project', 'comment', etc.
    entity_id UUID,
    metadata JSONB, -- Flexible storage for action details
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_team_id ON activities(team_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_action_type ON activities(action_type);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_metadata ON activities USING GIN (metadata);

-- ================================
-- NOTIFICATIONS
-- ================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'mention', 'assignment', 'comment', 'due_date', 'status_change'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT, -- Deep link to relevant entity
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ================================
-- USER PREFERENCES
-- ================================

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    email_notifications JSONB DEFAULT '{"assignments": true, "mentions": true, "comments": true, "due_dates": true}',
    push_notifications JSONB DEFAULT '{"desktop": false, "mobile": false}',
    accent_color VARCHAR(7) DEFAULT '#667eea',
    compact_mode BOOLEAN DEFAULT FALSE,
    show_animations BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ================================
-- CUSTOM WORKFLOWS
-- ================================

CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workflow_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#6b7280',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_statuses_workflow_id ON workflow_statuses(workflow_id);

-- ================================
-- TASK DEPENDENCIES
-- ================================

CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(20) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'relates-to')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_task_dependencies_task_id ON task_dependencies(task_id);
CREATE INDEX idx_task_dependencies_depends_on ON task_dependencies(depends_on_task_id);

-- ================================
-- FILE ATTACHMENTS
-- ================================

CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100),
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attachments_task_id ON attachments(task_id);
CREATE INDEX idx_attachments_uploader_id ON attachments(uploader_id);

-- ================================
-- INTEGRATIONS (for future extensibility)
-- ================================

CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL, -- 'slack', 'github', 'google-calendar', etc.
    config JSONB NOT NULL, -- Store integration-specific settings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_integrations_team_id ON integrations(team_id);
CREATE INDEX idx_integrations_type ON integrations(integration_type);

-- ================================
-- TRIGGERS FOR UPDATED_AT
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- VIEWS FOR COMMON QUERIES
-- ================================

-- Task Summary View with all related info
CREATE VIEW task_summary AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.created_at,
    t.updated_at,
    p.name AS project_name,
    p.color AS project_color,
    p.icon AS project_icon,
    tm.name AS team_name,
    assignee.first_name || ' ' || assignee.last_name AS assignee_name,
    assignee.avatar_url AS assignee_avatar,
    reporter.first_name || ' ' || reporter.last_name AS reporter_name,
    (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id) AS subtask_count,
    (SELECT COUNT(*) FROM subtasks WHERE task_id = t.id AND completed = TRUE) AS completed_subtask_count,
    (SELECT COUNT(*) FROM comments WHERE task_id = t.id AND is_deleted = FALSE) AS comment_count
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN teams tm ON p.team_id = tm.id
LEFT JOIN users assignee ON t.assignee_id = assignee.id
LEFT JOIN users reporter ON t.reporter_id = reporter.id
WHERE t.is_deleted = FALSE;

-- Team Statistics View
CREATE VIEW team_statistics AS
SELECT 
    t.id AS team_id,
    t.name AS team_name,
    COUNT(DISTINCT tm.user_id) AS member_count,
    COUNT(DISTINCT p.id) AS project_count,
    COUNT(DISTINCT tk.id) AS total_tasks,
    COUNT(DISTINCT CASE WHEN tk.status = 'done' THEN tk.id END) AS completed_tasks
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN projects p ON t.id = p.team_id AND p.is_deleted = FALSE
LEFT JOIN tasks tk ON p.id = tk.project_id AND tk.is_deleted = FALSE
WHERE t.is_active = TRUE
GROUP BY t.id, t.name;

-- ================================
-- SAMPLE DATA INSERTION (Optional)
-- ================================

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'sarah.chen@teamflow.com', crypt('password123', gen_salt('bf')), 'Sarah', 'Chen'),
    ('550e8400-e29b-41d4-a716-446655440002', 'marcus.j@teamflow.com', crypt('password123', gen_salt('bf')), 'Marcus', 'Johnson');

-- Insert sample team
INSERT INTO teams (id, name, slug, owner_id) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'Engineering', 'engineering', '550e8400-e29b-41d4-a716-446655440001');

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'admin');

-- ================================
-- USEFUL QUERIES
-- ================================

-- Get all tasks for a user with project info
/*
SELECT * FROM task_summary 
WHERE assignee_id = 'USER_ID' 
ORDER BY due_date ASC NULLS LAST;
*/

-- Get team statistics
/*
SELECT * FROM team_statistics WHERE team_id = 'TEAM_ID';
*/

-- Get overdue tasks for a team
/*
SELECT t.*, p.name as project_name 
FROM tasks t
JOIN projects p ON t.project_id = p.id
WHERE p.team_id = 'TEAM_ID'
  AND t.status != 'done'
  AND t.due_date < NOW()
  AND t.is_deleted = FALSE
ORDER BY t.due_date;
*/