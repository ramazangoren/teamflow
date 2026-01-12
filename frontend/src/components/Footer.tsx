import React from 'react';
import {
  Container,
  Group,
  Text,
  Stack,
  Anchor,
  Divider,
  Box,
  ActionIcon,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconMail,
  IconHeart,
} from '@tabler/icons-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Wardrobe', href: '/closet' },
      { label: 'Outfit Suggestions', href: '/outfit-suggestions' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: '#1a1b1e',
        borderTop: '1px solid #2c2e33',
        marginTop: 'auto',
      }}
    >
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Main Footer Content */}
          <Group align="flex-start" justify="space-between" wrap="wrap">
            {/* Brand Section */}
            <Stack gap="md" style={{ maxWidth: 300 }}>
              <Text
                size="xl"
                fw={700}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                StyleSync
              </Text>
              <Text size="sm" c="dimmed">
                Your personal wardrobe assistant. Organize your closet, discover outfit
                combinations, and always look your best.
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
                  href="https://instagram.com"
                  target="_blank"
                >
                  <IconBrandInstagram size={20} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="gray"
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                >
                  <IconBrandFacebook size={20} />
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
              </Group>
            </Stack>

            {/* Product Links */}
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
                  style={{ textDecoration: 'none' }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Company Links */}
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
                  style={{ textDecoration: 'none' }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Support Links */}
            <Stack gap="sm">
              <Text size="sm" fw={600} c="white">
                Support
              </Text>
              {footerLinks.support.map((link) => (
                <Anchor
                  key={link.label}
                  href={link.href}
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: 'none' }}
                  className="footer-link"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            {/* Newsletter */}
            <Stack gap="sm" style={{ maxWidth: 250 }}>
              <Text size="sm" fw={600} c="white">
                Stay Updated
              </Text>
              <Text size="xs" c="dimmed">
                Get style tips and updates delivered to your inbox.
              </Text>
              <Group gap="xs">
                <ActionIcon
                  size="lg"
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                  component="a"
                  href="mailto:hello@stylesync.com"
                >
                  <IconMail size={20} />
                </ActionIcon>
                <Text size="xs" c="dimmed">
                  hello@stylesync.com
                </Text>
              </Group>
            </Stack>
          </Group>

          <Divider color="#2c2e33" />

          {/* Bottom Bar */}
          <Group justify="space-between" align="center" wrap="wrap">
            <Text size="xs" c="dimmed">
              © {currentYear} StyleSync. All rights reserved.
            </Text>
            <Group gap="xs" align="center">
              <Text size="xs" c="dimmed">
                Made with
              </Text>
              <IconHeart size={14} style={{ color: '#e03131' }} fill="#e03131" />
              <Text size="xs" c="dimmed">
                for fashion enthusiasts
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
            color: #667eea !important;
          }
        `}
      </style>
    </Box>
  );
};

export default Footer;