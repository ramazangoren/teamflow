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
  Checkbox,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { authService, type LoginData } from '../../sevices/authServices';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 0 ? null : 'Password is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const loginData: LoginData = {
        email: values.email,
        password: values.password,
      };

      await authService.login(loginData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900} style={{ fontSize: '2rem' }}>
        Welcome back
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{' '}
        <Anchor size="sm" onClick={() => navigate('/register')}>
          Create account
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

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                />
                <Anchor size="sm" onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </Anchor>
              </Group>

              <Button type="submit" fullWidth radius="md" size="md" loading={loading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}