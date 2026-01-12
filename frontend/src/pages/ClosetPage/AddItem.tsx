import {
    Box,
    Button,
    FileInput,
    Group,
    Modal,
    Select,
    Stack,
    Text,
    TextInput,
    Image,
    Loader
} from "@mantine/core";
import { IconCamera, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import {
    uploadSinglePicToFireBase,
    addClothingItem,
    validateFile,
    validateItemData,
} from "../../sevices/ItemServices";
import { COLORS, STYLES } from "../../constants";
import type { AddItemRequest, ClothingItem } from "../../interfaces/interfaces";

interface AddItemProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: (item: ClothingItem) => void;
    categories: string[];
    seasons: string[];
    patterns: string[];
}


const AddItem = ({ opened, onClose, onSuccess, categories, seasons, patterns }: AddItemProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>("");

    const [formData, setFormData] = useState<Omit<AddItemRequest, 'imageUrl'>>({
        name: '',
        category: '',
        color: '',
        season: '',
        pattern: '',
        style: ''
    });

    // Handle file selection and preview
    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setSelectedFile(null);
            setPreviewUrl("");
            return;
        }

        const validation = validateFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setError("");
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle form field changes
    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(""); // Clear error on field change
    };

    // Handle upload and add item
    const handleSubmit = async () => {
        // Validate file
        if (!selectedFile) {
            setError("Please select an image");
            return;
        }

        // Validate form data
        const validation = validateItemData({ ...formData, imageUrl: 'temp' });
        if (!validation.valid) {
            setError(validation.error || 'Invalid data');
            return;
        }

        try {
            setUploading(true);
            setError("");

            // Upload image to Firebase
            const imageUrl = await uploadSinglePicToFireBase(selectedFile);

            // Add item to database
            const newItem: AddItemRequest = {
                ...formData,
                imageUrl,
            };

            const savedItem = await addClothingItem(newItem);

            // Notify parent component
            onSuccess(savedItem);

            // Reset and close
            handleReset();
            onClose();
        } catch (err) {
            console.error("Failed to add item:", err);
            setError(err instanceof Error ? err.message : 'Failed to add item. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setError("");
        setFormData({
            name: '',
            category: '',
            color: '',
            season: '',
            pattern: '',
            style: '',
        });
    };

    // Handle modal close
    const handleClose = () => {
        if (uploading) return; // Prevent closing during upload
        handleReset();
        onClose();
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} size="lg">Add New Item</Text>}
            size="md"
            closeOnClickOutside={!uploading}
            closeOnEscape={!uploading}
        >
            <Stack gap="md">
                {/* Image Preview or Upload Placeholder */}
                {previewUrl ? (
                    <Box style={{ position: 'relative' }}>
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            radius="md"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                        <Button
                            size="xs"
                            variant="light"
                            color="red"
                            style={{ position: 'absolute', top: 10, right: 10 }}
                            onClick={handleRemoveImage}
                            disabled={uploading}
                        >
                            Remove
                        </Button>
                    </Box>
                ) : (
                    <Box
                        style={{
                            border: '2px dashed #ced4da',
                            borderRadius: '8px',
                            padding: '40px',
                            textAlign: 'center',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <IconCamera size={48} style={{ margin: '0 auto', color: '#868e96' }} />
                        <Text mt="md" c="dimmed" fw={500}>Upload a photo</Text>
                        <Text size="sm" c="dimmed">JPEG, PNG, GIF, or WebP (max 5MB)</Text>
                    </Box>
                )}

                {/* File Input */}
                <FileInput
                    label="Upload Photo"
                    placeholder="Choose file"
                    accept="image/*"
                    leftSection={<IconUpload size={16} />}
                    onChange={handleFileSelect}
                    disabled={uploading}
                    required
                />

                {/* Error Message */}
                {error && (
                    <Text c="red" size="sm">
                        {error}
                    </Text>
                )}

                {/* Form Fields */}
                <TextInput
                    label="Item Name"
                    placeholder="e.g., Blue Denim Jacket"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    required
                    disabled={uploading}
                />

                <Select
                    label="Category"
                    placeholder="Select category"
                    data={categories}
                    value={formData.category}
                    onChange={(value) => handleFieldChange('category', value || '')}
                    required
                    disabled={uploading}
                />

                <Select
                    label="Color"
                    placeholder="Select color"
                    data={COLORS}
                    value={formData.color}
                    onChange={(value) => handleFieldChange('color', value || '')}
                    disabled={uploading}
                />
                <Select
                    label="Style"
                    placeholder="Select style"
                    data={STYLES}
                    value={formData.style}
                    onChange={(value) => handleFieldChange('style', value || '')}
                    disabled={uploading}
                />

                <Select
                    label="Season"
                    placeholder="Select season"
                    data={seasons}
                    value={formData.season}
                    onChange={(value) => handleFieldChange('season', value || '')}
                    disabled={uploading}
                />

                <Select
                    label="Pattern"
                    placeholder="Select pattern"
                    data={patterns}
                    value={formData.pattern}
                    onChange={(value) => handleFieldChange('pattern', value || '')}
                    disabled={uploading}
                />

                {/* Action Buttons */}
                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={uploading || !selectedFile}
                        leftSection={uploading ? <Loader size="xs" color="white" /> : null}
                    >
                        {uploading ? 'Adding...' : 'Add Item'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AddItem;