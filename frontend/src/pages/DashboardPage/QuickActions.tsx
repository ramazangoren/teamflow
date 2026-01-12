import { Box, Card, Grid, Group, Text, ThemeIcon, Title } from '@mantine/core'
import { IconArrowRight, IconHanger, IconPhoto, IconSparkles, IconTrendingUp } from '@tabler/icons-react'
import { Link } from 'react-router'

const quickActions = [
  {
    icon: IconSparkles,
    title: "What to Wear Today?",
    description: "Get AI-powered outfit for today",
    color: "violet",
    link: "/daily",
  },
  {
    icon: IconHanger,
    title: "My Closet",
    description: "Browse your wardrobe",
    color: "blue",
    link: "/closet",
  },
  {
    icon: IconPhoto,
    title: "Create Outfit",
    description: "Mix and match items",
    color: "grape",
    link: "/outfits",
  },
  {
    icon: IconTrendingUp,
    title: "Style Stats",
    description: "View your fashion insights",
    color: "orange",
    link: "/stats",
  },
];

const QuickActions = () => {
  return (
    <Box>
      <Title order={3} c="#3f3f3fff" mb="md">Quick Actions</Title>
      <Grid gutter="md">
        {quickActions.map((action, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
            <Card
              component={Link}
              to={action.link}
              shadow="md"
              padding="lg"
              radius="md"
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Group>
                <ThemeIcon size={50} radius="md" variant="light" color={action.color}>
                  <action.icon size={28} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text fw={600} size="md" mb={4}>{action.title}</Text>
                  <Text c="dimmed" size="sm">{action.description}</Text>
                </Box>
                <IconArrowRight size={20} color="#adb5bd" />
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

export default QuickActions