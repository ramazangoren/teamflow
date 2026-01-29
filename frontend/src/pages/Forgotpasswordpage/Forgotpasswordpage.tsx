import { useState } from 'react';
import {
  TextInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Anchor,
  Stack,
  Alert,
  Center,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconAlertCircle, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container size={460} my={80}>
        <Paper withBorder shadow="md" p={40} radius="md">
          <Center>
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--mantine-color-green-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck size={30} color="var(--mantine-color-green-6)" />
            </Box>
          </Center>

          <Title ta="center" fw={700} mt="xl">
            Check your email
          </Title>
          
          <Text c="dimmed" size="sm" ta="center" mt="sm">
            We've sent a password reset link to <strong>{form.values.email}</strong>
          </Text>

          <Text size="xs" c="dimmed" ta="center" mt="xl">
            Didn't receive the email? Check your spam folder or{' '}
            <Anchor size="xs" onClick={() => setSuccess(false)}>
              try another email address
            </Anchor>
          </Text>

          <Button
            fullWidth
            mt="xl"
            variant="light"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate('/login')}
          >
            Back to login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900} style={{ fontSize: '2rem' }}>
        Forgot your password?
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your email address and we'll send you a link to reset your password
      </Text>

      <Paper withBorder shadow="md" p={40} mt={30} radius="md">
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Email"
                placeholder="you@example.com"
                leftSection={<IconMail size={18} />}
                radius="md"
                {...form.getInputProps('email')}
              />

              <Button type="submit" fullWidth radius="md" size="md" loading={loading}>
                Send Reset Link
              </Button>

              <Button
                variant="subtle"
                fullWidth
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate('/login')}
              >
                Back to login
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}