import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Title,
    Button,
    Group,
    Stack,
    Card,
    Badge,
    Text,
    Grid,
    ActionIcon,
    Box,
    Loader,
    Center,
} from '@mantine/core';
import {
    IconHeart,
    IconHeartFilled,
    IconArrowLeft,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { getFavClothingItems, removeFavClothingItem } from '../../sevices/favservices';
import type { ClothingItem } from '../../interfaces/interfaces';

const Favorites = () => {
    const [favs, setFavs] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const favorites = await getFavClothingItems();
            setFavs(favorites);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
            console.error('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleRemoveFavorite = async (id: number) => {
        try {
            await removeFavClothingItem(id);
            setFavs(prevFavs => prevFavs.filter(item => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
            console.error('Error removing favorite:', err);
        }
    };

    if (loading) {
        return (
            <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Center style={{ minHeight: '100vh' }}>
                    <Loader size="xl" color="white" />
                </Center>
            </Box>
        );
    }

    return (
        <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Container size="xl" py="xl">
                {/* Header */}
                <Group justify="space-between" mb="xl">
                    <Group>
                        <ActionIcon
                            variant="white"
                            size="lg"
                            onClick={() => navigate(-1)}
                        >
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <Title order={1} c="white">My Favorites</Title>
                    </Group>
                    <Badge size="lg" variant="white" color="violet">
                        {favs.length} {favs.length === 1 ? 'item' : 'items'}
                    </Badge>
                </Group>

                {/* Error Message */}
                {error && (
                    <Text c="red" mb="md" size="sm" p="sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }}>
                        {error}
                    </Text>
                )}

                {/* Favorites Grid */}
                {favs.length > 0 ? (
                    <Grid gutter="md">
                        {favs.map(item => (
                            <Grid.Col key={item.id} span={{ base: 6, sm: 4, md: 3 }}>
                                <Card shadow="md" padding="lg" radius="md" withBorder>
                                    <Card.Section style={{
                                        height: 200,
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                    }}>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image';
                                            }}
                                        />
                                    </Card.Section>

                                    <Stack gap="xs" mt="md">
                                        <Text fw={600} size="sm" lineClamp={1}>{item.name}</Text>

                                        <Group gap="xs">
                                            <Badge color="violet" variant="light" size="sm">
                                                {item.category}
                                            </Badge>
                                            {item.season && (
                                                <Badge color="blue" variant="light" size="sm">
                                                    {item.season}
                                                </Badge>
                                            )}
                                        </Group>

                                        {item.color && (
                                            <Text size="xs" c="dimmed">Color: {item.color}</Text>
                                        )}

                                        {item.pattern && (
                                            <Text size="xs" c="dimmed">Pattern: {item.pattern}</Text>
                                        )}

                                        <Group gap="xs" mt="xs" justify="flex-end">
                                            <ActionIcon
                                                variant="filled"
                                                color="red"
                                                size="sm"
                                                onClick={() => handleRemoveFavorite(item.id)}
                                                title="Remove from favorites"
                                            >
                                                <IconHeartFilled size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Box style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <IconHeart size={64} stroke={1.5} style={{ color: 'white', opacity: 0.5, margin: '0 auto 20px' }} />
                        <Text size="xl" c="white" mb="md">
                            No favorites yet
                        </Text>
                        <Text size="md" c="white" mb="xl" style={{ opacity: 0.8 }}>
                            Start adding items to your favorites from your closet
                        </Text>
                        <Button
                            variant="white"
                            onClick={() => navigate('/closet')}
                            leftSection={<IconArrowLeft size={16} />}
                        >
                            Go to Closet
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Favorites;