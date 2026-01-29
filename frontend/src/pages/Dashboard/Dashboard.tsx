import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  Progress,
  UnstyledButton,
  Box,
} from "@mantine/core";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  mockProjects,
  mockTasks,
  mockActivities,
  getUserById,
  getTaskById,
  getProjectById,
} from "../../data/mockData";

const Dashboard = () => {
  const navigate = useNavigate();

  // Calculate stats
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = mockTasks.filter((t) => t.status === "in-progress").length;
  const overdueTasks = mockTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
  ).length;

  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Get upcoming tasks (next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTasks = mockTasks
    .filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) >= now &&
        new Date(t.dueDate) <= nextWeek &&
        t.status !== "done"
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  // Recent activity
  const recentActivity = mockActivities.slice(0, 6);

  return (
    <Container size="xl" py="xl" style={{ maxWidth: 1200 }}>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Text size="xl" fw={700} mb={4}>
            Dashboard
          </Text>
          <Text size="sm" c="dimmed">
            Welcome back! Here's what's happening with your projects.
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Total Tasks
                </Text>
                <CheckCircle2 size={20} color="#667eea" />
              </Group>
              <Text size="xl" fw={700}>
                {totalTasks}
              </Text>
              <Progress value={completionRate} color="violet" size="sm" mt="md" />
              <Text size="xs" c="dimmed" mt="xs">
                {completionRate}% completed
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  In Progress
                </Text>
                <Clock size={20} color="#f59e0b" />
              </Group>
              <Text size="xl" fw={700}>
                {inProgressTasks}
              </Text>
              <Text size="xs" c="dimmed" mt="md">
                Active tasks
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Completed
                </Text>
                <TrendingUp size={20} color="#10b981" />
              </Group>
              <Text size="xl" fw={700} c="green">
                {completedTasks}
              </Text>
              <Text size="xs" c="dimmed" mt="md">
                Tasks finished
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Overdue
                </Text>
                <AlertCircle size={20} color="#ef4444" />
              </Group>
              <Text size="xl" fw={700} c="red">
                {overdueTasks}
              </Text>
              <Text size="xs" c="dimmed" mt="md">
                Need attention
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          {/* Active Projects */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="lg">
                <Text size="lg" fw={600}>
                  Active Projects
                </Text>
                <UnstyledButton
                  onClick={() => navigate("/projects")}
                  style={{
                    color: "#667eea",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  View all
                  <ArrowRight size={16} />
                </UnstyledButton>
              </Group>

              <Stack gap="md">
                {mockProjects
                  .filter((p) => p.status === "active")
                  .slice(0, 4)
                  .map((project) => {
                    const progress = Math.round(
                      (project.completedCount / project.taskCount) * 100
                    );

                    return (
                      <UnstyledButton
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        style={{
                          padding: 16,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.borderColor = "#667eea";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <Group justify="space-between" mb="sm">
                          <Group gap="sm">
                            <Box
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: `${project.color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                              }}
                            >
                              {project.icon}
                            </Box>
                            <Box>
                              <Text size="sm" fw={500}>
                                {project.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {project.taskCount} tasks
                              </Text>
                            </Box>
                          </Group>
                          <Text size="sm" fw={500} c="dimmed">
                            {progress}%
                          </Text>
                        </Group>
                        <Progress
                          value={progress}
                          color={project.color}
                          size="sm"
                          radius="xl"
                        />
                      </UnstyledButton>
                    );
                  })}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Upcoming Tasks */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="lg">
                <Text size="lg" fw={600}>
                  Upcoming
                </Text>
                <UnstyledButton
                  onClick={() => navigate("/tasks")}
                  style={{
                    color: "#667eea",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  View all
                </UnstyledButton>
              </Group>

              <Stack gap="md">
                {upcomingTasks.map((task) => {
                  const assignee = getUserById(task.assigneeId || "");
                  const daysUntilDue = task.dueDate
                    ? Math.ceil(
                        (new Date(task.dueDate).getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;

                  return (
                    <UnstyledButton
                      key={task.id}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        textAlign: "left",
                      }}
                    >
                      <Text size="sm" fw={500} mb={4}>
                        {task.title}
                      </Text>
                      <Group justify="space-between">
                        <Group gap="xs">
                          {assignee && (
                            <Avatar size={20} radius="xl" src={assignee.avatar}>
                              {assignee.name.charAt(0)}
                            </Avatar>
                          )}
                          <Text size="xs" c="dimmed">
                            {daysUntilDue === 0
                              ? "Due today"
                              : `${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`}
                          </Text>
                        </Group>
                        <Badge
                          size="xs"
                          color={
                            task.priority === "urgent"
                              ? "red"
                              : task.priority === "high"
                              ? "orange"
                              : task.priority === "medium"
                              ? "blue"
                              : "gray"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </Group>
                    </UnstyledButton>
                  );
                })}

                {upcomingTasks.length === 0 && (
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    No upcoming tasks
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Activity */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="lg">
            Recent Activity
          </Text>

          <Stack gap="md">
            {recentActivity.map((activity) => {
              const user = getUserById(activity.userId);
              const task = activity.taskId ? getTaskById(activity.taskId) : null;

              return (
                <Group key={activity.id} gap="md">
                  <Avatar size={36} radius="xl" src={user?.avatar}>
                    {user?.name.charAt(0) || "U"}
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm">
                      <span style={{ fontWeight: 500 }}>{user?.name || "User"}</span>{" "}
                      {activity.content}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(activity.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                  {task && (
                    <Badge size="sm" variant="light">
                      {task.title.length > 30
                        ? task.title.substring(0, 30) + "..."
                        : task.title}
                    </Badge>
                  )}
                </Group>
              );
            })}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Dashboard;