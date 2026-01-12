import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Title,
    TextInput,
    Button,
    Group,
    Stack,
    Card,
    Badge,
    Text,
    Grid,
    ActionIcon,
    Chip,
    Box,
    Loader,
    Center,
} from '@mantine/core';
import {
    IconSearch,
    IconPlus,
    IconEdit,
    IconTrash,
    IconHeart,
} from '@tabler/icons-react';
import AddItem from './AddItem';
import {
    getClothingItems,
    deleteClothingItem,
    updateClothingItem,
} from '../../sevices/ItemServices';
import { CATEGORIES, PATTERNS, SEASONS } from '../../constants';
import type { AddItemRequest, ClothingItem } from '../../interfaces/interfaces';
import { addFavClothingItem, getFavClothingItems, removeFavClothingItem } from '../../sevices/favservices';
import EditItem from './EditItem';

const ClosetPage = () => {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [favoritedItems, setFavoritedItems] = useState<Set<number>>(new Set());

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<AddItemRequest>>({});
    const [updating, setUpdating] = useState(false);

    // Fetch items from backend
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getClothingItems();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch items');
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch favorites on mount
    const fetchFavorites = useCallback(async () => {
        try {
            const favs = await getFavClothingItems();
            setFavoritedItems(new Set(favs.map(item => item.id)));
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    }, []);

    useEffect(() => {
        fetchItems();
        fetchFavorites();
    }, [fetchItems, fetchFavorites]);

    // Filter items based on category and search term
    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.color.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle adding a new item
    const handleAddItem = (savedItem: ClothingItem) => {
        setItems(prevItems => [...prevItems, savedItem]);
        setUploadModalOpen(false);
    };

    // Handle opening edit modal
    const handleEditItem = (item: ClothingItem) => {
        setEditingItem(item);
        setEditFormData({
            name: item.name,
            category: item.category,
            color: item.color,
            season: item.season,
            pattern: item.pattern,
            imageUrl: item.imageUrl,
            style: item.style,
        });
        setEditModalOpen(true);
    };

    // Handle updating an item
    const handleUpdateItem = async () => {
        if (!editingItem) return;

        try {
            setUpdating(true);
            setError('');

            const updatedItem = await updateClothingItem(editingItem.id, editFormData);

            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === editingItem.id ? updatedItem : item
                )
            );

            setEditModalOpen(false);
            setEditingItem(null);
            setEditFormData({});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item');
            console.error('Error updating item:', err);
        } finally {
            setUpdating(false);
        }
    };

    // Handle deleting an item
    const handleDeleteItem = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await deleteClothingItem(id);
            setItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item');
            console.error('Error deleting item:', err);
        }
    };

    // Toggle favorite status
    const handleToggleFavorite = async (id: number) => {
        try {
            const isFavorited = favoritedItems.has(id);

            if (isFavorited) {
                // Remove from favorites
                await removeFavClothingItem(id);
                setFavoritedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            } else {
                // Add to favorites
                await addFavClothingItem(id);
                setFavoritedItems(prev => new Set([...prev, id]));
            }
        } catch (err) {
            if (err instanceof Error && err.message.includes('already in favorites')) {
                setError('This item is already in your favorites');
            } else {
                setError(err instanceof Error ? err.message : `Failed to ${favoritedItems.has(id) ? 'remove from' : 'add to'} favorites`);
            }
            console.error('Error toggling favorite:', err);
        }
    };

    // Handle edit form field change
    const handleEditFieldChange = (field: keyof AddItemRequest, value: string) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
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
        <Box style={{ minHeight: '100vh', background: 'white' }}>
            <Container size="xl" py="xl">
                {/* Header */}
                <Group justify="space-between" mb="xl">
                    <Title order={1} c="black">My Closet</Title>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        onClick={() => setUploadModalOpen(true)}
                        size="md"
                        variant="white"
                    >
                        Add Item
                    </Button>
                </Group>

                {/* Error Message */}
                {error && (
                    <Text c="red" mb="md" size="sm" p="sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }}>
                        {error}
                    </Text>
                )}

                {/* Search and Filter */}
                <Stack gap="md" mb="xl">
                    <TextInput
                        placeholder="Search by name or color..."
                        leftSection={<IconSearch size={20} />}
                        size="md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        styles={{ input: { backgroundColor: 'white' } }}
                    />

                    <Chip.Group value={selectedCategory} onChange={(value) => setSelectedCategory(value as string)}>
                        <Group gap="xs">
                            {CATEGORIES.map(cat => (
                                <Chip key={cat} value={cat} variant="filled">
                                    {cat}
                                </Chip>
                            ))}
                        </Group>
                    </Chip.Group>
                </Stack>

                {/* Items Grid */}
                {filteredItems.length > 0 ? (
                    <Grid gutter="md">
                        {filteredItems.map(item => (
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

                                        <Group gap="xs" mt="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="gray"
                                                size="sm"
                                                onClick={() => handleEditItem(item)}
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                size="sm"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant={favoritedItems.has(item.id) ? "filled" : "light"}
                                                color={favoritedItems.has(item.id) ? "red" : "gray"}
                                                size="sm"
                                                onClick={() => handleToggleFavorite(item.id)}
                                            >
                                                <IconHeart size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Box style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Text size="xl" c="white" mb="md">
                            {searchTerm || selectedCategory !== 'All'
                                ? 'No items match your search'
                                : 'No items in your closet yet'}
                        </Text>
                        <Button
                            variant="white"
                            onClick={() => setUploadModalOpen(true)}
                        >
                            Add your first item
                        </Button>
                    </Box>
                )}
            </Container>

            {/* Add Item Modal */}
            <AddItem
                opened={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onSuccess={handleAddItem}
                categories={CATEGORIES.filter(c => c !== 'All')}
                seasons={SEASONS}
                patterns={PATTERNS}
            />

            {/* Edit Item Modal */}
            < EditItem 
                editModalOpen={editModalOpen} 
                setEditModalOpen={setEditModalOpen} 
                updating={updating} 
                setEditingItem={setEditingItem} 
                setEditFormData={setEditFormData} 
                editingItem={editingItem} 
                editFormData={editFormData} 
                handleEditFieldChange={handleEditFieldChange} 
                handleUpdateItem={handleUpdateItem} 
            />
        </Box>
    );
};

export default ClosetPage;