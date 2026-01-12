import { Button, Group, Modal, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core"
import { Check, X } from "lucide-react"


export const UpdateProfileModel = ({ editModalOpen, setEditModalOpen, editForm, setEditForm, handleSave, saving } : any) => {


    return (
        <Modal
            opened={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title={<Text fw={600} size="lg">Edit Profile</Text>}
            size="md"
            centered
            styles={{
                title: { fontWeight: 600 },
                header: { borderBottom: '1px solid #f0f0f0' },
            }}
        >
            <Stack gap="md" p="md">
                <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={editForm.fullName || ''}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    styles={{
                        label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    type="email"
                    styles={{
                        label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    styles={{
                        label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <NumberInput
                    label="dateOfBirth"
                    placeholder="Enter your dateOfBirth"
                    value={editForm.dateOfBirth || ''}
                    onChange={(value) => setEditForm({ ...editForm, dateOfBirth: Number(value) })}
                    min={0}
                    max={150}
                    hideControls
                    styles={{
                        label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <Select
                    label="Gender"
                    placeholder="Select gender"
                    value={editForm.gender || ''}
                    onChange={(value) => setEditForm({ ...editForm, gender: value || '' })}
                    data={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Prefer not to say', label: 'Prefer not to say' },
                    ]}
                    styles={{
                        label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <Group justify="flex-end" mt="md" gap="sm">
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => setEditModalOpen(false)}
                        leftSection={<X size={16} />}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        color="dark"
                        onClick={handleSave}
                        loading={saving}
                        leftSection={<Check size={16} />}
                    >
                        Save Changes
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}