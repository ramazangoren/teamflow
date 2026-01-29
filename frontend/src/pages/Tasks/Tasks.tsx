// ================================
// src/pages/Tasks.tsx (TeamFlow)
// ================================
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  UnstyledButton,
  Box,
  TextInput,
  Select,
  Menu,
  Button,
} from "@mantine/core";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  mockTasks,
  mockProjects,
  getUserById,
  getProjectById,
  type Task,
} from "../../data/mockData";

const statusColumns = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "in-progress", label: "In Progress", color: "#f59e0b" },
  { id: "in-review", label: "In Review", color: "#3b82f6" },
  { id: "done", label: "Done", color: "#10b981" },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  // Filter tasks
  let filteredTasks = mockTasks;

  if (searchQuery) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterProject) {
    filteredTasks = filteredTasks.filter((task) => task.projectId === filterProject);
  }

  if (filterPriority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority);
  }

  // Group tasks by status
  const tasksByStatus = statusColumns.map((column) => ({
    ...column,
    tasks: filteredTasks.filter((task) => task.status === column.id),
  }));

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "gray";
      default:
        return "gray";
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: "red" };
    } else if (diffDays === 0) {
      return { text: "Due today", color: "orange" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", color: "yellow" };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: "blue" };
    } else {
      return {
        text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        color: "gray",
      };
    }
  };

  return (
    <Container size="xl" py="xl" style={{ maxWidth: 1400 }}>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Text size="xl" fw={700} mb={4}>
              Tasks
            </Text>
            <Text size="sm" c="dimmed">
              Manage and track all your tasks
            </Text>
          </Box>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => navigate("/tasks/new")}
            style={{
              background: "#667eea",
              color: "#ffffff",
            }}
          >
            New Task
          </Button>
        </Group>

        {/* Filters */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group>
            <TextInput
              placeholder="Search tasks..."
              leftSection={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: 400 }}
            />

            <Select
              placeholder="All Projects"
              leftSection={<Filter size={16} />}
              data={[
                { value: "", label: "All Projects" },
                ...mockProjects.map((p) => ({
                  value: p.id,
                  label: p.name,
                })),
              ]}
              value={filterProject}
              onChange={setFilterProject}
              clearable
              style={{ width: 200 }}
            />

            <Select
              placeholder="All Priorities"
              data={[
                { value: "", label: "All Priorities" },
                { value: "urgent", label: "Urgent" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
              value={filterPriority}
              onChange={setFilterPriority}
              clearable
              style={{ width: 180 }}
            />
          </Group>
        </Card>

        {/* Kanban Board */}
        <Box style={{ overflowX: "auto", paddingBottom: 16 }}>
          <Grid gutter="md" style={{ minWidth: 1200 }}>
            {tasksByStatus.map((column) => (
              <Grid.Col key={column.id} span={3}>
                <Card
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    background: "#f9fafb",
                    minHeight: 600,
                  }}
                >
                  {/* Column Header */}
                  <Group justify="space-between" mb="md">
                    <Group gap="xs">
                      <Box
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: column.color,
                        }}
                      />
                      <Text size="sm" fw={600}>
                        {column.label}
                      </Text>
                      <Badge size="sm" color="gray" variant="light">
                        {column.tasks.length}
                      </Badge>
                    </Group>
                  </Group>

                  {/* Tasks */}
                  <Stack gap="sm">
                    {column.tasks.map((task) => {
                      const assignee = getUserById(task.assigneeId || "");
                      const project = getProjectById(task.projectId);
                      const dueDateInfo = task.dueDate
                        ? formatDueDate(task.dueDate)
                        : null;

                      return (
                        <Card
                          key={task.id}
                          shadow="sm"
                          padding="md"
                          radius="md"
                          withBorder
                          style={{
                            background: "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "";
                            e.currentTarget.style.transform = "";
                          }}
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <Stack gap="xs">
                            {/* Task Header */}
                            <Group justify="space-between">
                              <Badge
                                size="xs"
                                color={getPriorityColor(task.priority)}
                                variant="light"
                              >
                                {task.priority}
                              </Badge>
                              <Menu position="bottom-end" shadow="sm">
                                <Menu.Target>
                                  <UnstyledButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    style={{
                                      padding: 4,
                                      borderRadius: 4,
                                      color: "#6b7280",
                                    }}
                                  >
                                    <MoreVertical size={14} />
                                  </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    leftSection={<Edit size={14} />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/tasks/${task.id}/edit`);
                                    }}
                                  >
                                    Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    leftSection={<Trash2 size={14} />}
                                    color="red"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    Delete
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>

                            {/* Task Title */}
                            <Text size="sm" fw={500} lineClamp={2}>
                              {task.title}
                            </Text>

                            {/* Task Tags */}
                            {task.tags.length > 0 && (
                              <Group gap={4}>
                                {task.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    size="xs"
                                    variant="outline"
                                    color="gray"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 2 && (
                                  <Badge size="xs" variant="outline" color="gray">
                                    +{task.tags.length - 2}
                                  </Badge>
                                )}
                              </Group>
                            )}

                            {/* Task Footer */}
                            <Group justify="space-between" mt="xs">
                              <Group gap="xs">
                                {assignee && (
                                  <Avatar
                                    size={24}
                                    radius="xl"
                                    src={assignee.avatar}
                                  >
                                    {assignee.name.charAt(0)}
                                  </Avatar>
                                )}
                                {project && (
                                  <Badge
                                    size="xs"
                                    variant="light"
                                    style={{
                                      background: `${project.color}15`,
                                      color: project.color,
                                    }}
                                  >
                                    {project.icon}
                                  </Badge>
                                )}
                              </Group>

                              {dueDateInfo && (
                                <Group gap={4}>
                                  <Calendar size={12} color="#6b7280" />
                                  <Text
                                    size="xs"
                                    c={dueDateInfo.color}
                                    fw={
                                      dueDateInfo.color === "red" ||
                                      dueDateInfo.color === "orange"
                                        ? 500
                                        : 400
                                    }
                                  >
                                    {dueDateInfo.text}
                                  </Text>
                                </Group>
                              )}
                            </Group>

                            {/* Subtasks Progress */}
                            {task.subtasks.length > 0 && (
                              <Box>
                                <Group justify="space-between" mb={4}>
                                  <Text size="xs" c="dimmed">
                                    Subtasks
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    {
                                      task.subtasks.filter((st) => st.completed)
                                        .length
                                    }
                                    /{task.subtasks.length}
                                  </Text>
                                </Group>
                                <Box
                                  style={{
                                    height: 4,
                                    background: "#e5e7eb",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    style={{
                                      height: "100%",
                                      background: column.color,
                                      width: `${
                                        (task.subtasks.filter((st) => st.completed)
                                          .length /
                                          task.subtasks.length) *
                                        100
                                      }%`,
                                      transition: "width 0.3s ease",
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}
                          </Stack>
                        </Card>
                      );
                    })}

                    {column.tasks.length === 0 && (
                      <Text size="sm" c="dimmed" ta="center" py="xl">
                        No tasks
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default Tasks;