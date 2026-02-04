import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Anchor,
  Stack,
  Alert,
  Checkbox,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconAlertCircle } from '@tabler/icons-react';
import { authService } from '../../sevices/authServices';
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
      await authService.login({
        email: values.email,
        password: values.password,
      });

      // Login successful - cookies are set automatically by backend
      navigate('/');
    } catch (err: any) {
      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid request.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('Login failed. Please try again later.');
      }
      
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900}>
        Welcome back
      </Title>

      <Paper withBorder shadow="md" p={40} mt={30} radius="md">
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                {...form.getInputProps('password')}
              />

              <Group justify="space-between">
                <Checkbox 
                  label="Remember me"
                  {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                />
                <Anchor size="sm" component="button" type="button">
                  Forgot password?
                </Anchor>
              </Group>

              <Button type="submit" loading={loading} fullWidth>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}