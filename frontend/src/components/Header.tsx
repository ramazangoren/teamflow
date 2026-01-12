import {
  Box,
  Container,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  Burger,
} from "@mantine/core";
import { useState } from "react";
import {
  User,
  LayoutDashboard,
  Shirt,
  Palette,
} from "lucide-react";
import { logout } from "../sevices/authServices";
import { useNavigate } from "react-router";

const navItems = [
  { id: "dashboard", label: "Dashboard", link: "/", icon: LayoutDashboard },
  { id: "closet", label: "Closet", link: "/closet", icon: Shirt },
  { id: "outfits", label: "Outfits", link: "/outfits", icon: Palette },
];

const Header = () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate()

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleNavClick = (id: string, link: string) => {
    setActive(id);
    setOpened(false);
    navigate(`${link}`)

  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Box
      component="header"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Container size="xl" style={{ maxWidth: 1200 }}>
        <Group justify="space-between" style={{ height: 72 }}>
          {/* Logo */}
          <UnstyledButton
            onClick={() => handleNavClick("dashboard", 'dashboard')}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text
              size="lg"
              fw={600}
              style={{
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Fit
            </Text>
            <Text
              size="lg"
              fw={300}
              style={{
                color: "#6b7280",
                letterSpacing: "-0.02em",
              }}
            >
              Check
            </Text>
          </UnstyledButton>

          {/* Desktop Navigation */}
          <Group gap={4} visibleFrom="sm">
            {navItems.map(({ id, label, link, icon: Icon }) => (
              <UnstyledButton
                key={id}
                onClick={() => handleNavClick(id, link)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  color: active === id ? "#111827" : "#6b7280",
                  background: active === id ? "#f3f4f6" : "transparent",
                  fontWeight: active === id ? 500 : 400,
                  fontSize: 14,
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (active !== id) {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.color = "#111827";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== id) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{label}</span>
              </UnstyledButton>
            ))}
          </Group>

          {/* Profile & Mobile Menu */}
          <Group gap="sm">
            <Menu position="bottom-end" shadow="sm" width={180}>
              <Menu.Target>
                <UnstyledButton
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 6,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <Avatar size={32} radius="xl" style={{ background: "#111827" }}>
                    <User size={16} strokeWidth={1.5} />
                  </Avatar>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <Menu.Item
                  component="a"
                  href="/profile"
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href="/myoutfits"
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  My Outfits
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href="/favorites"
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  Favorites
                </Menu.Item>
                <Menu.Item
                  component="a"
                  href="/preferences"
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  Preferences
                </Menu.Item>

                <Menu.Divider style={{ margin: "4px 0" }} />

                <Menu.Item
                  onClick={handleLogout}
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: isAuthenticated ? "#dc2626" : "#111827",
                  }}
                >
                  {isAuthenticated ? "Log Out" : "Log In"}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Burger
              hiddenFrom="sm"
              opened={opened}
              onClick={() => setOpened(!opened)}
              size="sm"
              color="#111827"
            />
          </Group>
        </Group>

        {/* Mobile Navigation */}
        {opened && (
          <Box pb="md" hiddenFrom="sm">
            {navItems.map(({ id, label, link, icon: Icon }) => (
              <UnstyledButton
                key={id}
                onClick={() => handleNavClick(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  marginBottom: 4,
                  color: active === id ? "#111827" : "#6b7280",
                  background: active === id ? "#f3f4f6" : "transparent",
                  fontWeight: active === id ? 500 : 400,
                  fontSize: 15,
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{label}</span>
              </UnstyledButton>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Header;