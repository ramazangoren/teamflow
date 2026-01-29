export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "viewer";
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  status: "active" | "archived" | "on-hold";
  color: string;
  icon?: string;
  taskCount: number;
  completedCount: number;
  dueDate?: string;
  createdAt: string;
  ownerId: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "in-review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  type: "task_created" | "task_updated" | "task_completed" | "comment_added" | "user_joined";
  userId: string;
  taskId?: string;
  projectId?: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "mention" | "assignment" | "comment" | "due_date" | "status_change";
  title: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: string;
}

// ================================
// MOCK DATA
// ================================

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "owner",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "admin",
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "member",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "4",
    name: "Alex Rivera",
    email: "alex.rivera@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    role: "member",
    createdAt: "2024-01-22T10:00:00Z",
  },
  {
    id: "5",
    name: "Emily Watson",
    email: "emily.w@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "member",
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@teamflow.com",
    avatar: "https://i.pravatar.cc/150?img=14",
    role: "viewer",
    createdAt: "2024-02-01T10:00:00Z",
  },
];

export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Engineering",
    slug: "engineering",
    description: "Core product development team",
    avatar: "🚀",
    memberCount: 12,
    projectCount: 8,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "team-2",
    name: "Design",
    slug: "design",
    description: "Product design and UX research",
    avatar: "🎨",
    memberCount: 5,
    projectCount: 4,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "team-3",
    name: "Marketing",
    slug: "marketing",
    description: "Growth and marketing initiatives",
    avatar: "📊",
    memberCount: 7,
    projectCount: 6,
    createdAt: "2024-01-16T10:00:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    teamId: "team-1",
    name: "Mobile App Redesign",
    description: "Complete overhaul of the mobile application UX",
    status: "active",
    color: "#667eea",
    icon: "📱",
    taskCount: 24,
    completedCount: 12,
    dueDate: "2026-03-15",
    createdAt: "2024-11-01T10:00:00Z",
    ownerId: "1",
  },
  {
    id: "proj-2",
    teamId: "team-1",
    name: "API v2 Migration",
    description: "Migrate all endpoints to new API architecture",
    status: "active",
    color: "#f59e0b",
    icon: "⚡",
    taskCount: 18,
    completedCount: 15,
    dueDate: "2026-02-28",
    createdAt: "2024-10-15T10:00:00Z",
    ownerId: "2",
  },
  {
    id: "proj-3",
    teamId: "team-2",
    name: "Design System 2.0",
    description: "Build comprehensive design system",
    status: "active",
    color: "#ec4899",
    icon: "🎨",
    taskCount: 32,
    completedCount: 8,
    dueDate: "2026-04-30",
    createdAt: "2024-12-01T10:00:00Z",
    ownerId: "3",
  },
  {
    id: "proj-4",
    teamId: "team-3",
    name: "Q1 Campaign",
    description: "Q1 2026 marketing campaign planning and execution",
    status: "active",
    color: "#10b981",
    icon: "📢",
    taskCount: 16,
    completedCount: 10,
    dueDate: "2026-03-31",
    createdAt: "2025-12-15T10:00:00Z",
    ownerId: "1",
  },
  {
    id: "proj-5",
    teamId: "team-1",
    name: "Performance Optimization",
    description: "Improve app load times and reduce bundle size",
    status: "on-hold",
    color: "#6366f1",
    icon: "⚙️",
    taskCount: 8,
    completedCount: 3,
    createdAt: "2025-11-01T10:00:00Z",
    ownerId: "2",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Design new onboarding flow",
    description: "Create wireframes and high-fidelity designs for the improved onboarding experience",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    reporterId: "1",
    dueDate: "2026-02-10",
    tags: ["design", "ux", "onboarding"],
    subtasks: [
      { id: "st-1", title: "Research competitor onboarding", completed: true },
      { id: "st-2", title: "Create user flow diagram", completed: true },
      { id: "st-3", title: "Design wireframes", completed: false },
      { id: "st-4", title: "Create high-fidelity mockups", completed: false },
    ],
    commentCount: 5,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-28T14:30:00Z",
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Implement authentication refactor",
    description: "Refactor authentication system to use new token-based approach",
    status: "todo",
    priority: "urgent",
    assigneeId: "2",
    reporterId: "1",
    dueDate: "2026-02-05",
    tags: ["backend", "auth", "security"],
    subtasks: [],
    commentCount: 2,
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "task-3",
    projectId: "proj-2",
    title: "Update API documentation",
    description: "Document all new v2 endpoints with examples",
    status: "in-review",
    priority: "medium",
    assigneeId: "4",
    reporterId: "2",
    dueDate: "2026-02-15",
    tags: ["docs", "api"],
    subtasks: [
      { id: "st-5", title: "List all endpoints", completed: true },
      { id: "st-6", title: "Write examples", completed: true },
      { id: "st-7", title: "Add authentication guide", completed: false },
    ],
    commentCount: 8,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-27T16:20:00Z",
  },
  {
    id: "task-4",
    projectId: "proj-3",
    title: "Create component library",
    description: "Build React component library with all design system components",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    reporterId: "3",
    dueDate: "2026-03-01",
    tags: ["design-system", "components", "react"],
    subtasks: [
      { id: "st-8", title: "Button component", completed: true },
      { id: "st-9", title: "Input component", completed: true },
      { id: "st-10", title: "Modal component", completed: false },
      { id: "st-11", title: "Dropdown component", completed: false },
    ],
    commentCount: 12,
    createdAt: "2025-12-05T10:00:00Z",
    updatedAt: "2026-01-29T09:15:00Z",
  },
  {
    id: "task-5",
    projectId: "proj-1",
    title: "Fix mobile navigation bug",
    description: "Navigation drawer doesn't close properly on iOS devices",
    status: "done",
    priority: "medium",
    assigneeId: "5",
    reporterId: "4",
    tags: ["bug", "mobile", "ui"],
    subtasks: [],
    commentCount: 3,
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-26T11:30:00Z",
  },
  {
    id: "task-6",
    projectId: "proj-4",
    title: "Plan social media content calendar",
    description: "Create content calendar for Q1 2026 social media posts",
    status: "todo",
    priority: "medium",
    assigneeId: "1",
    reporterId: "1",
    dueDate: "2026-02-20",
    tags: ["marketing", "social-media", "planning"],
    subtasks: [],
    commentCount: 1,
    createdAt: "2026-01-22T10:00:00Z",
    updatedAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "task-7",
    projectId: "proj-2",
    title: "Implement rate limiting",
    description: "Add rate limiting to all API endpoints to prevent abuse",
    status: "in-progress",
    priority: "high",
    assigneeId: "2",
    reporterId: "2",
    dueDate: "2026-02-08",
    tags: ["backend", "security", "api"],
    subtasks: [
      { id: "st-12", title: "Research rate limiting strategies", completed: true },
      { id: "st-13", title: "Implement middleware", completed: false },
      { id: "st-14", title: "Add tests", completed: false },
    ],
    commentCount: 6,
    createdAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-01-28T13:45:00Z",
  },
  {
    id: "task-8",
    projectId: "proj-3",
    title: "Design color palette",
    description: "Create accessible color palette for design system",
    status: "done",
    priority: "high",
    assigneeId: "3",
    reporterId: "3",
    tags: ["design", "colors", "accessibility"],
    subtasks: [],
    commentCount: 15,
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-20T14:00:00Z",
  },
];

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    taskId: "task-1",
    userId: "1",
    content: "Great progress on the wireframes! Could you add a skip option for returning users?",
    createdAt: "2026-01-27T10:30:00Z",
  },
  {
    id: "comment-2",
    taskId: "task-1",
    userId: "3",
    content: "Good idea! I'll add that to the flow. Should be ready for review by EOD.",
    createdAt: "2026-01-27T11:15:00Z",
  },
  {
    id: "comment-3",
    taskId: "task-3",
    userId: "2",
    content: "@alex Please make sure to include the authentication examples. Those are critical.",
    createdAt: "2026-01-26T14:20:00Z",
  },
  {
    id: "comment-4",
    taskId: "task-4",
    userId: "5",
    content: "The button component looks amazing! Love the hover states.",
    createdAt: "2026-01-28T16:45:00Z",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    type: "task_completed",
    userId: "5",
    taskId: "task-5",
    projectId: "proj-1",
    content: "completed task 'Fix mobile navigation bug'",
    createdAt: "2026-01-26T11:30:00Z",
  },
  {
    id: "activity-2",
    type: "task_updated",
    userId: "3",
    taskId: "task-1",
    projectId: "proj-1",
    content: "updated task 'Design new onboarding flow'",
    createdAt: "2026-01-28T14:30:00Z",
  },
  {
    id: "activity-3",
    type: "comment_added",
    userId: "1",
    taskId: "task-1",
    projectId: "proj-1",
    content: "commented on 'Design new onboarding flow'",
    createdAt: "2026-01-27T10:30:00Z",
  },
  {
    id: "activity-4",
    type: "task_created",
    userId: "1",
    taskId: "task-6",
    projectId: "proj-4",
    content: "created task 'Plan social media content calendar'",
    createdAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "activity-5",
    type: "user_joined",
    userId: "6",
    content: "joined the team",
    createdAt: "2026-02-01T10:00:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "2",
    type: "mention",
    title: "You were mentioned",
    message: "Alex Rivera mentioned you in 'Update API documentation'",
    read: false,
    link: "/tasks/task-3",
    createdAt: "2026-01-29T09:30:00Z",
  },
  {
    id: "notif-2",
    userId: "2",
    type: "due_date",
    title: "Task due soon",
    message: "'Implement authentication refactor' is due in 2 days",
    read: false,
    link: "/tasks/task-2",
    createdAt: "2026-01-29T08:00:00Z",
  },
  {
    id: "notif-3",
    userId: "2",
    type: "assignment",
    title: "New task assigned",
    message: "Sarah Chen assigned you 'Implement rate limiting'",
    read: true,
    link: "/tasks/task-7",
    createdAt: "2026-01-28T16:20:00Z",
  },
  {
    id: "notif-4",
    userId: "2",
    type: "comment",
    title: "New comment",
    message: "Priya Patel commented on 'Design new onboarding flow'",
    read: true,
    link: "/tasks/task-1",
    createdAt: "2026-01-27T11:15:00Z",
  },
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find((project) => project.id === id);
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find((task) => task.id === id);
};

export const getTasksByProject = (projectId: string): Task[] => {
  return mockTasks.filter((task) => task.projectId === projectId);
};

export const getTasksByStatus = (status: Task["status"]): Task[] => {
  return mockTasks.filter((task) => task.status === status);
};

export const getUnreadNotifications = (userId: string): number => {
  return mockNotifications.filter((n) => n.userId === userId && !n.read).length;
};