// ================================
// src/components/Header.tsx (TeamFlow)
// ================================
import {
  Box,
  Container,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  Burger,
  Drawer,
  Stack,
  Badge,
  Indicator,
} from "@mantine/core";
import { useState } from "react";
import {
  Users,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  Bell,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Building2,
} from "lucide-react";
import { authService } from "../sevices/authServices";
import { useNavigate, useLocation } from "react-router";

const navItems = [
  { id: "dashboard", label: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", link: "/tasks", icon: CheckSquare },
  { id: "teams", label: "Teams", link: "/teams", icon: Users },
  { id: "calendar", label: "Calendar", link: "/calendar", icon: Calendar },
];

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentTeam: {
    id: string;
    name: string;
  };
}

interface HeaderProps {
  user?: User;
  unreadNotifications?: number;
}

const Header = ({ user, unreadNotifications = 0 }: HeaderProps) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleNavClick = (link: string) => {
    setOpened(false);
    navigate(link);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Box
        component="header"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container size="xl" style={{ maxWidth: 1200 }}>
          <Group justify="space-between" style={{ height: 64 }}>
            {/* Logo */}
            <Group gap="lg">
              <UnstyledButton
                onClick={() => handleNavClick("/")}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="sm" fw={700} style={{ color: "#ffffff" }}>
                    TF
                  </Text>
                </Box>
                <Text size="lg" fw={600} style={{ color: "#111827" }}>
                  TeamFlow
                </Text>
              </UnstyledButton>

              {/* Team Selector (Desktop) */}
              {isAuthenticated && user && (
                <Menu position="bottom-start" shadow="md" width={240}>
                  <Menu.Target>
                    <UnstyledButton
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        fontSize: 14,
                      }}
                    >
                      <Building2 size={16} strokeWidth={1.5} />
                      <Text size="sm" fw={500}>
                        {user.currentTeam.name}
                      </Text>
                      <ChevronDown size={14} strokeWidth={1.5} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Your Teams</Menu.Label>
                    <Menu.Item leftSection={<Building2 size={16} />}>
                      {user.currentTeam.name}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<Plus size={16} />}
                      onClick={() => navigate("/teams/new")}
                    >
                      Create Team
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <Group gap={4} visibleFrom="sm">
                {navItems.map(({ id, label, link, icon: Icon }) => {
                  const active = location.pathname === link;

                  return (
                    <UnstyledButton
                      key={id}
                      onClick={() => handleNavClick(link)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 8,
                        color: active ? "#667eea" : "#6b7280",
                        background: active ? "#eef2ff" : "transparent",
                        fontWeight: active ? 500 : 400,
                        fontSize: 14,
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "#f9fafb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <span>{label}</span>
                    </UnstyledButton>
                  );
                })}
              </Group>
            )}

            {/* Right Side Actions */}
            <Group gap="sm">
              {isAuthenticated && (
                <>
                  {/* Quick Create */}
                  <UnstyledButton
                    onClick={() => navigate("/tasks/new")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: "#667eea",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    <Plus size={16} strokeWidth={2} />
                    <Text size="sm" visibleFrom="sm">
                      New Task
                    </Text>
                  </UnstyledButton>

                  {/* Notifications */}
                  <Indicator
                    inline
                    size={16}
                    offset={4}
                    disabled={unreadNotifications === 0}
                    label={unreadNotifications > 9 ? "9+" : unreadNotifications}
                    color="red"
                  >
                    <UnstyledButton
                      onClick={() => navigate("/notifications")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        color: "#6b7280",
                      }}
                    >
                      <Bell size={18} strokeWidth={1.5} />
                    </UnstyledButton>
                  </Indicator>

                  {/* Profile Menu */}
                  <Menu position="bottom-end" shadow="md" width={220}>
                    <Menu.Target>
                      <UnstyledButton
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: 4,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                        }}
                      >
                        <Avatar size={32} radius="xl" color="violet" src={user?.avatar}>
                          {user?.name.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.5}
                          style={{ color: "#6b7280" }}
                        />
                      </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>
                        <Text size="sm" fw={500}>
                          {user?.name || "User"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user?.email || "user@example.com"}
                        </Text>
                      </Menu.Label>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<User size={16} />}
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<Settings size={16} />}
                        onClick={() => navigate("/settings")}
                      >
                        Settings
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<LogOut size={16} />}
                        onClick={handleLogout}
                        color="red"
                      >
                        Log out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              )}

              {!isAuthenticated && (
                <Group gap="xs">
                  <UnstyledButton
                    onClick={() => navigate("/login")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      color: "#6b7280",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Log in
                  </UnstyledButton>
                  <UnstyledButton
                    onClick={() => navigate("/signup")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "#667eea",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Sign up
                  </UnstyledButton>
                </Group>
              )}

              {/* Mobile Burger */}
              {isAuthenticated && (
                <Burger
                  hiddenFrom="sm"
                  opened={opened}
                  onClick={() => setOpened(!opened)}
                  size="sm"
                />
              )}
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="xs"
        padding="md"
        title={
          <Text size="lg" fw={600}>
            TeamFlow
          </Text>
        }
      >
        <Stack gap="xs">
          {navItems.map(({ id, label, link, icon: Icon }) => {
            const active = location.pathname === link;

            return (
              <UnstyledButton
                key={id}
                onClick={() => handleNavClick(link)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 8,
                  color: active ? "#667eea" : "#111827",
                  background: active ? "#eef2ff" : "transparent",
                  fontWeight: active ? 500 : 400,
                  fontSize: 15,
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{label}</span>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Drawer>
    </>
  );
};

export default Header;