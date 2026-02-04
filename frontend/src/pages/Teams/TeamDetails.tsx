import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Text,
  Group,
  Stack,
  Avatar,
  Button,
  Badge,
  Grid,
  Loader,
  Center,
  Alert,
  ActionIcon,
  Menu,
  Modal,
  Tabs,
  Progress,
  TextInput,
  Select,
} from "@mantine/core";
import {
  ArrowLeft,
  Settings,
  UserPlus,
  MoreVertical,
  Trash2,
  Shield,
  User,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { teamService, type TeamDetails as TeamDetailsType } from "../../sevices/teamServices";

const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [addMemberModalOpened, setAddMemberModalOpened] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<string>("Member");

  const fetchTeam = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getTeam(teamId);
      setTeam(data);
    } catch (err: any) {
      console.error("Failed to fetch team:", err);
      if (err.response?.status === 404) {
        setError("Team not found");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this team");
      } else {
        setError("Failed to load team details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const handleDeleteTeam = async () => {
    if (!teamId) return;

    try {
      await teamService.deleteTeam(teamId);
      navigate("/teams");
    } catch (err: any) {
      console.error("Failed to delete team:", err);
      alert("Failed to delete team");
    }
  };

  const handleAddMember = async () => {
    if (!teamId || !newMemberEmail) return;

    try {
      // Assuming you have an addMember method in teamService
      // await teamService.addMember(teamId, newMemberEmail, newMemberRole);
      
      // For now, we'll just show a success message
      alert(`Member ${newMemberEmail} would be added as ${newMemberRole}`);
      
      setAddMemberModalOpened(false);
      setNewMemberEmail("");
      setNewMemberRole("Member");
      
      // Refresh team data
      await fetchTeam();
    } catch (err: any) {
      console.error("Failed to add member:", err);
      alert("Failed to add member");
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

  const completionRate =
    team.taskCount > 0 ? Math.round((team.taskCount / 100) * 75) : 0;

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
            action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteTeam}>
              Delete Team
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        opened={addMemberModalOpened}
        onClose={() => setAddMemberModalOpened(false)}
        title="Add Team Member"
        centered
      >
        <Stack>
          <TextInput
            label="Email Address"
            placeholder="member@example.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            required
          />
          
          <Select
            label="Role"
            placeholder="Select role"
            value={newMemberRole}
            onChange={(value) => setNewMemberRole(value || "Member")}
            data={[
              { value: "Member", label: "Member" },
              { value: "Admin", label: "Admin" },
            ]}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button 
              variant="default" 
              onClick={() => {
                setAddMemberModalOpened(false);
                setNewMemberEmail("");
                setNewMemberRole("Member");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMember}
              disabled={!newMemberEmail}
            >
              Add Member
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Group>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => navigate("/teams")}
              >
                <ArrowLeft size={20} />
              </ActionIcon>

              {team.avatarUrl ? (
                <Avatar src={team.avatarUrl} size={64} radius="md" />
              ) : (
                <Avatar size={64} radius="md" color="grape">
                  {team.name[0].toUpperCase()}
                </Avatar>
              )}

              <div>
                <Text size="xl" fw={700}>
                  {team.name}
                </Text>
                {team.description && (
                  <Text size="sm" c="dimmed">
                    {team.description}
                  </Text>
                )}
                <Text size="xs" c="dimmed" mt={4}>
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </Group>

            <Group>
              <Button
                leftSection={<UserPlus size={16} />}
                onClick={() => setAddMemberModalOpened(true)}
              >
                Add Member
              </Button>
              <Button
                variant="light"
                leftSection={<Settings size={16} />}
                onClick={() => navigate(`/teams/${teamId}/settings`)}
              >
                Settings
              </Button>
            </Group>
          </Group>

          {/* Stats Cards */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="lg">
                <Group gap="xs">
                  <User size={20} color="#667eea" />
                  <div>
                    <Text size="xs" c="dimmed">
                      Members
                    </Text>
                    <Text size="xl" fw={700}>
                      {team.members.length}
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="lg">
                <Group gap="xs">
                  <FolderKanban size={20} color="#10b981" />
                  <div>
                    <Text size="xs" c="dimmed">
                      Projects
                    </Text>
                    <Text size="xl" fw={700}>
                      {team.projectCount}
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="lg">
                <Group gap="xs">
                  <CheckCircle2 size={20} color="#f59e0b" />
                  <div>
                    <Text size="xs" c="dimmed">
                      Tasks
                    </Text>
                    <Text size="xl" fw={700}>
                      {team.taskCount}
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="lg">
                <Group gap="xs">
                  <Clock size={20} color="#ef4444" />
                  <div>
                    <Text size="xs" c="dimmed">
                      Completion
                    </Text>
                    <Text size="xl" fw={700}>
                      {completionRate}%
                    </Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabs */}
          <Tabs defaultValue="members">
            <Tabs.List>
              <Tabs.Tab value="members">Members ({team.members.length})</Tabs.Tab>
              <Tabs.Tab value="projects">Projects ({team.projectCount})</Tabs.Tab>
              <Tabs.Tab value="activity">Activity</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="members" pt="xl">
              <Card withBorder>
                <Stack gap="md">
                  {team.members.map((member) => (
                    <Group
                      key={member.id}
                      justify="space-between"
                      p="md"
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                      }}
                    >
                      <Group>
                        <Avatar src={member.avatar} size={40}>
                          {member.fullName[0]}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>
                            {member.fullName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {member.email}
                          </Text>
                        </div>
                      </Group>

                      <Group>
                        <Badge
                          variant="light"
                          color={
                            member.role === "Owner"
                              ? "grape"
                              : member.role === "Admin"
                              ? "blue"
                              : "gray"
                          }
                          leftSection={
                            member.role === "Owner" ? (
                              <Shield size={12} />
                            ) : member.role === "Admin" ? (
                              <Shield size={12} />
                            ) : (
                              <User size={12} />
                            )
                          }
                        >
                          {member.role}
                        </Badge>

                        {member.role !== "Owner" && (
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <MoreVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item>Change Role</Menu.Item>
                              <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={14} />}
                              >
                                Remove
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="projects" pt="xl">
              <Card withBorder>
                <Center py="xl">
                  <Stack align="center">
                    <FolderKanban size={48} color="#ccc" />
                    <Text c="dimmed">No projects yet</Text>
                    <Button>Create Project</Button>
                  </Stack>
                </Center>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="activity" pt="xl">
              <Card withBorder>
                <Center py="xl">
                  <Text c="dimmed">No recent activity</Text>
                </Center>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </>
  );
};

export default TeamDetails;

// import { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Text,
//   Group,
//   Stack,
//   Avatar,
//   Button,
//   Badge,
//   Grid,
//   Loader,
//   Center,
//   Alert,
//   ActionIcon,
//   Menu,
//   Modal,
//   Tabs,
//   Progress,
// } from "@mantine/core";
// import {
//   ArrowLeft,
//   Settings,
//   UserPlus,
//   MoreVertical,
//   Trash2,
//   Shield,
//   User,
//   FolderKanban,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router";
// import { teamService, type TeamDetails as TeamDetailsType } from "../../sevices/teamServices";

// const TeamDetails = () => {
//   const { teamId } = useParams<{ teamId: string }>();
//   const navigate = useNavigate();
//   const [team, setTeam] = useState<TeamDetailsType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteModalOpened, setDeleteModalOpened] = useState(false);
//   const [addMemberModalOpened, setAddMemberModalOpened] = useState(false);

//   const fetchTeam = async () => {
//     if (!teamId) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const data = await teamService.getTeam(teamId);
//       setTeam(data);
//     } catch (err: any) {
//       console.error("Failed to fetch team:", err);
//       if (err.response?.status === 404) {
//         setError("Team not found");
//       } else if (err.response?.status === 403) {
//         setError("You don't have permission to view this team");
//       } else {
//         setError("Failed to load team details");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeam();
//   }, [teamId]);

//   const handleDeleteTeam = async () => {
//     if (!teamId) return;

//     try {
//       await teamService.deleteTeam(teamId);
//       navigate("/teams");
//     } catch (err: any) {
//       console.error("Failed to delete team:", err);
//       alert("Failed to delete team");
//     }
//   };

//   if (loading) {
//     return (
//       <Center h="100vh">
//         <Loader size="lg" />
//       </Center>
//     );
//   }

//   if (error || !team) {
//     return (
//       <Container size="xl" py="xl">
//         <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
//           {error || "Team not found"}
//         </Alert>
//         <Center mt="md">
//           <Button onClick={() => navigate("/teams")}>Back to Teams</Button>
//         </Center>
//       </Container>
//     );
//   }

//   const completionRate =
//     team.taskCount > 0 ? Math.round((team.taskCount / 100) * 75) : 0;

//   return (
//     <>
//       {/* Delete Confirmation Modal */}
//       <Modal
//         opened={deleteModalOpened}
//         onClose={() => setDeleteModalOpened(false)}
//         title="Delete Team"
//         centered
//       >
//         <Stack>
//           <Text>
//             Are you sure you want to delete <strong>{team.name}</strong>? This
//             action cannot be undone.
//           </Text>
//           <Group justify="flex-end">
//             <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
//               Cancel
//             </Button>
//             <Button color="red" onClick={handleDeleteTeam}>
//               Delete Team
//             </Button>
//           </Group>
//         </Stack>
//       </Modal>

//       <Container size="xl" py="xl">
//         <Stack gap="xl">
//           {/* Header */}
//           <Group justify="space-between">
//             <Group>
//               <ActionIcon
//                 variant="subtle"
//                 size="lg"
//                 onClick={() => navigate("/teams")}
//               >
//                 <ArrowLeft size={20} />
//               </ActionIcon>

//               {team.avatarUrl ? (
//                 <Avatar src={team.avatarUrl} size={64} radius="md" />
//               ) : (
//                 <Avatar size={64} radius="md" color="grape">
//                   {team.name[0].toUpperCase()}
//                 </Avatar>
//               )}

//               <div>
//                 <Text size="xl" fw={700}>
//                   {team.name}
//                 </Text>
//                 {team.description && (
//                   <Text size="sm" c="dimmed">
//                     {team.description}
//                   </Text>
//                 )}
//                 <Text size="xs" c="dimmed" mt={4}>
//                   Created {new Date(team.createdAt).toLocaleDateString()}
//                 </Text>
//               </div>
//             </Group>

//             <Group>
//               <Button
//                 leftSection={<UserPlus size={16} />}
//                 onClick={() => setAddMemberModalOpened(true)}
//               >
//                 Add Member
//               </Button>
//               <Button
//                 variant="light"
//                 leftSection={<Settings size={16} />}
//                 onClick={() => navigate(`/teams/${teamId}/settings`)}
//               >
//                 Settings
//               </Button>
//             </Group>
//           </Group>

//           {/* Stats Cards */}
//           <Grid>
//             <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
//               <Card withBorder padding="lg">
//                 <Group gap="xs">
//                   <User size={20} color="#667eea" />
//                   <div>
//                     <Text size="xs" c="dimmed">
//                       Members
//                     </Text>
//                     <Text size="xl" fw={700}>
//                       {team.members.length}
//                     </Text>
//                   </div>
//                 </Group>
//               </Card>
//             </Grid.Col>

//             <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
//               <Card withBorder padding="lg">
//                 <Group gap="xs">
//                   <FolderKanban size={20} color="#10b981" />
//                   <div>
//                     <Text size="xs" c="dimmed">
//                       Projects
//                     </Text>
//                     <Text size="xl" fw={700}>
//                       {team.projectCount}
//                     </Text>
//                   </div>
//                 </Group>
//               </Card>
//             </Grid.Col>

//             <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
//               <Card withBorder padding="lg">
//                 <Group gap="xs">
//                   <CheckCircle2 size={20} color="#f59e0b" />
//                   <div>
//                     <Text size="xs" c="dimmed">
//                       Tasks
//                     </Text>
//                     <Text size="xl" fw={700}>
//                       {team.taskCount}
//                     </Text>
//                   </div>
//                 </Group>
//               </Card>
//             </Grid.Col>

//             <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
//               <Card withBorder padding="lg">
//                 <Group gap="xs">
//                   <Clock size={20} color="#ef4444" />
//                   <div>
//                     <Text size="xs" c="dimmed">
//                       Completion
//                     </Text>
//                     <Text size="xl" fw={700}>
//                       {completionRate}%
//                     </Text>
//                   </div>
//                 </Group>
//               </Card>
//             </Grid.Col>
//           </Grid>

//           {/* Tabs */}
//           <Tabs defaultValue="members">
//             <Tabs.List>
//               <Tabs.Tab value="members">Members ({team.members.length})</Tabs.Tab>
//               <Tabs.Tab value="projects">Projects ({team.projectCount})</Tabs.Tab>
//               <Tabs.Tab value="activity">Activity</Tabs.Tab>
//             </Tabs.List>

//             <Tabs.Panel value="members" pt="xl">
//               <Card withBorder>
//                 <Stack gap="md">
//                   {team.members.map((member) => (
//                     <Group
//                       key={member.id}
//                       justify="space-between"
//                       p="md"
//                       style={{
//                         border: "1px solid #e5e7eb",
//                         borderRadius: 8,
//                       }}
//                     >
//                       <Group>
//                         <Avatar src={member.avatar} size={40}>
//                           {member.fullName[0]}
//                         </Avatar>
//                         <div>
//                           <Text size="sm" fw={500}>
//                             {member.fullName}
//                           </Text>
//                           <Text size="xs" c="dimmed">
//                             {member.email}
//                           </Text>
//                         </div>
//                       </Group>

//                       <Group>
//                         <Badge
//                           variant="light"
//                           color={
//                             member.role === "Owner"
//                               ? "grape"
//                               : member.role === "Admin"
//                               ? "blue"
//                               : "gray"
//                           }
//                           leftSection={
//                             member.role === "Owner" ? (
//                               <Shield size={12} />
//                             ) : member.role === "Admin" ? (
//                               <Shield size={12} />
//                             ) : (
//                               <User size={12} />
//                             )
//                           }
//                         >
//                           {member.role}
//                         </Badge>

//                         {member.role !== "Owner" && (
//                           <Menu position="bottom-end">
//                             <Menu.Target>
//                               <ActionIcon variant="subtle">
//                                 <MoreVertical size={16} />
//                               </ActionIcon>
//                             </Menu.Target>
//                             <Menu.Dropdown>
//                               <Menu.Item>Change Role</Menu.Item>
//                               <Menu.Item
//                                 color="red"
//                                 leftSection={<Trash2 size={14} />}
//                               >
//                                 Remove
//                               </Menu.Item>
//                             </Menu.Dropdown>
//                           </Menu>
//                         )}
//                       </Group>
//                     </Group>
//                   ))}
//                 </Stack>
//               </Card>
//             </Tabs.Panel>

//             <Tabs.Panel value="projects" pt="xl">
//               <Card withBorder>
//                 <Center py="xl">
//                   <Stack align="center">
//                     <FolderKanban size={48} color="#ccc" />
//                     <Text c="dimmed">No projects yet</Text>
//                     <Button>Create Project</Button>
//                   </Stack>
//                 </Center>
//               </Card>
//             </Tabs.Panel>

//             <Tabs.Panel value="activity" pt="xl">
//               <Card withBorder>
//                 <Center py="xl">
//                   <Text c="dimmed">No recent activity</Text>
//                 </Center>
//               </Card>
//             </Tabs.Panel>
//           </Tabs>
//         </Stack>
//       </Container>
//     </>
//   );
// };

// export default TeamDetails;