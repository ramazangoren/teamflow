// Profile.tsx
import { useEffect, useState } from "react";
import { Container, Paper, Group, Avatar, Text, Stack, Loader, Box, Grid, Button, Modal, TextInput, Select } from "@mantine/core";
import { Mail, Calendar, Phone, MapPin, Edit, X, Check } from "lucide-react";
import type { UpdateUserData } from "../../interfaces/interfaces";
import { formatDate, getInitials } from "../../utilities/utilities";
import { useUserStore } from "../../stores/UserStore";

const Profile = () => {
  const { userInformation, loading, error, loadUserInfo, updateUserData, clearError } = useUserStore();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserData>({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    updatedAt: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  useEffect(() => {
    if (userInformation) {
      setEditForm({
        fullName: userInformation.fullName || '',
        phoneNumber: userInformation.phoneNumber || '',
        dateOfBirth: userInformation.dateOfBirth || '',
        gender: userInformation.gender || '',
        updatedAt: new Date().toISOString()
      });
    }
  }, [userInformation]);

  const handleEditClick = () => {
    if (userInformation) {
      setEditForm({
        fullName: userInformation.fullName || '',
        phoneNumber: userInformation.phoneNumber || '',
        dateOfBirth: userInformation.dateOfBirth || '',
        gender: userInformation.gender || '',
        updatedAt: new Date().toISOString()
      });
    }
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserData(editForm);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <Loader size="md" color="dark" />
      </Box>
    );
  }

  if (error || !userInformation) {
    return (
      <Box style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <Stack align="center" gap="md">
          <Text size="sm" c="dimmed">{error}</Text>
          <Button
            variant="filled"
            color="dark"
            size="sm"
            onClick={() => {
              clearError();
              loadUserInfo();
            }}
          >
            Retry
          </Button>
        </Stack>
      </Box>
    );
  }

  const InfoCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <Paper
      p="lg"
      radius="md"
      style={{
        background: 'white',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Stack gap="xs">
        <Icon size={20} color="#000" strokeWidth={1.5} />
        <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
          {label}
        </Text>
        <Text size="sm" fw={500} style={{ wordBreak: 'break-word' }}>
          {value}
        </Text>
      </Stack>
    </Paper>
  );

  return (
    <>
      <Box style={{ minHeight: '100vh', background: '#fafafa', paddingTop: 60, paddingBottom: 60 }}>
        <Container size="md">
          <Stack gap={32}>
            {/* Header Card */}
            <Paper
              p="xl"
              radius="lg"
              style={{
                background: 'white',
                border: '1px solid #f0f0f0',
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">
                <Group gap="xl" align="center">
                  <Avatar
                    size={100}
                    radius="md"
                    style={{
                      background: '#000',
                      fontSize: '28px',
                      fontWeight: 500,
                    }}
                  >
                    {getInitials(userInformation.fullName, userInformation.email)}
                  </Avatar>

                  <Stack gap={4}>
                    <Text size="28px" fw={600} style={{ lineHeight: 1.2 }}>
                      {userInformation.fullName}
                    </Text>
                    <Text size="sm" c="dimmed" fw={400}>
                      {userInformation.email}
                    </Text>
                  </Stack>
                </Group>

                <Button
                  variant="filled"
                  color="dark"
                  size="sm"
                  leftSection={<Edit size={16} />}
                  style={{ marginTop: 8 }}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              </Group>
            </Paper>

            {/* Info Grid */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={userInformation.email || "Not provided"}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={userInformation.phoneNumber || "Not provided"}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                <InfoCard
                  icon={MapPin}
                  label="Gender"
                  value={userInformation.gender || "Not specified"}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                <InfoCard
                  icon={Calendar}
                  label="Date of Birth"
                  value={userInformation.dateOfBirth ? formatDate(userInformation.dateOfBirth) : "Not provided"}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 6, sm: 4 }}>
                <InfoCard
                  icon={Calendar}
                  label="Member Since"
                  value={formatDate(userInformation.createdAt)}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Edit Modal */}
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
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            styles={{
              label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
            }}
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={editForm.phoneNumber}
            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
            styles={{
              label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
            }}
          />

          <TextInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={editForm.dateOfBirth}
            onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
            type="date"
            styles={{
              label: { fontSize: '13px', fontWeight: 500, marginBottom: 8 },
            }}
          />

          <Select
            label="Gender"
            placeholder="Select gender"
            value={editForm.gender}
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
    </>
  );
};

export default Profile;