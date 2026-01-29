import {
  Container,
  Group,
  Text,
  Stack,
  Anchor,
  Divider,
  Box,
  ActionIcon,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMail,
  IconHeart,
} from "@tabler/icons-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Task Management", href: "/tasks" },
      { label: "Team Collaboration", href: "/teams" },
      { label: "Roadmap", href: "/roadmap" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  };

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: "#0f172a",
        borderTop: "1px solid #1e293b",
        marginTop: "auto",
      }}
    >
      <Container size="xl" py="xl" style={{ maxWidth: 1200 }}>
        <Stack gap="xl">
          {/* Main footer content */}
          <Group align="flex-start" justify="space-between" wrap="wrap">
            {/* Brand */}
            <Stack gap="md" style={{ maxWidth: 320 }}>
              <Text size="xl" fw={700} c="white">
                TeamFlow
              </Text>
              <Text size="sm" c="dimmed">
                A collaborative workspace to plan, track, and deliver work
                together. Keep teams aligned and moving forward.
              </Text>
              <Group gap="xs">
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                >
                  <IconBrandTwitter size={20} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                >
                  <IconBrandLinkedin size={20} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  component="a"
                  href="https://github.com"
                  target="_blank"
                >
                  <IconBrandGithub size={20} />
                </ActionIcon>
              </Group>
            </Stack>

            {/* Product */}
            <Stack gap="sm">
              <Text size="sm" fw={600} c="white">
                Product
              </Text>
              {footerLinks.product.map((link) => (
                <Anchor
                  key={link.label}
                  href={link.href}
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Company */}
            <Stack gap="sm">
              <Text size="sm" fw={600} c="white">
                Company
              </Text>
              {footerLinks.company.map((link) => (
                <Anchor
                  key={link.label}
                  href={link.href}
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Legal */}
            <Stack gap="sm">
              <Text size="sm" fw={600} c="white">
                Legal
              </Text>
              {footerLinks.legal.map((link) => (
                <Anchor
                  key={link.label}
                  href={link.href}
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Contact */}
            <Stack gap="sm" style={{ maxWidth: 260 }}>
              <Text size="sm" fw={600} c="white">
                Contact
              </Text>
              <Text size="xs" c="dimmed">
                Questions, feedback, or enterprise inquiries.
              </Text>
              <Group gap="xs">
                <ActionIcon
                  size="lg"
                  variant="light"
                  color="blue"
                  component="a"
                  href="mailto:hello@teamflow.app"
                >
                  <IconMail size={20} />
                </ActionIcon>
                <Text size="xs" c="dimmed">
                  hello@teamflow.app
                </Text>
              </Group>
            </Stack>
          </Group>

          <Divider color="#1e293b" />

          {/* Bottom bar */}
          <Group justify="space-between" align="center" wrap="wrap">
            <Text size="xs" c="dimmed">
              © {currentYear} TeamFlow. All rights reserved.
            </Text>
            <Group gap={4} align="center">
              <Text size="xs" c="dimmed">
                Built with
              </Text>
              <IconHeart size={14} color="#ef4444" />
              <Text size="xs" c="dimmed">
                for productive teams
              </Text>
            </Group>
          </Group>
        </Stack>
      </Container>

      <style>
        {`
          .footer-link {
            transition: color 0.2s ease;
          }
          .footer-link:hover {
            color: #60a5fa !important;
          }
        `}
      </style>
    </Box>
  );
};

export default Footer;