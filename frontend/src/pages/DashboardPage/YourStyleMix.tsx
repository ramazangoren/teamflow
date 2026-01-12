import { Box, Card, Group, RingProgress, Stack, Text, Title } from '@mantine/core'
import { useMemo } from 'react'

const YourStyleMix = ({ savedOutfits }: any) => {
    const styleMixData = useMemo(() => {
        if (!savedOutfits || savedOutfits.length === 0) return []

        // Count occurrences of each occasion
        const occasionCounts = savedOutfits.reduce((acc: any, outfit: any) => {
            const occasion = outfit.occasion || 'Other'
            acc[occasion] = (acc[occasion] || 0) + 1
            return acc
        }, {})

        // Define colors for different occasions
        const occasionColors: Record<string, string> = {
            'Casual': 'blue',
            'Work': 'grape',
            'Gym': 'orange',
            'Formal': 'violet',
            'Party': 'pink',
            'Date': 'red',
            'Other': 'gray',
        }

        // Calculate percentages
        const total = savedOutfits.length
        return Object.entries(occasionCounts).map(([occasion, count]: [string, any]) => ({
            occasion,
            value: Math.round((count / total) * 100),
            color: occasionColors[occasion] || 'gray',
        }))
    }, [savedOutfits])

    if (!savedOutfits || savedOutfits.length === 0) {
        return (
            <Card shadow="md" padding="lg" radius="md">
                <Title order={4} mb="lg">Your Style Mix</Title>
                <Text size="sm" c="dimmed" ta="center">
                    Save some outfits to see your style mix!
                </Text>
            </Card>
        )
    }

    return (
        <Card shadow="md" padding="lg" radius="md">
            <Title order={4} mb="lg">Your Style Mix</Title>
            <Stack gap="md" align="center">
                <RingProgress
                    size={180}
                    thickness={16}
                    sections={styleMixData.map(insight => ({
                        value: insight.value,
                        color: insight.color,
                    }))}
                    label={
                        <Text size="xl" fw={700} ta="center">
                            Style
                            <br />
                            Profile
                        </Text>
                    }
                />
                <Stack gap="xs" style={{ width: '100%' }}>
                    {styleMixData.map((insight, index) => (
                        <Group key={index} justify="space-between">
                            <Group gap="xs">
                                <Box
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: `var(--mantine-color-${insight.color}-6)`,
                                    }}
                                />
                                <Text size="sm">{insight.occasion}</Text>
                            </Group>
                            <Text size="sm" fw={600}>{insight.value}%</Text>
                        </Group>
                    ))}
                </Stack>
            </Stack>
        </Card>
    )
}

export default YourStyleMix