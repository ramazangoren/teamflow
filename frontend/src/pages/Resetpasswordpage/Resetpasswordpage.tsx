import { useState } from 'react';
import {
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Alert,
  Progress,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router';

function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { re: /.{8,}/, label: 'At least 8 characters' },
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];

  const strength = requirements.filter((req) => req.re.test(password)).length;
  const color = strength === 0 ? 'red' : strength < 3 ? 'orange' : strength < 5 ? 'yellow' : 'teal';

  return (
    <Box>
      <Progress value={(strength / requirements.length) * 100} color={color} size="sm" mb="xs" />
      <Stack gap={5}>
        {requirements.map((req, index) => (
          <Text
            key={index}
            c={req.re.test(password) ? 'teal' : 'dimmed'}
            size="xs"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {req.re.test(password) ? <IconCheck size={14} /> : <IconX size={14} />}
            {req.label}
          </Text>
        ))}
      </Stack>
    </Box>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[0-9]/.test(value)) return 'Password must include a number';
        if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
        if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
        return null;
      },
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/login', { state: { message: 'Password reset successfully!' } });
    } catch (err: any) {
      setError('Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container size={460} my={80}>
        <Paper withBorder shadow="md" p={40} radius="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
            Invalid or missing reset token. Please request a new password reset link.
          </Alert>
          <Button fullWidth mt="md" onClick={() => navigate('/forgot-password')}>
            Request New Link
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={460} my={80}>
      <Title ta="center" fw={900} style={{ fontSize: '2rem' }}>
        Reset your password
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your new password below
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
              <PasswordInput
                required
                label="New Password"
                placeholder="Your new password"
                radius="md"
                {...form.getInputProps('password')}
              />

              {form.values.password && (
                <PasswordStrength password={form.values.password} />
              )}

              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your new password"
                radius="md"
                {...form.getInputProps('confirmPassword')}
              />

              <Button type="submit" fullWidth radius="md" size="md" loading={loading} mt="md">
                Reset Password
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}