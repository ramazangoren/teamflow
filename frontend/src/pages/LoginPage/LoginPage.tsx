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

      navigate('/');
    } catch (err: any) {
      setError('Login failed. Please check your credentials.');
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
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                required
                label="Password"
                {...form.getInputProps('password')}
              />

              <Group justify="space-between">
                <Checkbox label="Remember me" />
                <Anchor size="sm">Forgot password?</Anchor>
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
