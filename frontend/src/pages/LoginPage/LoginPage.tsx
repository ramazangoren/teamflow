import { Alert, Anchor, Box, Button, Center, Container, Group, Paper, PasswordInput, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconAlertCircle, IconAt, IconUserPlus } from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { useState } from "react";
import authService from "../../sevices/authServices";
import theme from "../../theme/theme";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');


    const form = useForm({
        initialValues: {
            FullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length > 0 ? null : 'Password is required'),
        },
    });


    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        setApiError('');

        try {
            await authService.login({
                email: values.email,
                password: values.password,
            });

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error: any) {
            setApiError(error.message);
            console.log(error.message);

        } finally {
            setIsLoading(false);
        }
    };

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
                        Login
                    </Title>

                    <Text c={theme.colors.text.dimmed} size="sm" ta="center" mb="xl">
                        Sign in to your account
                    </Text>

                    <Stack>

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
                            login
                        </Button>
                    </Stack>

                    <Group mt="xl">
                        <Text size="sm" c={theme.colors.text.dimmed}>
                            dont have an account?{' '}
                            <Anchor size="sm" component="a" href="/register">
                                Sign up
                            </Anchor>
                        </Text>
                    </Group>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;