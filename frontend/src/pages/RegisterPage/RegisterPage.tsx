import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { authService } from '../../sevices/authServices';
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
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      fullName: (v) => (v.length >= 2 ? null : 'Name too short'),
      password: (v) => (v.length >= 6 ? null : 'Min 6 chars'),
      confirmPassword: (v, values) =>
        v === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      navigate('/');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900}>
        Create account
      </Title>

      <Paper withBorder shadow="md" p={40} mt={30}>
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Full Name"
                leftSection={<IconUser size={18} />}
                {...form.getInputProps('fullName')}
              />

              <TextInput
                label="Email"
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm Password"
                {...form.getInputProps('confirmPassword')}
              />

              <Button type="submit" loading={loading}>
                Create Account
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
