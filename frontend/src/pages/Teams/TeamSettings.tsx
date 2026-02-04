import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Text,
  Group,
  Stack,
  Button,
  TextInput,
  Textarea,
  Loader,
  Center,
  Alert,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  teamService,
  type TeamDetails,
 type UpdateTeamData,
} from "../../sevices/teamServices";

const TeamSettings = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<UpdateTeamData>({
    initialValues: {
      name: "",
      description: "",
      avatarUrl: "",
    },
  });

  const fetchTeam = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getTeam(teamId);
      setTeam(data);
      form.setValues({
        name: data.name,
        description: data.description || "",
        avatarUrl: data.avatarUrl || "",
      });
    } catch (err: any) {
      console.error("Failed to fetch team:", err);
      setError("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const handleSave = async (values: UpdateTeamData) => {
    if (!teamId) return;

    try {
      setSaving(true);
      await teamService.updateTeam(teamId, values);
      await fetchTeam();
      alert("Team updated successfully!");
    } catch (err: any) {
      console.error("Failed to update team:", err);
      if (err.response?.status === 403) {
        alert("You don't have permission to update this team");
      } else {
        alert("Failed to update team");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!teamId) return;

    try {
      setDeleting(true);
      await teamService.deleteTeam(teamId);
      navigate("/teams");
    } catch (err: any) {
      console.error("Failed to delete team:", err);
      if (err.response?.status === 403) {
        alert("Only team owners can delete teams");
      } else {
        alert("Failed to delete team");
      }
    } finally {
      setDeleting(false);
      setDeleteModalOpened(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !team) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          {error || "Team not found"}
        </Alert>
        <Center mt="md">
          <Button onClick={() => navigate("/teams")}>Back to Teams</Button>
        </Center>
      </Container>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Team"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to delete <strong>{team.name}</strong>? This
            action cannot be undone and will delete all projects and tasks
            associated with this team.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setDeleteModalOpened(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={deleting}>
              Delete Team
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Group>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => navigate(`/teams/${teamId}`)}
            >
              <ArrowLeft size={20} />
            </ActionIcon>
            <div>
              <Text size="xl" fw={700}>
                Team Settings
              </Text>
              <Text size="sm" c="dimmed">
                Manage your team information
              </Text>
            </div>
          </Group>

          {/* General Settings */}
          <Card withBorder padding="lg">
            <form onSubmit={form.onSubmit(handleSave)}>
              <Stack gap="md">
                <Text fw={600} size="lg">
                  General
                </Text>

                <TextInput
                  label="Team Name"
                  placeholder="Enter team name"
                  required
                  {...form.getInputProps("name")}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your team..."
                  rows={4}
                  {...form.getInputProps("description")}
                />

                <TextInput
                  label="Avatar URL"
                  placeholder="https://example.com/avatar.png"
                  {...form.getInputProps("avatarUrl")}
                />

                <Group justify="flex-end">
                  <Button
                    type="submit"
                    leftSection={<Save size={16} />}
                    loading={saving}
                    style={{ background: "#667eea" }}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card withBorder padding="lg" style={{ borderColor: "#fee2e2" }}>
            <Stack gap="md">
              <Text fw={600} size="lg" c="red">
                Danger Zone
              </Text>

              <Group justify="space-between">
                <div>
                  <Text fw={500}>Delete Team</Text>
                  <Text size="sm" c="dimmed">
                    Permanently delete this team and all its data
                  </Text>
                </div>
                <Button
                  color="red"
                  leftSection={<Trash2 size={16} />}
                  onClick={() => setDeleteModalOpened(true)}
                >
                  Delete Team
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default TeamSettings;