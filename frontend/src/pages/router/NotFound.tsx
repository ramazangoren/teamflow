import { Button, Container, Group, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      size="md"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Title
        order={1}
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          background: "linear-gradient(90deg, #4dabf7, #15aabf)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}
      >
        404
      </Title>

      <Title order={3} mb="md">
        Oops! Page not found
      </Title>

      <Text c="dimmed" size="lg" mb="xl" maw={500}>
        The page you’re looking for doesn’t exist or has been moved.
      </Text>

      <Group justify="center">
        {/* <Button
          component={Link}
          onClick={() => {
            navigate(-1);
          }}
          leftSection={<IconArrowLeft size={16} />}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          size="md"
          radius="xl"
        >
          Back
        </Button> */}
      </Group>
    </Container>
  );
};

export default NotFound;
