import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  UnstyledButton,
  Box,
  Button,
  Progress,
} from "@mantine/core";
import {
  Plus,
  FolderKanban,
  TrendingUp,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";

import { mockTeams, mockUsers, mockProjects } from "../../data/mockData";
import CreateTeamModal from "./CreateTeamModal";

const Teams = () => {
  const navigate = useNavigate();
  const [createOpened, setCreateOpened] = useState(false);

  return (
    <>
      {/* Create Team Modal */}
      <CreateTeamModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={() => {
          // TODO: replace with refetch when API GET /teams is added
          console.log("Team created");
        }}
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
          <Grid>
            {mockTeams.map((team) => {
              const teamProjects = mockProjects.filter(
                (p) => p.teamId === team.id
              );

              const totalTasks = teamProjects.reduce(
                (sum, p) => sum + p.taskCount,
                0
              );
              const completedTasks = teamProjects.reduce(
                (sum, p) => sum + p.completedCount,
                0
              );

              const completionRate =
                totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0;

              return (
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
                    onClick={() => navigate(`/teams/${team.slug}`)}
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
                            }}
                          >
                            {team.avatar}
                          </Box>
                          <Box>
                            <Text fw={600}>{team.name}</Text>
                            <Text size="xs" c="dimmed">
                              {team.memberCount} members
                            </Text>
                          </Box>
                        </Group>

                        <UnstyledButton
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teams/${team.slug}/settings`);
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
                              <FolderKanban size={16} />
                              <Box>
                                <Text size="xs" c="dimmed">
                                  Projects
                                </Text>
                                <Text fw={600}>{team.projectCount}</Text>
                              </Box>
                            </Group>
                          </Card>
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Card withBorder padding="sm">
                            <Group gap="xs">
                              <TrendingUp size={16} />
                              <Box>
                                <Text size="xs" c="dimmed">
                                  Tasks
                                </Text>
                                <Text fw={600}>{totalTasks}</Text>
                              </Box>
                            </Group>
                          </Card>
                        </Grid.Col>
                      </Grid>

                      {/* Progress */}
                      <Box>
                        <Group justify="space-between" mb={6}>
                          <Text size="xs" c="dimmed">
                            Team progress
                          </Text>
                          <Text size="xs" fw={500}>
                            {completionRate}%
                          </Text>
                        </Group>
                        <Progress value={completionRate} radius="xl" />
                      </Box>

                      {/* Members preview */}
                      <Group gap="xs">
                        <Avatar.Group spacing="xs">
                          {mockUsers.slice(0, 3).map((user) => (
                            <Avatar
                              key={user.id}
                              size={28}
                              src={user.avatar}
                            >
                              {user.name[0]}
                            </Avatar>
                          ))}
                        </Avatar.Group>

                        {team.memberCount > 3 && (
                          <Text size="xs" c="dimmed">
                            +{team.memberCount - 3} more
                          </Text>
                        )}
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Members Section */}
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Text fw={600}>All Team Members</Text>
              <Button variant="light" leftSection={<Plus size={16} />}>
                Invite Member
              </Button>
            </Group>

            <Stack gap="sm">
              {mockUsers.map((user) => (
                <Group
                  key={user.id}
                  justify="space-between"
                  p="md"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                  }}
                >
                  <Group>
                    <Avatar src={user.avatar}>{user.name[0]}</Avatar>
                    <Box>
                      <Text size="sm" fw={500}>
                        {user.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.email}
                      </Text>
                    </Box>
                  </Group>

                  <Badge variant="light">{user.role}</Badge>
                </Group>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default Teams;


// import {
//   Container,
//   Grid,
//   Card,
//   Text,
//   Group,
//   Stack,
//   Badge,
//   Avatar,
//   UnstyledButton,
//   Box,
//   Button,
//   Progress,
// } from "@mantine/core";
// import {
//   Users,
//   Plus,
//   FolderKanban,
//   TrendingUp,
//   Settings,
// } from "lucide-react";
// import { useNavigate } from "react-router";
// import { mockTeams, mockUsers, mockProjects } from "../../data/mockData";
// import { useState } from "react";

// const Teams = () => {
//   const navigate = useNavigate();
//   const [createOpened, setCreateOpened] = useState(false);

//   return (
//     <Container size="xl" py="xl" style={{ maxWidth: 1200 }}>
//       <Stack gap="xl">
//         {/* Header */}
//         <Group justify="space-between">
//           <Box>
//             <Text size="xl" fw={700} mb={4}>
//               Teams
//             </Text>
//             <Text size="sm" c="dimmed">
//               Collaborate and manage your team workspaces
//             </Text>
//           </Box>
//           <Button
//             leftSection={<Plus size={16} />}
//             onClick={() => setCreateOpened(true)}
//             style={{
//               background: "#667eea",
//               color: "#ffffff",
//             }}
//           >
//             Create Team
//           </Button>
//         </Group>

//         {/* Teams Grid */}
//         <Grid>
//           {mockTeams.map((team) => {
//             const teamProjects = mockProjects.filter((p) => p.teamId === team.id);
//             const totalTasks = teamProjects.reduce(
//               (sum, p) => sum + p.taskCount,
//               0
//             );
//             const completedTasks = teamProjects.reduce(
//               (sum, p) => sum + p.completedCount,
//               0
//             );
//             const completionRate =
//               totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

//             return (
//               <Grid.Col key={team.id} span={{ base: 12, sm: 6, md: 4 }}>
//                 <Card
//                   shadow="sm"
//                   padding="lg"
//                   radius="md"
//                   withBorder
//                   style={{
//                     height: "100%",
//                     cursor: "pointer",
//                     transition: "all 0.15s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = "#667eea";
//                     e.currentTarget.style.transform = "translateY(-4px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = "#e5e7eb";
//                     e.currentTarget.style.transform = "";
//                     e.currentTarget.style.boxShadow = "";
//                   }}
//                   onClick={() => navigate(`/teams/${team.slug}`)}
//                 >
//                   <Stack gap="md">
//                     {/* Team Avatar & Name */}
//                     <Group justify="space-between">
//                       <Group gap="sm">
//                         <Box
//                           style={{
//                             width: 48,
//                             height: 48,
//                             borderRadius: 12,
//                             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 24,
//                           }}
//                         >
//                           {team.avatar}
//                         </Box>
//                         <Box>
//                           <Text size="md" fw={600}>
//                             {team.name}
//                           </Text>
//                           <Text size="xs" c="dimmed">
//                             {team.memberCount} members
//                           </Text>
//                         </Box>
//                       </Group>
//                       <UnstyledButton
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigate(`/teams/${team.slug}/settings`);
//                         }}
//                         style={{
//                           padding: 6,
//                           borderRadius: 6,
//                           color: "#6b7280",
//                         }}
//                       >
//                         <Settings size={18} />
//                       </UnstyledButton>
//                     </Group>

//                     {/* Description */}
//                     {team.description && (
//                       <Text size="sm" c="dimmed" lineClamp={2}>
//                         {team.description}
//                       </Text>
//                     )}

//                     {/* Stats */}
//                     <Grid gutter="xs">
//                       <Grid.Col span={6}>
//                         <Card padding="sm" radius="md" withBorder>
//                           <Group gap="xs">
//                             <FolderKanban size={16} color="#667eea" />
//                             <Box>
//                               <Text size="xs" c="dimmed">
//                                 Projects
//                               </Text>
//                               <Text size="sm" fw={600}>
//                                 {team.projectCount}
//                               </Text>
//                             </Box>
//                           </Group>
//                         </Card>
//                       </Grid.Col>
//                       <Grid.Col span={6}>
//                         <Card padding="sm" radius="md" withBorder>
//                           <Group gap="xs">
//                             <TrendingUp size={16} color="#10b981" />
//                             <Box>
//                               <Text size="xs" c="dimmed">
//                                 Tasks
//                               </Text>
//                               <Text size="sm" fw={600}>
//                                 {totalTasks}
//                               </Text>
//                             </Box>
//                           </Group>
//                         </Card>
//                       </Grid.Col>
//                     </Grid>

//                     {/* Progress */}
//                     <Box>
//                       <Group justify="space-between" mb={6}>
//                         <Text size="xs" c="dimmed">
//                           Team Progress
//                         </Text>
//                         <Text size="xs" fw={500}>
//                           {completionRate}%
//                         </Text>
//                       </Group>
//                       <Progress
//                         value={completionRate}
//                         color="violet"
//                         size="sm"
//                         radius="xl"
//                       />
//                     </Box>

//                     {/* Team Members Preview */}
//                     <Group gap="xs">
//                       <Avatar.Group spacing="xs">
//                         {mockUsers.slice(0, 3).map((user) => (
//                           <Avatar
//                             key={user.id}
//                             size={28}
//                             radius="xl"
//                             src={user.avatar}
//                           >
//                             {user.name.charAt(0)}
//                           </Avatar>
//                         ))}
//                       </Avatar.Group>
//                       {team.memberCount > 3 && (
//                         <Text size="xs" c="dimmed">
//                           +{team.memberCount - 3} more
//                         </Text>
//                       )}
//                     </Group>
//                   </Stack>
//                 </Card>
//               </Grid.Col>
//             );
//           })}
//         </Grid>

//         {/* Team Members Section */}
//         <Card shadow="sm" padding="lg" radius="md" withBorder>
//           <Group justify="space-between" mb="lg">
//             <Text size="lg" fw={600}>
//               All Team Members
//             </Text>
//             <Button
//               variant="light"
//               leftSection={<Plus size={16} />}
//               onClick={() => navigate("/teams/invite")}
//             >
//               Invite Member
//             </Button>
//           </Group>

//           <Stack gap="md">
//             {mockUsers.map((user) => (
//               <Group
//                 key={user.id}
//                 justify="space-between"
//                 p="md"
//                 style={{
//                   borderRadius: 8,
//                   border: "1px solid #e5e7eb",
//                   background: "#ffffff",
//                 }}
//               >
//                 <Group gap="md">
//                   <Avatar size={40} radius="xl" src={user.avatar}>
//                     {user.name.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Text size="sm" fw={500}>
//                       {user.name}
//                     </Text>
//                     <Text size="xs" c="dimmed">
//                       {user.email}
//                     </Text>
//                   </Box>
//                 </Group>

//                 <Group gap="sm">
//                   <Badge
//                     size="sm"
//                     color={
//                       user.role === "owner"
//                         ? "violet"
//                         : user.role === "admin"
//                           ? "blue"
//                           : user.role === "member"
//                             ? "green"
//                             : "gray"
//                     }
//                     variant="light"
//                   >
//                     {user.role}
//                   </Badge>
//                   <Text size="xs" c="dimmed">
//                     Joined{" "}
//                     {new Date(user.createdAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </Group>
//               </Group>
//             ))}
//           </Stack>
//         </Card>
//       </Stack>
//     </Container>
//   );
// };

// export default Teams;