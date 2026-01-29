import {
  Container,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  UnstyledButton,
  Box,
  Textarea,
  Button,
  Divider,
  Checkbox,
  Select,
} from "@mantine/core";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Flag,
  MessageSquare,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  mockTasks,
  mockComments,
  getUserById,
  getProjectById,
  getTaskById,
} from "../../data/mockData";

const TaskDetail = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const task = getTaskById(taskId || "");
  const [newComment, setNewComment] = useState("");

  if (!task) {
    return (
      <Container size="xl" py="xl">
        <Text>Task not found</Text>
      </Container>
    );
  }

  const project = getProjectById(task.projectId);
  const assignee = getUserById(task.assigneeId || "");
  const reporter = getUserById(task.reporterId);
  const taskComments = mockComments.filter((c) => c.taskId === task.id);

  const priorityColors = {
    urgent: "#ef4444",
    high: "#f59e0b",
    medium: "#3b82f6",
    low: "#6b7280",
  };

  const statusColors = {
    todo: "#6b7280",
    "in-progress": "#f59e0b",
    "in-review": "#3b82f6",
    done: "#10b981",
  };

  return (
    <Container size="xl" py="xl" style={{ maxWidth: 1200 }}>
      <Stack gap="lg">
        {/* Back Button */}
        <UnstyledButton
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </UnstyledButton>

        <Group align="start" gap="lg">
          {/* Main Content */}
          <Box style={{ flex: 1 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="lg">
                {/* Task Header */}
                <Group justify="space-between">
                  <Group gap="sm">
                    {project && (
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: `${project.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {project.icon}
                      </Box>
                    )}
                    <Box>
                      <Text size="xs" c="dimmed">
                        {project?.name || "No Project"}
                      </Text>
                      <Text size="xl" fw={700}>
                        {task.title}
                      </Text>
                    </Box>
                  </Group>
                  <UnstyledButton
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <MoreVertical size={18} />
                  </UnstyledButton>
                </Group>

                {/* Status & Priority */}
                <Group gap="sm">
                  <Badge
                    size="md"
                    leftSection={<CheckCircle2 size={14} />}
                    style={{
                      background: `${statusColors[task.status]}15`,
                      color: statusColors[task.status],
                    }}
                  >
                    {task.status.replace("-", " ")}
                  </Badge>
                  <Badge
                    size="md"
                    leftSection={<Flag size={14} />}
                    style={{
                      background: `${priorityColors[task.priority]}15`,
                      color: priorityColors[task.priority],
                    }}
                  >
                    {task.priority}
                  </Badge>
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      size="md"
                      variant="outline"
                      color="gray"
                      leftSection={<Tag size={12} />}
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>

                <Divider />

                {/* Description */}
                <Box>
                  <Text size="sm" fw={600} mb="xs">
                    Description
                  </Text>
                  <Text size="sm" c="dimmed">
                    {task.description ||
                      "No description provided for this task."}
                  </Text>
                </Box>

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Group justify="space-between" mb="sm">
                        <Text size="sm" fw={600}>
                          Subtasks
                        </Text>
                        <Text size="xs" c="dimmed">
                          {task.subtasks.filter((st) => st.completed).length} /{" "}
                          {task.subtasks.length} completed
                        </Text>
                      </Group>
                      <Stack gap="xs">
                        {task.subtasks.map((subtask) => (
                          <Checkbox
                            key={subtask.id}
                            label={subtask.title}
                            checked={subtask.completed}
                            onChange={() => {}}
                            styles={{
                              label: {
                                textDecoration: subtask.completed
                                  ? "line-through"
                                  : "none",
                                color: subtask.completed ? "#9ca3af" : "#111827",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                <Divider />

                {/* Comments */}
                <Box>
                  <Group justify="space-between" mb="md">
                    <Text size="sm" fw={600}>
                      Comments
                    </Text>
                    <Badge size="sm" variant="light">
                      {taskComments.length}
                    </Badge>
                  </Group>

                  <Stack gap="md">
                    {taskComments.map((comment) => {
                      const commentUser = getUserById(comment.userId);
                      return (
                        <Group key={comment.id} align="start" gap="sm">
                          <Avatar
                            size={36}
                            radius="xl"
                            src={commentUser?.avatar}
                          >
                            {commentUser?.name.charAt(0) || "U"}
                          </Avatar>
                          <Box style={{ flex: 1 }}>
                            <Group justify="space-between" mb={4}>
                              <Text size="sm" fw={500}>
                                {commentUser?.name || "Unknown User"}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                            </Group>
                            <Text size="sm" c="dimmed">
                              {comment.content}
                            </Text>
                          </Box>
                        </Group>
                      );
                    })}

                    {/* Add Comment */}
                    <Box>
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.currentTarget.value)}
                        minRows={3}
                        mb="xs"
                      />
                      <Group justify="flex-end">
                        <Button
                          size="sm"
                          disabled={!newComment.trim()}
                          style={{
                            background: "#667eea",
                            color: "#ffffff",
                          }}
                        >
                          Add Comment
                        </Button>
                      </Group>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box style={{ width: 300 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="lg">
                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Status
                  </Text>
                  <Select
                    value={task.status}
                    onChange={() => {}}
                    data={[
                      { value: "todo", label: "To Do" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "in-review", label: "In Review" },
                      { value: "done", label: "Done" },
                    ]}
                  />
                </Box>

                <Divider />

                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Assignee
                  </Text>
                  <Group gap="sm">
                    {assignee && (
                      <>
                        <Avatar size={32} radius="xl" src={assignee.avatar}>
                          {assignee.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={500}>
                            {assignee.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {assignee.email}
                          </Text>
                        </Box>
                      </>
                    )}
                    {!assignee && (
                      <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<User size={14} />}
                      >
                        Assign
                      </Button>
                    )}
                  </Group>
                </Box>

                <Divider />

                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Reporter
                  </Text>
                  <Group gap="sm">
                    {reporter && (
                      <>
                        <Avatar size={32} radius="xl" src={reporter.avatar}>
                          {reporter.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={500}>
                            {reporter.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {reporter.email}
                          </Text>
                        </Box>
                      </>
                    )}
                  </Group>
                </Box>

                <Divider />

                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Priority
                  </Text>
                  <Select
                    value={task.priority}
                    onChange={() => {}}
                    data={[
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                      { value: "urgent", label: "Urgent" },
                    ]}
                  />
                </Box>

                <Divider />

                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Due Date
                  </Text>
                  <Group gap="xs">
                    <Calendar size={16} color="#6b7280" />
                    <Text size="sm">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No due date"}
                    </Text>
                  </Group>
                </Box>

                <Divider />

                <Box>
                  <Text size="xs" c="dimmed" mb="xs">
                    Created
                  </Text>
                  <Group gap="xs">
                    <Clock size={16} color="#6b7280" />
                    <Text size="sm">
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Group>
                </Box>

                <Divider />

                <Stack gap="xs">
                  <Button
                    variant="light"
                    leftSection={<Edit size={16} />}
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                  >
                    Edit Task
                  </Button>
                  <Button
                    variant="subtle"
                    color="red"
                    leftSection={<Trash2 size={16} />}
                  >
                    Delete Task
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Box>
        </Group>
      </Stack>
    </Container>
  );
};

export default TaskDetail;