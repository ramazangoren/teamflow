import { useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Stack,
  Box,
  Grid,
  ThemeIcon,
  Paper,
  SimpleGrid,
} from '@mantine/core';
import {
  IconHeart,
  IconShirt,
} from '@tabler/icons-react';
import { Weather } from '../../components/Weather';
import { useClothingStore } from '../../stores/clothingStore';
import { useUserStore } from '../../stores/UserStore';
import RecentOutfits from './RecentOutfits';
import YourStyleMix from './YourStyleMix';
import QuickActions from './QuickActions';
import { useOutfitStore } from '../../stores/outfitStore';

const DashboardPage = () => {
  const { userInformation, loadUserInfo } = useUserStore();
  const { itemLength, updateItemLength } = useClothingStore();

  useEffect(() => {
    loadUserInfo();
    updateItemLength();
  }, []);

  const { savedOutfits, loadSavedOutfits } = useOutfitStore();

  useEffect(() => {
    loadSavedOutfits();
  }, []);


  return (
    <Box style={{ minHeight: '100vh', background: 'white' }}>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Welcome Header */}
          <Box>
            <Group justify="space-between" mb="md">
              <div>
                <Title order={1} c="#3f3f3fff" mb="xs">
                  Good Morning, {userInformation?.fullName}!
                </Title>
                <Text c="#3f3f3fff" size="lg">
                  Ready to look amazing today?
                </Text>
              </div>
            </Group>
          </Box>

          {/* Today's Weather & Quick Suggestion */}
          <Weather />

          {/* Stats Overview */}
          <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="md">
            <Paper shadow="sm" p="md" radius="md">
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" color="blue" size="lg">
                  <IconShirt size={20} />
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700}>{itemLength}</Text>
              <Text c="dimmed" size="sm">Items in Closet</Text>
            </Paper>

            <Paper shadow="sm" p="md" radius="md">
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" color="pink" size="lg">
                  <IconHeart size={20} />
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700}>{savedOutfits.length}</Text>
              <Text c="dimmed" size="sm">Saved Outfits</Text>
            </Paper>
          </SimpleGrid>

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity & Insights */}
          <Grid gutter="md">
            {/* Recent Outfits */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <RecentOutfits savedOutfits = {savedOutfits} />
            </Grid.Col>

            {/* Style Distribution */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <YourStyleMix savedOutfits={savedOutfits} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default DashboardPage;