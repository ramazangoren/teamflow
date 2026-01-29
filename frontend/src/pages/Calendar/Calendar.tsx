import {
  Container,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  UnstyledButton,
  Box,
  Select,
  Grid,
} from "@mantine/core";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockTasks, getUserById, getProjectById } from "../../data/mockData";

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<string>("month");

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentDate);

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return mockTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
      return taskDate === dateString;
    });
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Build calendar grid
  const calendarDays = [];
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startingDayOfWeek + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = isCurrentMonth ? new Date(year, month, dayNumber) : null;
    const isToday =
      date &&
      date.toDateString() === new Date().toDateString();

    const tasksForDay = date ? getTasksForDate(date) : [];

    calendarDays.push({
      dayNumber: isCurrentMonth ? dayNumber : null,
      date,
      isToday,
      tasks: tasksForDay,
    });
  }

  return (
    <Container size="xl" py="xl" style={{ maxWidth: 1400 }}>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Text size="xl" fw={700} mb={4}>
              Calendar
            </Text>
            <Text size="sm" c="dimmed">
              View tasks and deadlines on a calendar
            </Text>
          </Box>
        </Group>

        {/* Calendar Controls */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Group gap="sm">
              <UnstyledButton
                onClick={goToPreviousMonth}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronLeft size={18} />
              </UnstyledButton>
              <UnstyledButton
                onClick={goToNextMonth}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight size={18} />
              </UnstyledButton>
              <Text size="lg" fw={600}>
                {monthName} {year}
              </Text>
            </Group>

            <Group gap="sm">
              <UnstyledButton
                onClick={goToToday}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Today
              </UnstyledButton>
              <Select
                value={view}
                onChange={(value) => setView(value || "month")}
                data={[
                  { value: "month", label: "Month" },
                  { value: "week", label: "Week" },
                  { value: "day", label: "Day" },
                ]}
                style={{ width: 120 }}
              />
            </Group>
          </Group>
        </Card>

        {/* Calendar Grid */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          {/* Weekday Headers */}
          <Grid gutter={0} mb="xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Grid.Col key={day} span={12 / 7}>
                <Text
                  size="xs"
                  fw={600}
                  ta="center"
                  c="dimmed"
                  style={{ padding: "8px 0" }}
                >
                  {day}
                </Text>
              </Grid.Col>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid gutter={1}>
            {calendarDays.map((day, index) => (
              <Grid.Col key={index} span={12 / 7}>
                <UnstyledButton
                  onClick={() => {
                    if (day.date) {
                      // Navigate to tasks filtered by this date
                      navigate(`/tasks?date=${day.date.toISOString()}`);
                    }
                  }}
                  disabled={!day.dayNumber}
                  style={{
                    width: "100%",
                    minHeight: 120,
                    padding: 8,
                    borderRadius: 8,
                    border: day.isToday
                      ? "2px solid #667eea"
                      : "1px solid #e5e7eb",
                    background: day.isToday
                      ? "#eef2ff"
                      : day.dayNumber
                      ? "#ffffff"
                      : "#f9fafb",
                    textAlign: "left",
                    cursor: day.dayNumber ? "pointer" : "default",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (day.dayNumber) {
                      e.currentTarget.style.background = day.isToday
                        ? "#e0e7ff"
                        : "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (day.dayNumber) {
                      e.currentTarget.style.background = day.isToday
                        ? "#eef2ff"
                        : "#ffffff";
                    }
                  }}
                >
                  <Stack gap={4} style={{ height: "100%" }}>
                    {day.dayNumber && (
                      <>
                        <Text
                          size="sm"
                          fw={day.isToday ? 700 : 500}
                          c={day.isToday ? "#667eea" : "#111827"}
                        >
                          {day.dayNumber}
                        </Text>

                        {/* Tasks for this day */}
                        <Stack gap={2}>
                          {day.tasks.slice(0, 3).map((task) => {
                            const project = getProjectById(task.projectId);
                            const assignee = getUserById(task.assigneeId || "");

                            return (
                              <Box
                                key={task.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks/${task.id}`);
                                }}
                                style={{
                                  padding: "4px 6px",
                                  borderRadius: 4,
                                  background: project ? `${project.color}15` : "#f3f4f6",
                                  borderLeft: `3px solid ${project?.color || "#6b7280"}`,
                                }}
                              >
                                <Text
                                  size="xs"
                                  fw={500}
                                  lineClamp={1}
                                  style={{ color: project?.color || "#111827" }}
                                >
                                  {task.title}
                                </Text>
                              </Box>
                            );
                          })}

                          {day.tasks.length > 3 && (
                            <Text size="xs" c="dimmed" ta="center" mt={2}>
                              +{day.tasks.length - 3} more
                            </Text>
                          )}
                        </Stack>
                      </>
                    )}
                  </Stack>
                </UnstyledButton>
              </Grid.Col>
            ))}
          </Grid>
        </Card>

        {/* Upcoming Tasks Sidebar */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Tasks This Month
              </Text>
              <Stack gap="sm">
                {mockTasks
                  .filter((task) => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return (
                      taskDate.getMonth() === month &&
                      taskDate.getFullYear() === year &&
                      task.status !== "done"
                    );
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.dueDate!).getTime();
                    const dateB = new Date(b.dueDate!).getTime();
                    return dateA - dateB;
                  })
                  .slice(0, 8)
                  .map((task) => {
                    const project = getProjectById(task.projectId);
                    const assignee = getUserById(task.assigneeId || "");
                    const dueDate = task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
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
                        <Group justify="space-between" wrap="nowrap">
                          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
                            {project && (
                              <Box
                                style={{
                                  width: 4,
                                  height: 32,
                                  borderRadius: 2,
                                  background: project.color,
                                }}
                              />
                            )}
                            <Box style={{ flex: 1, minWidth: 0 }}>
                              <Text size="sm" fw={500} lineClamp={1}>
                                {task.title}
                              </Text>
                              <Group gap="xs" mt={2}>
                                {assignee && (
                                  <Group gap={4}>
                                    <Text size="xs" c="dimmed">
                                      {assignee.name}
                                    </Text>
                                  </Group>
                                )}
                                {dueDate && (
                                  <Group gap={4}>
                                    <CalendarIcon size={12} color="#6b7280" />
                                    <Text size="xs" c="dimmed">
                                      {dueDate}
                                    </Text>
                                  </Group>
                                )}
                              </Group>
                            </Box>
                          </Group>
                          <Badge
                            size="sm"
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
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Overview
              </Text>
              <Stack gap="md">
                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="dimmed">
                      Total Tasks
                    </Text>
                    <Text size="sm" fw={600}>
                      {
                        mockTasks.filter((t) => {
                          if (!t.dueDate) return false;
                          const taskDate = new Date(t.dueDate);
                          return (
                            taskDate.getMonth() === month &&
                            taskDate.getFullYear() === year
                          );
                        }).length
                      }
                    </Text>
                  </Group>
                </Box>

                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="dimmed">
                      Completed
                    </Text>
                    <Text size="sm" fw={600} c="green">
                      {
                        mockTasks.filter((t) => {
                          if (!t.dueDate || t.status !== "done") return false;
                          const taskDate = new Date(t.dueDate);
                          return (
                            taskDate.getMonth() === month &&
                            taskDate.getFullYear() === year
                          );
                        }).length
                      }
                    </Text>
                  </Group>
                </Box>

                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="dimmed">
                      In Progress
                    </Text>
                    <Text size="sm" fw={600} c="blue">
                      {
                        mockTasks.filter((t) => {
                          if (!t.dueDate || t.status !== "in-progress")
                            return false;
                          const taskDate = new Date(t.dueDate);
                          return (
                            taskDate.getMonth() === month &&
                            taskDate.getFullYear() === year
                          );
                        }).length
                      }
                    </Text>
                  </Group>
                </Box>

                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="dimmed">
                      Overdue
                    </Text>
                    <Text size="sm" fw={600} c="red">
                      {
                        mockTasks.filter((t) => {
                          if (!t.dueDate || t.status === "done") return false;
                          const taskDate = new Date(t.dueDate);
                          return taskDate < new Date();
                        }).length
                      }
                    </Text>
                  </Group>
                </Box>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Calendar;