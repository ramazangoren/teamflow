import React, { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Box,
  SimpleGrid,
  Loader,
  Center,
  ActionIcon,
  Modal,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconTrash,
  IconCalendar,
  IconSun,
} from '@tabler/icons-react';
import { getSavedOutfits, deleteOutfit } from '../../sevices/OutfitServices';
import type { OutfitDetails } from '../../interfaces/interfaces';

const MyOutfits = () => {
  const [savedOutfits, setSavedOutfits] = useState<OutfitDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadSavedOutfits();
  }, []);

  const loadSavedOutfits = async () => {
    try {
      setIsLoading(true);
      const data = await getSavedOutfits();
      setSavedOutfits(data);
      console.log('Saved outfits loaded:', data);
    } catch (error) {
      console.error('Error loading saved outfits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (outfitId: number) => {
    setOutfitToDelete(outfitId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!outfitToDelete) return;

    try {
      setIsDeleting(true);
      // Assuming you have a deleteOutfit function
      await deleteOutfit(outfitToDelete);
      
      // For now, just filter it out from state
      setSavedOutfits(savedOutfits.filter(outfit => outfit.id !== outfitToDelete));
      setDeleteModalOpen(false);
      setOutfitToDelete(null);
    } catch (error) {
      console.error('Error deleting outfit:', error);
      alert('Failed to delete outfit. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Center style={{ minHeight: '100vh' }}>
          <Stack align="center" gap="md">
            <Loader size="xl" color="white" />
            <Text c="white" size="lg">Loading your saved outfits...</Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="center">
            <div>
              <Group gap="md" mb="xs">
                <Button
                  component="a"
                  href="/outfit-suggestions"
                  variant="white"
                  leftSection={<IconArrowLeft size={18} />}
                  size="sm"
                >
                  Back
                </Button>
                <Title order={1} c="white">My Saved Outfits</Title>
              </Group>
              <Text c="rgba(255,255,255,0.9)" size="lg">
                {savedOutfits.length} {savedOutfits.length === 1 ? 'outfit' : 'outfits'} saved
              </Text>
            </div>
          </Group>

          {/* Empty State */}
          {savedOutfits.length === 0 ? (
            <Card shadow="lg" padding="xl" radius="lg">
              <Stack align="center" gap="md" py="xl">
                <Text size="xl" fw={500}>No saved outfits yet</Text>
                <Text c="dimmed" ta="center">
                  Start building your wardrobe by saving outfit combinations you love!
                </Text>
                <Button
                  component="a"
                  href="/outfit-suggestions"
                  size="lg"
                  mt="md"
                >
                  Browse Outfit Suggestions
                </Button>
              </Stack>
            </Card>
          ) : (
            /* Outfits Grid */
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing="lg"
            >
              {savedOutfits.map((outfit) => (
                <Card
                  key={outfit.id}
                  shadow="lg"
                  padding="lg"
                  radius="md"
                  style={{ backgroundColor: 'white', position: 'relative' }}
                >
                  <Stack gap="md">
                    {/* Delete Button */}
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      style={{ position: 'absolute', top: 10, right: 10 }}
                      onClick={() => handleDeleteClick(outfit.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>

                    {/* Outfit Items */}
                    <Group justify="center" gap="sm" wrap="wrap" mt="md">
                      {/* Top */}
                      <Stack gap={4} align="center">
                        <Box
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '2px solid #e9ecef',
                          }}
                        >
                          <img
                            src={outfit.top.imageUrl}
                            alt={outfit.top.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Text size="xs" fw={500} ta="center" lineClamp={1}>
                          {outfit.top.name}
                        </Text>
                      </Stack>

                      {/* Bottom */}
                      <Stack gap={4} align="center">
                        <Box
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '2px solid #e9ecef',
                          }}
                        >
                          <img
                            src={outfit.bottom.imageUrl}
                            alt={outfit.bottom.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Text size="xs" fw={500} ta="center" lineClamp={1}>
                          {outfit.bottom.name}
                        </Text>
                      </Stack>

                      {/* Shoes */}
                      <Stack gap={4} align="center">
                        <Box
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '2px solid #e9ecef',
                          }}
                        >
                          <img
                            src={outfit.shoes.imageUrl}
                            alt={outfit.shoes.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Text size="xs" fw={500} ta="center" lineClamp={1}>
                          {outfit.shoes.name}
                        </Text>
                      </Stack>

                      {/* Accessory */}
                      {outfit.accessory && (
                        <Stack gap={4} align="center">
                          <Box
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '2px solid #e9ecef',
                            }}
                          >
                            <img
                              src={outfit.accessory.imageUrl}
                              alt={outfit.accessory.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Text size="xs" fw={500} ta="center" lineClamp={1}>
                            {outfit.accessory.name}
                          </Text>
                        </Stack>
                      )}
                      {outfit.outerwear && (
                        <Stack gap={4} align="center">
                          <Box
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '2px solid #e9ecef',
                            }}
                          >
                            <img
                              src={outfit?.outerwear.imageUrl}
                              alt={outfit?.outerwear.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Text size="xs" fw={500} ta="center" lineClamp={1}>
                            {outfit.outerwear.name}
                          </Text>
                        </Stack>
                      )}
                      {outfit.hats && (
                        <Stack gap={4} align="center">
                          <Box
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '2px solid #e9ecef',
                            }}
                          >
                            <img
                              src={outfit?.hats.imageUrl}
                              alt={outfit?.hats.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Text size="xs" fw={500} ta="center" lineClamp={1}>
                            {outfit.hats.name}
                          </Text>
                        </Stack>
                      )}
                    </Group>

                    {/* Outfit Details */}
                    <Stack gap="xs">
                      <Group gap="xs" justify="center">
                        <Badge
                          variant="light"
                          color="grape"
                          leftSection={<IconCalendar size={14} />}
                        >
                          {outfit.occasion}
                        </Badge>
                        <Badge
                          variant="light"
                          color="cyan"
                          leftSection={<IconSun size={14} />}
                        >
                          {outfit.weather}
                        </Badge>
                      </Group>

                      <Text size="xs" c="dimmed" ta="center">
                        Saved on {formatDate(outfit.createdAt)}
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Outfit"
        centered
      >
        <Stack gap="md">
          <Text>Are you sure you want to delete this outfit? This action cannot be undone.</Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default MyOutfits;