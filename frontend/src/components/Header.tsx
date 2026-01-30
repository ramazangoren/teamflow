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
  Indicator,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  Users,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  Bell,
  Plus,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Building2,
} from "lucide-react";
import { authService, type User } from "../sevices/authServices";
import { useNavigate, useLocation } from "react-router";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    link: "/dashboard",
    icon: LayoutDashboard,
  },
  { id: "tasks", label: "Tasks", link: "/tasks", icon: CheckSquare },
  { id: "teams", label: "Teams", link: "/teams", icon: Users },
  { id: "calendar", label: "Calendar", link: "/calendar", icon: Calendar },
];

interface HeaderProps {
  unreadNotifications?: number;
}

const Header = ({ unreadNotifications = 0 }: HeaderProps) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // const isAuthenticated = authService.isAuthenticated();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isAuthenticated = !!user;

  const handleNavClick = (link: string) => {
    setOpened(false);
    navigate(link);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
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
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Container size="xl" style={{ maxWidth: 1200 }}>
          <Group justify="space-between" h={64}>
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
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="sm" fw={700} c="white">
                    TF
                  </Text>
                </Box>
                <Text size="lg" fw={600} c="#111827">
                  TeamFlow
                </Text>
              </UnstyledButton>

              {/* Team Selector */}
              {isAuthenticated && user?.currentTeam && (
                <Menu shadow="md" width={240}>
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
                      <Building2 size={16} />
                      <Text size="sm" fw={500}>
                        {user.currentTeam.name}
                      </Text>
                      <ChevronDown size={14} />
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

            {/* Desktop Nav */}
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
                        fontSize: 14,
                        fontWeight: active ? 500 : 400,
                        color: active ? "#667eea" : "#6b7280",
                        background: active ? "#eef2ff" : "transparent",
                      }}
                    >
                      <Icon size={18} />
                      {label}
                    </UnstyledButton>
                  );
                })}
              </Group>
            )}

            {/* Right Side */}
            <Group gap="sm">
              {isAuthenticated ? (
                <>
                  {/* New Task */}
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
                      fontWeight: 500,
                    }}
                  >
                    <Plus size={16} />
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
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Bell size={18} />
                    </UnstyledButton>
                  </Indicator>

                  {/* Profile */}
                  <Menu shadow="md" width={220}>
                    <Menu.Target>
                      <UnstyledButton
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: 4,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Avatar radius="xl" size={32}>
                          {user?.fullName?.[0]?.toUpperCase() ?? "U"}
                        </Avatar>
                        <ChevronDown size={14} />
                      </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>
                        <Text size="sm" fw={500}>
                          {user?.fullName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user?.email}
                        </Text>
                      </Menu.Label>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<UserIcon size={16} />}
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
                        color="red"
                        onClick={handleLogout}
                      >
                        Log out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>

                  <Burger
                    hiddenFrom="sm"
                    opened={opened}
                    onClick={() => setOpened(!opened)}
                    size="sm"
                  />
                </>
              ) : (
                <Group gap="xs">
                  <UnstyledButton onClick={() => navigate("/login")}>
                    Log in
                  </UnstyledButton>
                  <UnstyledButton
                    onClick={() => navigate("/register")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: "#667eea",
                      color: "#ffffff",
                      fontWeight: 500,
                    }}
                  >
                    Sign up
                  </UnstyledButton>
                </Group>
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
      >
        <Stack gap="xs">
          {navItems.map(({ id, label, link, icon: Icon }) => (
            <UnstyledButton
              key={id}
              onClick={() => handleNavClick(link)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 8,
              }}
            >
              <Icon size={20} />
              {label}
            </UnstyledButton>
          ))}
        </Stack>
      </Drawer>
    </>
  );
};

export default Header;
