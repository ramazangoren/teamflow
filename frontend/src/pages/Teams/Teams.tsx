import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Avatar,
  UnstyledButton,
  Box,
  Button,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import {
  Plus,
  FolderKanban,
  TrendingUp,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

import CreateTeamModal from "./CreateTeamModal";
import { teamService, type Team } from "../../sevices/teamServices";

const Teams = () => {
  const navigate = useNavigate();
  const [createOpened, setCreateOpened] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams from API
  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getTeams();
      setTeams(data);
    } catch (err: any) {
      console.error("Failed to fetch teams:", err);

      if (err.response?.status === 401) {
        setError("Please log in to view your teams");
      } else if (err.code === "ERR_NETWORK") {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError("Failed to load teams. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamCreated = () => {
    fetchTeams();
    setCreateOpened(false);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<AlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
        <Center mt="md">
          <Button onClick={fetchTeams}>Retry</Button>
        </Center>
      </Container>
    );
  }

  return (
    <>
      <CreateTeamModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={handleTeamCreated}
      />

      <Container size="xl" py="xl" style={{ maxWidth: 1200 }}>
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Box>
              <Text size="xl" fw={700} mb={4}>
                Teams
              </Text>
              <Text size="sm" c="dimmed">
                Collaborate and manage your team workspaces
              </Text>
            </Box>

            <Button
              leftSection={<Plus size={16} />}
              onClick={() => setCreateOpened(true)}
              style={{ background: "#667eea" }}
            >
              Create Team
            </Button>
          </Group>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <Card withBorder padding="xl">
              <Center>
                <Stack align="center" gap="md">
                  <Text size="lg" fw={500} c="dimmed">
                    No teams yet
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Create your first team to start collaborating
                  </Text>
                  <Button
                    leftSection={<Plus size={16} />}
                    onClick={() => setCreateOpened(true)}
                    style={{ background: "#667eea" }}
                  >
                    Create Team
                  </Button>
                </Stack>
              </Center>
            </Card>
          ) : (
            <Grid>
              {teams.map((team) => (
                <Grid.Col key={team.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    withBorder
                    radius="md"
                    padding="lg"
                    style={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <Stack gap="md">
                      {/* Header */}
                      <Group justify="space-between">
                        <Group gap="sm">
                          {team.avatarUrl ? (
                            <Avatar
                              src={team.avatarUrl}
                              size={48}
                              radius={12}
                            >
                              {team.name[0].toUpperCase()}
                            </Avatar>
                          ) : (
                            <Box
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 20,
                              }}
                            >
                              {team.name[0].toUpperCase()}
                            </Box>
                          )}
                          <Box>
                            <Text fw={600} lineClamp={1}>
                              {team.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {new Date(team.createdAt).toLocaleDateString()}
                            </Text>
                          </Box>
                        </Group>

                        <UnstyledButton
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teams/${team.id}/settings`);
                          }}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f3f4f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <Settings size={18} />
                        </UnstyledButton>
                      </Group>

                      {/* Description */}
                      {team.description && (
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {team.description}
                        </Text>
                      )}

                      {/* Stats */}
                      <Grid gutter="xs">
                        <Grid.Col span={6}>
                          <Card withBorder padding="sm">
                            <Group gap="xs">
                              <FolderKanban size={16} color="#667eea" />
                              <Box>
                                <Text size="xs" c="dimmed">
                                  Projects
                                </Text>
                                <Text fw={600}>0</Text>
                              </Box>
                            </Group>
                          </Card>
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Card withBorder padding="sm">
                            <Group gap="xs">
                              <TrendingUp size={16} color="#10b981" />
                              <Box>
                                <Text size="xs" c="dimmed">
                                  Tasks
                                </Text>
                                <Text fw={600}>0</Text>
                              </Box>
                            </Group>
                          </Card>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Teams;