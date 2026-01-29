import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Anchor,
  Stack,
  Alert,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconUser, IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { authService, type RegisterData } from '../../sevices/authServices';
import { useNavigate } from 'react-router';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      fullName: (value) => (value.length >= 2 ? null : 'Name must be at least 2 characters'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      };

      await authService.register(registerData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900} style={{ fontSize: '2rem' }}>
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" onClick={() => navigate('/login')}>
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={40} mt={30} radius="md">
        <Stack gap="md">
          <Group grow>
            <Button
              variant="default"
              leftSection={<IconBrandGoogle size={18} />}
              radius="md"
            >
              Google
            </Button>
            <Button
              variant="default"
              leftSection={<IconBrandGithub size={18} />}
              radius="md"
            >
              GitHub
            </Button>
          </Group>

          <Divider label="Or continue with email" labelPosition="center" />

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Full Name"
                placeholder="John Doe"
                leftSection={<IconUser size={18} />}
                radius="md"
                {...form.getInputProps('fullName')}
              />

              <TextInput
                required
                label="Email"
                placeholder="you@example.com"
                leftSection={<IconMail size={18} />}
                radius="md"
                {...form.getInputProps('email')}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                radius="md"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                radius="md"
                {...form.getInputProps('confirmPassword')}
              />

              <Button type="submit" fullWidth radius="md" size="md" loading={loading} mt="md">
                Create Account
              </Button>
            </Stack>
          </form>

          <Text size="xs" c="dimmed" ta="center">
            By signing up, you agree to our{' '}
            <Anchor size="xs" onClick={() => navigate('/terms')}>
              Terms of Service
            </Anchor>{' '}
            and{' '}
            <Anchor size="xs" onClick={() => navigate('/privacy')}>
              Privacy Policy
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}