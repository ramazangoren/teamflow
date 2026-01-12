import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Anchor,
  Stack,
  Alert,
  Center,
  Box,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUserPlus, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import authService from '../../sevices/authServices';
import theme from '../../theme/theme';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const form = useForm({
    initialValues: {
      FullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      FullName: (value) => {
        if (!value) return 'Display name is required';
        if (value.length < 2) return 'Display name must be at least 2 characters';
        return null;
      },
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.password) return 'Passwords do not match';
        return null;
      },
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setApiError('');

    try {
      await authService.register({
        email: values.email,
        password: values.password,
        FullName: values.FullName,
      });

      setRegistrationSuccess(true);

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error: any) {
      setApiError(error.message);
      console.log(error.message);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Box
        style={{
          ...theme.layout.fullScreen,
          background: theme.colors.primary.gradient,
        }}
      >
        <Container size={theme.layout.container.small} style={{ width: '100%' }}>
          <Paper
            radius={theme.components.paper.radius}
            p={theme.components.paper.padding}
            withBorder={theme.components.paper.withBorder}
            style={{
              boxShadow: theme.components.paper.shadow,
            }}
          >
            <Center mb="md">
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color={theme.colors.success}
              >
                <IconCheck size={32} />
              </ThemeIcon>
            </Center>
            <Title order={2} ta="center" mb="xs">
              Registration Successful!
            </Title>
            <Text c={theme.colors.text.dimmed} size="sm" ta="center">
              Redirecting you to dashboard...
            </Text>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        ...theme.layout.fullScreen,
        background: theme.colors.primary.gradient,
      }}
    >
      <Container size={theme.layout.container.medium} style={{ width: '100%' }}>
        <Paper
          radius={theme.components.paper.radius}
          p={theme.components.paper.padding}
          withBorder={theme.components.paper.withBorder}
          style={{
            boxShadow: theme.components.paper.shadow,
          }}
        >
          <Center mb="lg">
            <ThemeIcon
              size={theme.components.themeIcon.size}
              radius={theme.components.themeIcon.radius}
              variant={theme.components.themeIcon.variant}
              gradient={theme.components.themeIcon.gradient}
            >
              <IconUserPlus size={32} />
            </ThemeIcon>
          </Center>

          <Title order={1} ta="center" mb="xs">
            Create Account
          </Title>

          <Text c={theme.colors.text.dimmed} size="sm" ta="center" mb="xl">
            Join us today and get started
          </Text>

          <Stack>
            <TextInput
              label="Display Name"
              placeholder="John Doe"
              size={theme.components.input.size}
              {...form.getInputProps('FullName')}
            />

            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              size={theme.components.input.size}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              size={theme.components.input.size}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              size={theme.components.input.size}
              {...form.getInputProps('confirmPassword')}
            />

            {apiError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color={theme.colors.error}
                variant="light"
              >
                {apiError}
              </Alert>
            )}

            <Button
              fullWidth={theme.components.button.fullWidth}
              size={theme.components.button.size}
              mt="md"
              loading={isLoading}
              onClick={() => {
                const validation = form.validate();
                if (!validation.hasErrors) {
                  handleSubmit(form.values);
                }
              }}
            style={{
                color: theme.components.button.color
            }}
              variant={theme.components.button.variant}
            >
              Create Account
            </Button>
          </Stack>

          <Group mt="xl">
            <Text size="sm" c={theme.colors.text.dimmed}>
              Already have an account?{' '}
              <Anchor size="sm" component="a" href="/login">
                Sign in
              </Anchor>
            </Text>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;