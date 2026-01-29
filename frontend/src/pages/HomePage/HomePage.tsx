import { Container, Grid, Title, Text, Button, Group, Card, Stack, Badge } from '@mantine/core';
import { IconChecklist, IconUsers, IconGitBranch, IconChartBar } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
      {/* Hero Section */}
      <Container size="lg" py={120}>
        <Grid align="center" gutter={60}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge size="lg" variant="light" mb="md">
                Workflow-driven team collaboration
              </Badge>
              <Title order={1} size="3rem" fw={800}>
                Keep your team
                <br />
                in flow.
              </Title>
              <Text size="lg" c="dimmed" mt="md">
                TeamFlow helps teams plan, track, and ship work with clarity.
                Custom workflows, real-time collaboration, and actionable
                insights—without the complexity.
              </Text>
              <Group mt="xl">
                <Button size="lg">Get started</Button>
                <Button size="lg" variant="light">
                  View demo
                </Button>
              </Group>
            </motion.div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card radius="xl" shadow="md" p="xl">
                <Stack gap="md">
                  <FeatureRow
                    icon={<IconChecklist size={22} />}
                    title="Projects & Tasks"
                    description="Plan work with projects, tasks, priorities, and due dates."
                  />
                  <FeatureRow
                    icon={<IconGitBranch size={22} />}
                    title="Custom Workflows"
                    description="Define your own task statuses and team flow per project."
                  />
                  <FeatureRow
                    icon={<IconUsers size={22} />}
                    title="Team Collaboration"
                    description="Comments, mentions, activity logs, and notifications."
                  />
                  <FeatureRow
                    icon={<IconChartBar size={22} />}
                    title="Insights & Analytics"
                    description="Track cycle time, throughput, and team performance."
                  />
                </Stack>
              </Card>
            </motion.div>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Value Proposition Section */}
      <Container size="lg" pb={120}>
        <Grid gutter={40}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card radius="xl" shadow="sm" p="xl">
              <Title order={3} mb="sm">
                Built for teams
              </Title>
              <Text c="dimmed">
                Multi-tenant by design with roles, permissions, and secure
                collaboration across organizations.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card radius="xl" shadow="sm" p="xl">
              <Title order={3} mb="sm">
                Workflow-first
              </Title>
              <Text c="dimmed">
                Your process matters. Model your real workflow—not a rigid
                template.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card radius="xl" shadow="sm" p="xl">
              <Title order={3} mb="sm">
                Scales with you
              </Title>
              <Text c="dimmed">
                Start simple, grow into automation, analytics, and AI-powered
                planning.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Group align="flex-start" gap="md">
      <div>{icon}</div>
      <div>
        <Text fw={600}>{title}</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  );
}
