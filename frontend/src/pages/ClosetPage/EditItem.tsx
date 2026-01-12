import { Box, Button, Group, Loader, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { CATEGORIES, COLORS, PATTERNS, SEASONS } from '../../constants';
import { IconCheck, IconX } from '@tabler/icons-react';

const EditItem = ({ editModalOpen, setEditModalOpen, updating, setEditingItem, setEditFormData, editingItem, editFormData, handleEditFieldChange, handleUpdateItem }: any) => {
    return (
        <Modal
            opened={editModalOpen}
            onClose={() => {
                if (!updating) {
                    setEditModalOpen(false);
                    setEditingItem(null);
                    setEditFormData({});
                }
            }}
            title={<Text fw={700} size="lg">Edit Item</Text>}
            size="md"
            closeOnClickOutside={!updating}
            closeOnEscape={!updating}
        >
            <Stack gap="md">
                {/* Current Image */}
                {editingItem?.imageUrl && (
                    <Box>
                        <Text size="sm" fw={500} mb="xs">Current Image</Text>
                        <img
                            src={editingItem.imageUrl}
                            alt={editingItem.name}
                            style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    </Box>
                )}

                <TextInput
                    label="Item Name"
                    placeholder="e.g., Blue Denim Jacket"
                    value={editFormData.name || ''}
                    onChange={(e) => handleEditFieldChange('name', e.target.value)}
                    required
                    disabled={updating}
                />

                <Select
                    label="Category"
                    placeholder="Select category"
                    data={CATEGORIES.filter(c => c !== 'All')}
                    value={editFormData.category || ''}
                    onChange={(value) => handleEditFieldChange('category', value || '')}
                    required
                    disabled={updating}
                />

                <Select
                    label="Color"
                    placeholder="Select color"
                    data={COLORS}
                    value={editFormData.color || ''}
                    onChange={(value) => handleEditFieldChange('color', value || '')}
                    disabled={updating}
                />

                <Select
                    label="Season"
                    placeholder="Select season"
                    data={SEASONS}
                    value={editFormData.season || ''}
                    onChange={(value) => handleEditFieldChange('season', value || '')}
                    disabled={updating}
                />

                <Select
                    label="Pattern"
                    placeholder="Select pattern"
                    data={PATTERNS}
                    value={editFormData.pattern || ''}
                    onChange={(value) => handleEditFieldChange('pattern', value || '')}
                    disabled={updating}
                />

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={() => {
                            setEditModalOpen(false);
                            setEditingItem(null);
                            setEditFormData({});
                        }}
                        disabled={updating}
                        leftSection={<IconX size={16} />}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateItem}
                        disabled={updating}
                        leftSection={updating ? <Loader size="xs" color="white" /> : <IconCheck size={16} />}
                    >
                        {updating ? 'Updating...' : 'Update Item'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}

export default EditItem