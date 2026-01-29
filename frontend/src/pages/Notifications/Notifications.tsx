import {
  Container,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  UnstyledButton,
  Box,
  Tabs,
} from "@mantine/core";
import {
  Bell,
  Check,
  AtSign,
  UserPlus,
  MessageCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockNotifications } from "../../data/mockData";

const Notifications = () => {
  const navigate = useNavigate();

  const unreadNotifications = mockNotifications.filter((n) => !n.read);
  const readNotifications = mockNotifications.filter((n) => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return <AtSign size={18} color="#667eea" />;
      case "assignment":
        return <UserPlus size={18} color="#10b981" />;
      case "comment":
        return <MessageCircle size={18} color="#3b82f6" />;
      case "due_date":
        return <Calendar size={18} color="#f59e0b" />;
      case "status_change":
        return <AlertCircle size={18} color="#8b5cf6" />;
      default:
        return <Bell size={18} color="#6b7280" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "mention":
        return "#667eea";
      case "assignment":
        return "#10b981";
      case "comment":
        return "#3b82f6";
      case "due_date":
        return "#f59e0b";
      case "status_change":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const NotificationItem = ({ notification }: { notification: any }) => (
    <UnstyledButton
      onClick={() => {
        navigate(notification.link);
      }}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: notification.read ? "#ffffff" : "#f9fafb",
        textAlign: "left",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f3f4f6";
        e.currentTarget.style.borderColor = "#667eea";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.read
          ? "#ffffff"
          : "#f9fafb";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <Group align="start" gap="md" wrap="nowrap">
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: `${getNotificationColor(notification.type)}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {getNotificationIcon(notification.type)}
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" mb={4}>
            <Text size="sm" fw={notification.read ? 400 : 600}>
              {notification.title}
            </Text>
            {!notification.read && (
              <Box
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#667eea",
                  flexShrink: 0,
                }}
              />
            )}
          </Group>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {notification.message}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {formatTimestamp(notification.createdAt)}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  );

  return (
    <Container size="xl" py="xl" style={{ maxWidth: 900 }}>
      <Stack gap="lg">
        {/* Header */}
        <Box>
          <Text size="xl" fw={700} mb={4}>
            Notifications
          </Text>
          <Text size="sm" c="dimmed">
            Stay updated on your tasks and team activity
          </Text>
        </Box>

        {/* Stats */}
        <Group>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="sm">
              <Bell size={20} color="#667eea" />
              <Box>
                <Text size="xs" c="dimmed">
                  Unread
                </Text>
                <Text size="lg" fw={700}>
                  {unreadNotifications.length}
                </Text>
              </Box>
            </Group>
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="sm">
              <Check size={20} color="#10b981" />
              <Box>
                <Text size="xs" c="dimmed">
                  Total
                </Text>
                <Text size="lg" fw={700}>
                  {mockNotifications.length}
                </Text>
              </Box>
            </Group>
          </Card>
        </Group>

        {/* Notifications Tabs */}
        <Tabs defaultValue="unread">
          <Tabs.List>
            <Tabs.Tab
              value="unread"
              leftSection={<Bell size={16} />}
              rightSection={
                unreadNotifications.length > 0 ? (
                  <Badge size="sm" color="violet" variant="filled">
                    {unreadNotifications.length}
                  </Badge>
                ) : null
              }
            >
              Unread
            </Tabs.Tab>
            <Tabs.Tab value="all" leftSection={<Check size={16} />}>
              All Notifications
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="unread" pt="lg">
            <Stack gap="sm">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                  <Stack align="center" gap="sm">
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={24} color="#6b7280" />
                    </Box>
                    <Text size="sm" fw={500} c="dimmed">
                      All caught up!
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      You have no unread notifications
                    </Text>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="lg">
            <Stack gap="sm">
              {mockNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default Notifications;