import { Box, Button, Card, Group, Paper, Stack, Text, Title, Badge, Image } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import type { OutfitDetails } from "../../interfaces/interfaces";

interface RecentOutfitsProps {
  savedOutfits: OutfitDetails[];
  onWearAgain?: (outfit: OutfitDetails) => void;
  maxDisplay?: number;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Tops': '👕',
  'Bottoms': '👖',
  'Shoes': '👟',
  'Accessories': '🧢',
  'Dresses': '👗',
  'Outerwear': '🧥',
  'Hats': '🎩',
};

const RecentOutfits = ({ savedOutfits, maxDisplay = 4 }: RecentOutfitsProps) => {
  console.log('savedOutfits', savedOutfits);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getOutfitName = (outfit: OutfitDetails): string => {
    // Generate a name based on occasion or items
    if (outfit.occasion) {
      return `${outfit.occasion} Outfit`;
    }
    return `${outfit.top.name} & ${outfit.bottom.name}`;
  };

  const getOutfitItems = (outfit: OutfitDetails) => {
    const items = [];
    
    if (outfit.hats) items.push(outfit.hats);
    if (outfit.top) items.push(outfit.top);
    if (outfit.outerwear) items.push(outfit.outerwear);
    if (outfit.bottom) items.push(outfit.bottom);
    if (outfit.shoes) items.push(outfit.shoes);
    if (outfit.accessory) items.push(outfit.accessory);
    
    return items;
  };

  const getEmojiForCategory = (category: string): string => {
    return CATEGORY_EMOJIS[category] || '👔';
  };

  const displayOutfits = savedOutfits.slice(0, maxDisplay);

  if (savedOutfits.length === 0) {
    return (
      <Card shadow="md" padding="lg" radius="md">
        <Stack align="center" gap="md" py="xl">
          <Text c="dimmed" size="sm">No saved outfits yet</Text>
          <Button component="a" href="/outfit-suggestions" variant="light" size="sm">
            Create Your First Outfit
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="md" padding="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Title order={4}>Saved Outfits</Title>
        <Button 
          component="a" 
          href="/myoutfits" 
          variant="subtle" 
          size="xs"
        >
          View All ({savedOutfits.length})
        </Button>
      </Group>
      <Stack gap="md">
        {displayOutfits.map(outfit => {
          const items = getOutfitItems(outfit);
          
          return (
            <Paper 
              key={outfit.id} 
              p="md" 
              radius="md" 
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <Group justify="space-between" align="flex-start">
                <Group gap="md" align="flex-start">
                  {/* Outfit Items Display */}
                  <Group gap="xs">
                    {items.slice(0, 4).map((item) => (
                      <Box key={item.id}>
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={40}
                            height={40}
                            radius="sm"
                            fit="cover"
                          />
                        ) : (
                          <Box style={{ fontSize: '32px' }}>
                            {getEmojiForCategory(item.category)}
                          </Box>
                        )}
                      </Box>
                    ))}
                    {items.length > 4 && (
                      <Box 
                        style={{ 
                          fontSize: '12px', 
                          color: '#868e96',
                          alignSelf: 'center' 
                        }}
                      >
                        +{items.length - 4}
                      </Box>
                    )}
                  </Group>
                  
                  {/* Outfit Info */}
                  <Box>
                    <Text fw={600} size="sm" mb={4}>
                      {getOutfitName(outfit)}
                    </Text>
                    <Group gap="xs">
                      <IconClock size={14} color="#868e96" />
                      <Text c="dimmed" size="xs">
                        {formatDate(outfit.createdAt)}
                      </Text>
                    </Group>
                    <Group gap="xs" mt={4}>
                      {outfit.occasion && (
                        <Badge size="xs" variant="light" color="grape">
                          {outfit.occasion}
                        </Badge>
                      )}
                      {outfit.weather && (
                        <Badge size="xs" variant="light" color="cyan">
                          {outfit.weather}
                        </Badge>
                      )}
                    </Group>
                  </Box>
                </Group>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
};

export default RecentOutfits;