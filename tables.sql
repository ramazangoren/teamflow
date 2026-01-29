CREATE TABLE users (
    id              CHAR(36) PRIMARY KEY,
    email           VARCHAR(256) NOT NULL UNIQUE,
    password_hash   VARCHAR(512) NOT NULL,
    full_name       VARCHAR(200),
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE refresh_tokens (
    id          CHAR(36) PRIMARY KEY,
    user_id     CHAR(36) NOT NULL,
    token       VARCHAR(512) NOT NULL,
    expires_at  DATETIME NOT NULL,
    revoked     TINYINT(1) NOT NULL DEFAULT 0,

    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);


CREATE TABLE teams (
    id          CHAR(36) PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at  DATETIME NULL
) ENGINE=InnoDB;


CREATE TABLE team_members (
    team_id     CHAR(36) NOT NULL,
    user_id     CHAR(36) NOT NULL,
    role        VARCHAR(50) NOT NULL,
    is_owner    TINYINT(1) NOT NULL DEFAULT 0,
    joined_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (team_id, user_id),

    CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_team_single_owner UNIQUE (team_id, is_owner)
) ENGINE=InnoDB;


CREATE TABLE projects (
    id          CHAR(36) PRIMARY KEY,
    team_id     CHAR(36) NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at  DATETIME NULL,

    CONSTRAINT fk_project_team FOREIGN KEY (team_id) REFERENCES teams(id)
) ENGINE=InnoDB;

CREATE INDEX idx_projects_team ON projects(team_id);


CREATE TABLE workflow_statuses (
    id          CHAR(36) PRIMARY KEY,
    project_id  CHAR(36) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    sort_order  INT NOT NULL,

    CONSTRAINT fk_status_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT uq_status_order UNIQUE (project_id, sort_order),
    CONSTRAINT uq_status_name UNIQUE (project_id, name)
) ENGINE=InnoDB;


CREATE TABLE tasks (
    id              CHAR(36) PRIMARY KEY,
    project_id      CHAR(36) NOT NULL,
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    status_id       CHAR(36) NOT NULL,
    priority        INT NOT NULL DEFAULT 3,
    assignee_id     CHAR(36),
    due_date        DATETIME,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      DATETIME NULL,

    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT fk_task_status FOREIGN KEY (status_id) REFERENCES workflow_statuses(id),
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);



CREATE TABLE task_comments (
    id          CHAR(36) PRIMARY KEY,
    task_id     CHAR(36) NOT NULL,
    user_id     CHAR(36) NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tasks(id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;


CREATE TABLE activity_logs (
    id          CHAR(36) PRIMARY KEY,
    team_id     CHAR(36) NOT NULL,
    user_id     CHAR(36) NOT NULL,
    action      VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100),
    entity_id   CHAR(36),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_team FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_activity_team ON activity_logs(team_id);


