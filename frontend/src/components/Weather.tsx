import { Box, Button, Card, Group, Text, ThemeIcon, Title, Alert, SimpleGrid, NavLink } from "@mantine/core";
import { IconArrowRight, IconSun, IconCloud, IconCloudRain, IconSnowboarding, IconMapPin } from "@tabler/icons-react";
import { useEffect } from "react";
import { useWeatherStore } from "../stores/weatherStore";

export const getWeatherIcon = (status: string, size: number = 32) => {
    switch (status) {
        case 'Clear':
            return <IconSun size={size} />;
        case 'Rain':
            return <IconCloudRain size={size} />;
        case 'Snow':
            return <IconSnowboarding size={size} />;
        case 'Clouds':
            return <IconCloud size={size} />;
        default:
            return <IconSun size={size} />;
    }
};

export const Weather = () => {
    const {
        todayWeather,
        restOftheWeekWeather,
        city,
        loading,
        error,
        showWeekly,
        setShowWeekly,
        requestLocationAndLoadWeather
    } = useWeatherStore();

    console.log('todayWeather', todayWeather);
    

    useEffect(() => {
        requestLocationAndLoadWeather();
    }, [requestLocationAndLoadWeather]);


    const getOutfitSuggestion = (degree: number, status: string) => {
        if (status === 'Rain') {
            return 'Don\'t forget your umbrella and waterproof jacket!';
        } else if (status === 'Snow') {
            return 'Bundle up! Winter coat, gloves, and warm boots recommended.';
        } else if (degree < 5) {
            return 'Very cold! Heavy coat and warm layers needed.';
        } else if (degree < 15) {
            return 'Cool weather. Light jacket and comfortable layers.';
        } else if (degree < 25) {
            return 'Pleasant weather! Light layers and comfortable shoes.';
        } else {
            return 'Warm day! Light clothing and sun protection.';
        }
    };

    if (loading) {
        return (
            <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
                <Text c="#3f3f3fff" size="lg" fw={500}>
                    📍 Requesting location access...
                </Text>
                <Text c="rgba(255,255,255,0.8)" size="sm" mt="xs">
                    Please allow location access to get weather for your area
                </Text>
            </Card>
        );
    }

    if (error) {
        return (
            <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
                <Alert color="red" title="Error" variant="light" mb="md">
                    {error}
                </Alert>
                <Button
                    variant="#3f3f3fff"
                    color="pink"
                    onClick={requestLocationAndLoadWeather}
                >
                    Try Again
                </Button>
            </Card>
        );
    }

    if (!todayWeather) {
        return (
            <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
                <Text c="#3f3f3fff">Weather data unavailable</Text>
            </Card>
        );
    }

    const degree = parseFloat(todayWeather.degree);

    return (
        <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
            {city && (
                <Group gap="xs" mb="md">
                    <IconMapPin size={16} color="#3f3f3fff" />
                    <Text c="#3f3f3fff" size="xs">
                        {city}
                    </Text>
                </Group>
            )}

            <Group mb="md" gap="xs">
                <Button
                    variant={!showWeekly ? "#3f3f3fff" : "light"}
                    color="pink"
                    size="xs"
                    onClick={() => setShowWeekly(false)}
                >
                    Today
                </Button>
                <Button
                    variant={showWeekly ? "#3f3f3fff" : "light"}
                    color="pink"
                    size="xs"
                    onClick={() => setShowWeekly(true)}
                >
                    This Week
                </Button>
            </Group>

            {!showWeekly ? (
                <Group align="flex-start">
                    <ThemeIcon size={60} radius="xl" variant="#3f3f3fff" color="pink">
                        {getWeatherIcon(todayWeather.status)}
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                        <Text c="#3f3f3fff" fw={600} size="sm" mb="xs">TODAY'S WEATHER - {todayWeather.day}</Text>
                        <Title order={2} c="#3f3f3fff" mb="xs">
                            {Math.round(degree)}°C - {todayWeather.description}
                        </Title>
                        <Text c="#3f3f3fff" size="xs" mb="xs">
                            Max: {Math.round(parseFloat(todayWeather.max))}°C | Min: {Math.round(parseFloat(todayWeather.min))}°C | Humidity: {todayWeather.humidity}%
                        </Text>
                        <Text c="#3f3f3fff" size="sm" mb="md">
                            {getOutfitSuggestion(degree, todayWeather.status)}
                        </Text>
                        <NavLink
                            href="/outfits"
                            label="Get Today's Outfit"
                            leftSection={<IconArrowRight size={16} stroke={1.5} />}
                            color="pink"
                            variant="#3f3f3fff"
                        />
                    </Box>
                </Group>
            ) : (
                <Box>
                    <Text c="#3f3f3fff" fw={600} size="sm" mb="md">5-DAY FORECAST</Text>
                    <SimpleGrid cols={1} spacing="sm">
                        {restOftheWeekWeather.map((weather, index) => (
                            <Card key={index} padding="md" radius="md" style={{ background: 'rgba(255,255,255,0.15)' }}>
                                <Group justify="space-between" align="center">
                                    <Group gap="md">
                                        <ThemeIcon size={40} radius="md" variant="#3f3f3fff" color="pink">
                                            {getWeatherIcon(weather.status, 24)}
                                        </ThemeIcon>
                                        <Box>
                                            <Text c="#3f3f3fff" fw={600} size="sm">{weather.day}</Text>
                                            <Title order={2} c="#3f3f3fff" mb="xs">
                                                {weather.description}
                                            </Title>
                                            <Text c="rgba(255,255,255,0.8)" size="xs">{weather.date}</Text>
                                        </Box>
                                    </Group>
                                    <Box style={{ textAlign: 'right' }}>
                                        <Text c="#3f3f3fff" fw={600} size="lg">
                                            {Math.round(parseFloat(weather.degree))}°C
                                        </Text>
                                        <Text c="rgba(255,255,255,0.8)" size="xs">
                                            {Math.round(parseFloat(weather.max))}° / {Math.round(parseFloat(weather.min))}°
                                        </Text>
                                    </Box>
                                </Group>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Card>
    );
}