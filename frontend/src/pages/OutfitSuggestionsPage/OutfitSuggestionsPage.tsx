import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Select,
  Box,
  ActionIcon,
  Paper,
  Loader,
  Center,
  Notification,
  Flex,
} from '@mantine/core';
import {
  IconRefresh,
  IconHeart,
  IconHeartFilled,
  IconCheck,
  IconBookmark,
} from '@tabler/icons-react';
import { useUserStore } from '../../stores/UserStore';
import { useClothingStore } from '../../stores/clothingStore';
import { useOutfitStore } from '../../stores/outfitStore';
import { occasions, weatherConditions } from '../../constants';
import type { ClothingItem, Outfit, OutfitItem } from '../../interfaces/interfaces';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Tops': '👕',
  'Bottoms': '👖',
  'Shoes': '👟',
  'Accessories': '🧢',
  'Dresses': '👗',
  'Outerwear': '🧥',
  'Hats': '🎩',
};

const DEFAULT_EMOJI = '👔';

// Color coordination rules
const NEUTRAL_COLORS = ['black', 'white', 'gray', 'grey', 'beige', 'navy', 'brown', 'cream'];
const COLOR_COMBINATIONS = [
  ['blue', 'white'], ['blue', 'brown'], ['blue', 'gray'],
  ['red', 'black'], ['red', 'white'], ['red', 'navy'],
  ['green', 'brown'], ['green', 'beige'], ['green', 'white'],
  ['yellow', 'gray'], ['yellow', 'navy'], ['yellow', 'white'],
  ['pink', 'gray'], ['pink', 'white'], ['pink', 'navy'],
  ['purple', 'gray'], ['purple', 'white'],
  ['orange', 'blue'], ['orange', 'brown'],
];

// Style compatibility rules
const COMPATIBLE_STYLES = [
  ['casual', 'sporty'],
  ['casual', 'streetwear'],
  ['formal', 'business'],
  ['formal', 'elegant'],
  ['bohemian', 'casual'],
  ['vintage', 'retro'],
  ['minimalist', 'modern'],
];

// Weather-season mapping
const WEATHER_SEASON_MAP: Record<string, string[]> = {
  'cold': ['winter', 'fall', 'autumn'],
  'rainy': ['spring', 'fall', 'autumn'],
  'sunny': ['summer', 'spring'],
};

class OutfitGenerator {
  private items: ClothingItem[];
  private occasion: string;
  private maxOutfits: number;

  constructor(items: ClothingItem[], occasion: string, maxOutfits = 100) {
    this.items = items;
    this.occasion = occasion;
    this.maxOutfits = maxOutfits;
  }

  // Categorize items by type
  private categorizeItems() {
    return {
      tops: this.shuffle(this.items.filter(item => item.category === 'Tops')),
      bottoms: this.shuffle(this.items.filter(item => item.category === 'Bottoms')),
      shoes: this.shuffle(this.items.filter(item => item.category === 'Shoes')),
      accessories: this.items.filter(item => item.category === 'Accessories'),
      outerwear: this.items.filter(item => item.category === 'Outerwear'),
      hats: this.items.filter(item => item.category === 'Hats'),
    };
  }

  // Shuffle array for variety
  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // Check if two colors coordinate
  private colorsCoordinate(color1: string, color2: string): boolean {
    const c1 = color1?.toLowerCase() || '';
    const c2 = color2?.toLowerCase() || '';
    
    if (!c1 || !c2) return true;
    
    // Neutrals go with everything
    if (NEUTRAL_COLORS.some(n => c1.includes(n) || c2.includes(n))) {
      return true;
    }
    
    // Same color family
    if (c1 === c2) return true;
    
    // Check predefined combinations
    return COLOR_COMBINATIONS.some(([col1, col2]) => 
      (c1.includes(col1) && c2.includes(col2)) ||
      (c1.includes(col2) && c2.includes(col1))
    );
  }

  // Check if styles match
  private stylesMatch(item1: ClothingItem, item2: ClothingItem): boolean {
    if (!item1.style || !item2.style) return true;
    
    const s1 = item1.style.toLowerCase();
    const s2 = item2.style.toLowerCase();
    
    if (s1 === s2) return true;
    
    return COMPATIBLE_STYLES.some(([style1, style2]) => 
      (s1.includes(style1) && s2.includes(style2)) ||
      (s1.includes(style2) && s2.includes(style1))
    );
  }

  // Check weather appropriateness
  private isWeatherAppropriate(item: ClothingItem, weather: string): boolean {
    if (!item.season) return true;
    
    const season = item.season.toLowerCase();
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower === 'any') return true;
    
    return WEATHER_SEASON_MAP[weatherLower]?.some(s => season.includes(s)) ?? true;
  }

  // Determine weather based on clothing items
  private determineWeather(top: ClothingItem, bottom: ClothingItem): string {
    const topSeason = top.season?.toLowerCase() || '';
    const bottomSeason = bottom.season?.toLowerCase() || '';
    
    if (topSeason.includes('winter') || bottomSeason.includes('winter')) return 'Cold';
    if (topSeason.includes('summer') || bottomSeason.includes('summer')) return 'Sunny';
    if (topSeason.includes('spring') || bottomSeason.includes('spring')) return 'Rainy';
    return 'Any';
  }

  // Create outfit item from clothing item
  private createOutfitItem(item: ClothingItem): OutfitItem {
    return {
      id: item.id,
      name: item.name,
      emoji: CATEGORY_EMOJIS[item.category] || DEFAULT_EMOJI,
      imageUrl: item.imageUrl,
    };
  }

  // Select matching accessory
  private selectAccessory(accessories: ClothingItem[], top: ClothingItem): ClothingItem | undefined {
    if (accessories.length === 0) return undefined;
    
    const matching = accessories.filter(acc => 
      this.stylesMatch(top, acc) && 
      this.colorsCoordinate(top.color || '', acc.color || '')
    );
    
    return matching.length > 0 
      ? matching[Math.floor(Math.random() * matching.length)]
      : undefined;
  }

  // Select matching outerwear
  private selectOuterwear(outerwear: ClothingItem[], top: ClothingItem, weather: string): ClothingItem | undefined {
    if (outerwear.length === 0 || !['Cold', 'Rainy'].includes(weather)) {
      return undefined;
    }
    
    const matching = outerwear.filter(out => 
      this.stylesMatch(top, out) && 
      this.isWeatherAppropriate(out, weather) &&
      this.colorsCoordinate(top.color || '', out.color || '')
    );
    
    return matching.length > 0 
      ? matching[Math.floor(Math.random() * matching.length)]
      : undefined;
  }

  // Select matching hat (20% chance)
  private selectHat(hats: ClothingItem[], top: ClothingItem): ClothingItem | undefined {
    if (hats.length === 0 || Math.random() >= 0.2) return undefined;
    
    const matching = hats.filter(hat => 
      this.stylesMatch(top, hat) && 
      this.colorsCoordinate(top.color || '', hat.color || '')
    );
    
    return matching.length > 0 
      ? matching[Math.floor(Math.random() * matching.length)]
      : undefined;
  }

  // Check if outfit is valid (strict mode)
  private isValidOutfit(top: ClothingItem, bottom: ClothingItem, shoes: ClothingItem, weather: string): boolean {
    // Colors must coordinate
    if (!this.colorsCoordinate(top.color || '', bottom.color || '')) return false;
    if (!this.colorsCoordinate(bottom.color || '', shoes.color || '')) return false;
    
    // Styles must match
    if (!this.stylesMatch(top, bottom)) return false;
    if (!this.stylesMatch(bottom, shoes)) return false;
    
    // Weather must be appropriate
    if (!this.isWeatherAppropriate(top, weather)) return false;
    if (!this.isWeatherAppropriate(bottom, weather)) return false;
    
    return true;
  }

  // Build complete outfit with accessories
  private buildOutfit(
    id: number,
    top: ClothingItem, 
    bottom: ClothingItem, 
    shoes: ClothingItem,
    weather: string,
    categorizedItems: ReturnType<typeof this.categorizeItems>
  ): Outfit {
    const accessory = this.selectAccessory(categorizedItems.accessories, top);
    const outerwear = this.selectOuterwear(categorizedItems.outerwear, top, weather);
    const hat = this.selectHat(categorizedItems.hats, top);

    return {
      id,
      top: this.createOutfitItem(top),
      bottom: this.createOutfitItem(bottom),
      shoes: this.createOutfitItem(shoes),
      ...(accessory && { accessory: this.createOutfitItem(accessory) }),
      ...(outerwear && { outerwear: this.createOutfitItem(outerwear) }),
      ...(hat && { hats: this.createOutfitItem(hat) }),
      occasion: this.occasion,
      weather,
      liked: false,
    };
  }

  // Generate outfits with strict matching rules
  private generateStrictOutfits(categorizedItems: ReturnType<typeof this.categorizeItems>): Outfit[] {
    const { tops, bottoms, shoes } = categorizedItems;
    const outfits: Outfit[] = [];
    let outfitId = 1;

    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          const weather = this.determineWeather(top, bottom);
          
          if (this.isValidOutfit(top, bottom, shoe, weather)) {
            outfits.push(this.buildOutfit(outfitId++, top, bottom, shoe, weather, categorizedItems));
            
            if (outfits.length >= this.maxOutfits) return outfits;
          }
        }
      }
    }

    return outfits;
  }

  // Generate outfits with relaxed rules (fallback)
  private generateRelaxedOutfits(categorizedItems: ReturnType<typeof this.categorizeItems>): Outfit[] {
    const { tops, bottoms, shoes } = categorizedItems;
    const outfits: Outfit[] = [];
    let outfitId = 1;

    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          const weather = this.determineWeather(top, bottom);
          
          outfits.push(this.buildOutfit(outfitId++, top, bottom, shoe, weather, categorizedItems));
          
          if (outfits.length >= this.maxOutfits) return outfits;
        }
      }
    }

    return outfits;
  }

  // Main generation method
  generate(): Outfit[] {
    const categorizedItems = this.categorizeItems();
    const { tops, bottoms, shoes } = categorizedItems;

    // Check if we have minimum required items
    if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
      return [];
    }

    // Try strict matching first
    let outfits = this.generateStrictOutfits(categorizedItems);

    // If too few outfits, use relaxed rules
    if (outfits.length < 5) {
      console.log('Relaxing constraints to generate more outfits...');
      outfits = this.generateRelaxedOutfits(categorizedItems);
    }

    return outfits;
  }
}

const OutfitSuggestionsPage = () => {
  const [selectedOccasion, setSelectedOccasion] = useState('Casual');
  const [selectedWeather, setSelectedWeather] = useState('Sunny');
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const { loadUserInfo } = useUserStore();
  const { updateItemLength, items } = useClothingStore();
  const { 
    savedOutfits, 
    isSaving, 
    loadSavedOutfits, 
    saveOutfit,
    checkIfOutfitSaved 
  } = useOutfitStore();

  const isOutfitAlreadySaved = useCallback((outfit: Outfit): boolean => {
    return checkIfOutfitSaved({
      topId: outfit.top.id,
      bottomId: outfit.bottom.id,
      shoesId: outfit.shoes.id,
      accessoryId: outfit.accessory?.id ?? null,
      outwearId: outfit.outerwear?.id ?? null,
      hatsId: outfit.hats?.id ?? null,
    });
  }, [checkIfOutfitSaved]);

  const generateOutfits = useCallback(() => {
    if (!items || items.length === 0) return;

    setIsGenerating(true);

    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      const generator = new OutfitGenerator(items, selectedOccasion);
      const generatedOutfits = generator.generate();
      
      setOutfits(generatedOutfits);
      setCurrentOutfitIndex(0);
      setIsGenerating(false);
    }, 0);
  }, [items, selectedOccasion]);

  const saveOutfitToDatabase = useCallback(async (outfit: Outfit) => {
    try {
      const outfitData = {
        topId: outfit.top.id,
        bottomId: outfit.bottom.id,
        shoesId: outfit.shoes.id,
        accessoryId: outfit.accessory?.id ?? null,
        outwearId: outfit.outerwear?.id ?? null,
        hatsId: outfit.hats?.id ?? null,
        occasion: outfit.occasion,
        weather: outfit.weather,
      };

      console.log('Saving outfit to database:', outfitData);
      
      await saveOutfit(outfitData);
      
      setShowSavedNotification(true);
      setTimeout(() => setShowSavedNotification(false), 3000);
      
      console.log('Outfit saved successfully');
    } catch (error) {
      console.error('Error saving outfit:', error);
      alert('Failed to save outfit. Please try again.');
    }
  }, [saveOutfit]);

  const toggleLike = useCallback(async (id: number) => {
    const outfit = outfits.find(o => o.id === id);
    if (!outfit) return;

    const newLikedState = !outfit.liked;

    setOutfits(prevOutfits =>
      prevOutfits.map(o =>
        o.id === id ? { ...o, liked: newLikedState } : o
      )
    );

    if (newLikedState) {
      if (isOutfitAlreadySaved(outfit)) {
        console.log('Outfit already saved, skipping database save');
      } else {
        await saveOutfitToDatabase({ ...outfit, liked: true });
      }
    }
  }, [outfits, isOutfitAlreadySaved, saveOutfitToDatabase]);

  const generateNewOutfit = useCallback(() => {
    setCurrentOutfitIndex(prev => (prev + 1) % outfits.length);
  }, [outfits.length]);

  useEffect(() => {
    loadUserInfo();
    updateItemLength();
    loadSavedOutfits();
  }, [loadUserInfo, updateItemLength, loadSavedOutfits]);

  useEffect(() => {
    if (items && items.length > 0) {
      generateOutfits();
    }
  }, [items, selectedOccasion]);

  const currentOutfit = useMemo(() => 
    outfits[currentOutfitIndex], 
    [outfits, currentOutfitIndex]
  );

  if (isGenerating) {
    return (
      <Box style={{ minHeight: '100vh', background: 'white' }}>
        <Center style={{ minHeight: '100vh' }}>
          <Stack align="center" gap="md">
            <Loader size="xl" color="3f3f3fff" />
            <Text c="3f3f3fff" size="lg">Generating outfit combinations...</Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  if (outfits.length === 0) {
    return (
      <Box style={{ minHeight: '100vh', background: 'white' }}>
        <Container size="lg" py="xl">
          <Card shadow="lg" padding="xl" radius="lg">
            <Stack align="center" gap="md">
              <Title order={2}>Unable to Generate Outfits</Title>
              <Text c="dimmed">
                Make sure you have at least one top, bottom, and shoes in your closet.
              </Text>
              <Button onClick={generateOutfits} leftSection={<IconRefresh size={20} />}>
                Try Again
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const renderOutfitItem = (item: OutfitItem | undefined, label: string, color: string) => {
    if (!item) return null;

    return (
      <Stack gap="xs" align="center">
        {item.imageUrl ? (
          <Box
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              overflow: 'hidden',
              border: '2px solid #e9ecef',
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Box style={{ fontSize: '80px' }}>{item.emoji}</Box>
        )}
        <Text size="sm" fw={500}>{item.name}</Text>
        <Badge color={color} variant="light">{label}</Badge>
      </Stack>
    );
  };

  return (
    <Box style={{ minHeight: '100vh', background: 'white', position: 'relative' }}>
      {showSavedNotification && (
        <Box style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
          <Notification
            icon={<IconCheck size={18} />}
            color="teal"
            title="Outfit Saved!"
            onClose={() => setShowSavedNotification(false)}
          >
            Your outfit has been saved to your collection.
          </Notification>
        </Box>
      )}

      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Group justify="space-between">
            <div>
              <Title order={1} c="#3f3f3fff" mb="xs">Outfit Suggestions</Title>
              <Text c="#3f3f3fff" size="lg">
                What should I wear today? ({outfits.length} combinations available)
              </Text>
            </div>
            <Button
              component="a"
              href="/myoutfits"
              leftSection={<IconBookmark size={20} />}
              variant="white"
              size="md"
            >
              View Saved Outfits ({savedOutfits.length})
            </Button>
          </Group>

          <Paper shadow="sm" p="md" radius="md">
            <Stack gap="md">
              <Select
                label="Occasion"
                placeholder="Select occasion"
                data={occasions}
                value={selectedOccasion}
                onChange={(value) => setSelectedOccasion(value || 'Casual')}
                size="md"
              />

              <div>
                <Text size="sm" fw={500} mb="xs">Weather</Text>
                <Group gap="xs">
                  {weatherConditions.map((weather) => (
                    <Button
                      key={weather.value}
                      variant={selectedWeather === weather.value ? 'filled' : 'light'}
                      leftSection={<weather.icon size={18} />}
                      size="sm"
                      onClick={() => setSelectedWeather(weather.value)}
                    >
                      {weather.label}
                    </Button>
                  ))}
                </Group>
              </div>
            </Stack>
          </Paper>

          {currentOutfit && (
            <Card shadow="lg" padding="xl" radius="lg" style={{ backgroundColor: 'white' }}>
              <Stack gap="lg">
                <Box style={{ textAlign: 'center' }}>
                  <Text size="sm" c="dimmed" mb="md">
                    Outfit {currentOutfitIndex + 1} of {outfits.length}
                  </Text>

                  <Flex justify="center" gap="xl" mb="lg" wrap="wrap">
                    {renderOutfitItem(currentOutfit.hats, 'Hat', 'indigo')}
                    {renderOutfitItem(currentOutfit.top, 'Top', 'violet')}
                    {renderOutfitItem(currentOutfit.outerwear, 'Outerwear', 'grape')}
                    {renderOutfitItem(currentOutfit.bottom, 'Bottom', 'blue')}
                    {renderOutfitItem(currentOutfit.shoes, 'Shoes', 'green')}
                    {renderOutfitItem(currentOutfit.accessory, 'Accessory', 'orange')}
                  </Flex>

                  <Group justify="center" gap="xs" mb="md">
                    <Badge size="lg" variant="dot" color="grape">
                      {currentOutfit.occasion}
                    </Badge>
                    <Badge size="lg" variant="dot" color="cyan">
                      {currentOutfit.weather}
                    </Badge>
                    {isOutfitAlreadySaved(currentOutfit) && (
                      <Badge size="lg" variant="dot" color="teal">
                        Already Saved
                      </Badge>
                    )}
                  </Group>
                </Box>

                <Group justify="center" gap="md">
                  <ActionIcon
                    size="xl"
                    variant="light"
                    color={currentOutfit.liked ? 'red' : 'gray'}
                    onClick={() => toggleLike(currentOutfit.id)}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    {currentOutfit.liked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
                  </ActionIcon>

                  <Button
                    size="lg"
                    leftSection={<IconRefresh size={20} />}
                    onClick={generateNewOutfit}
                  >
                    Try Another
                  </Button>

                  <Button
                    size="lg"
                    variant="light"
                    onClick={generateOutfits}
                  >
                    Regenerate All
                  </Button>
                </Group>
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default OutfitSuggestionsPage;



// import { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   Container,
//   Title,
//   Text,
//   Button,
//   Group,
//   Stack,
//   Card,
//   Badge,
//   Select,
//   Box,
//   ActionIcon,
//   Paper,
//   Loader,
//   Center,
//   Notification,
//   Flex,
// } from '@mantine/core';
// import {
//   IconRefresh,
//   IconHeart,
//   IconHeartFilled,
//   IconCheck,
//   IconBookmark,
// } from '@tabler/icons-react';
// import { useUserStore } from '../../stores/UserStore';
// import { useClothingStore } from '../../stores/clothingStore';
// import { useOutfitStore } from '../../stores/outfitStore';
// import { occasions, weatherConditions } from '../../constants';
// import type { ClothingItem, Outfit, OutfitItem } from '../../interfaces/interfaces';

// const CATEGORY_EMOJIS: Record<string, string> = {
//   'Tops': '👕',
//   'Bottoms': '👖',
//   'Shoes': '👟',
//   'Accessories': '🧢',
//   'Dresses': '👗',
//   'Outerwear': '🧥',
//   'Hats': '🎩',
// };

// const DEFAULT_EMOJI = '👔';

// const OutfitSuggestionsPage = () => {
//   const [selectedOccasion, setSelectedOccasion] = useState('Casual');
//   const [selectedWeather, setSelectedWeather] = useState('Sunny');
//   const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
//   const [outfits, setOutfits] = useState<Outfit[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showSavedNotification, setShowSavedNotification] = useState(false);

//   const { loadUserInfo } = useUserStore();
//   const { updateItemLength, items } = useClothingStore();
//   const { 
//     savedOutfits, 
//     isSaving, 
//     loadSavedOutfits, 
//     saveOutfit,
//     checkIfOutfitSaved 
//   } = useOutfitStore();

//   const getEmojiForCategory = useCallback((category: string): string => {
//     return CATEGORY_EMOJIS[category] || DEFAULT_EMOJI;
//   }, []);

//   const createOutfitItem = useCallback((item: ClothingItem): OutfitItem => ({
//     id: item.id,
//     name: item.name,
//     emoji: getEmojiForCategory(item.category),
//     imageUrl: item.imageUrl,
//   }), [getEmojiForCategory]);

//   const determineWeather = useCallback((top: ClothingItem, bottom: ClothingItem): string => {
//     if (top.season === 'Winter' || bottom.season === 'Winter') return 'Cold';
//     if (top.season === 'Summer' || bottom.season === 'Summer') return 'Sunny';
//     if (top.season === 'Spring' || bottom.season === 'Spring') return 'Rainy';
//     return 'Any';
//   }, []);

//   // Helper function to check if colors coordinate well
//   const colorsCoordinate = useCallback((color1: string, color2: string): boolean => {
//     const neutrals = ['black', 'white', 'gray', 'grey', 'beige', 'navy', 'brown', 'cream'];
//     const color1Lower = color1.toLowerCase();
//     const color2Lower = color2.toLowerCase();
    
//     // Neutrals go with everything
//     if (neutrals.some(n => color1Lower.includes(n)) || neutrals.some(n => color2Lower.includes(n))) {
//       return true;
//     }
    
//     // Same color family
//     if (color1Lower === color2Lower) return true;
    
//     // Classic combinations
//     const goodCombos = [
//       ['blue', 'white'], ['blue', 'brown'], ['blue', 'gray'],
//       ['red', 'black'], ['red', 'white'], ['red', 'navy'],
//       ['green', 'brown'], ['green', 'beige'], ['green', 'white'],
//       ['yellow', 'gray'], ['yellow', 'navy'], ['yellow', 'white'],
//       ['pink', 'gray'], ['pink', 'white'], ['pink', 'navy'],
//       ['purple', 'gray'], ['purple', 'white'],
//       ['orange', 'blue'], ['orange', 'brown'],
//     ];
    
//     return goodCombos.some(([c1, c2]) => 
//       (color1Lower.includes(c1) && color2Lower.includes(c2)) ||
//       (color1Lower.includes(c2) && color2Lower.includes(c1))
//     );
//   }, []);

//   // Helper function to check if styles match
//   const stylesMatch = useCallback((item1: ClothingItem, item2: ClothingItem): boolean => {
//     if (!item1.style || !item2.style) return true; // If no style info, assume they match
    
//     const style1 = item1.style.toLowerCase();
//     const style2 = item2.style.toLowerCase();
    
//     // Same style always matches
//     if (style1 === style2) return true;
    
//     // Compatible style combinations
//     const compatibleStyles = [
//       ['casual', 'sporty'],
//       ['casual', 'streetwear'],
//       ['formal', 'business'],
//       ['formal', 'elegant'],
//       ['bohemian', 'casual'],
//       ['vintage', 'retro'],
//       ['minimalist', 'modern'],
//     ];
    
//     return compatibleStyles.some(([s1, s2]) => 
//       (style1.includes(s1) && style2.includes(s2)) ||
//       (style1.includes(s2) && style2.includes(s1))
//     );
//   }, []);

//   // Helper function to check weather appropriateness
//   const isWeatherAppropriate = useCallback((item: ClothingItem, weather: string): boolean => {
//     if (!item.season) return true;
    
//     const seasonLower = item.season.toLowerCase();
//     const weatherLower = weather.toLowerCase();
    
//     if (weatherLower === 'any') return true;
    
//     const weatherSeasonMap: Record<string, string[]> = {
//       'cold': ['winter', 'fall', 'autumn'],
//       'rainy': ['spring', 'fall', 'autumn'],
//       'sunny': ['summer', 'spring'],
//     };
    
//     return weatherSeasonMap[weatherLower]?.some(s => seasonLower.includes(s)) ?? true;
//   }, []);

//   const isOutfitAlreadySaved = useCallback((outfit: Outfit): boolean => {
//     return checkIfOutfitSaved({
//       topId: outfit.top.id,
//       bottomId: outfit.bottom.id,
//       shoesId: outfit.shoes.id,
//       accessoryId: outfit.accessory?.id ?? null,
//       outwearId: outfit.outerwear?.id ?? null,
//       hatsId: outfit.hats?.id ?? null,
//     });
//   }, [checkIfOutfitSaved]);

//   const generateOutfits = useCallback(() => {
//     if (!items || items.length === 0) return;

//     setIsGenerating(true);

//     const categorizedItems = {
//       tops: items.filter(item => item.category === 'Tops'),
//       bottoms: items.filter(item => item.category === 'Bottoms'),
//       shoes: items.filter(item => item.category === 'Shoes'),
//       accessories: items.filter(item => item.category === 'Accessories'),
//       outerwear: items.filter(item => item.category === 'Outerwear'),
//       hats: items.filter(item => item.category === 'Hats'),
//     };

//     const { tops, bottoms, shoes, accessories, outerwear, hats } = categorizedItems;

//     if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
//       setIsGenerating(false);
//       setOutfits([]);
//       return;
//     }

//     const generatedOutfits: Outfit[] = [];
//     let outfitId = 1;
//     const maxOutfits = 100; // Limit total combinations to improve performance

//     // Shuffle arrays for variety
//     const shuffledTops = [...tops].sort(() => Math.random() - 0.5);
//     const shuffledBottoms = [...bottoms].sort(() => Math.random() - 0.5);
//     const shuffledShoes = [...shoes].sort(() => Math.random() - 0.5);

//     outerLoop: for (const top of shuffledTops) {
//       for (const bottom of shuffledBottoms) {
//         // Check if top and bottom coordinate
//         if (!colorsCoordinate(top.color || '', bottom.color || '')) continue;
//         if (!stylesMatch(top, bottom)) continue;

//         for (const shoe of shuffledShoes) {
//           // Check if shoes work with the outfit
//           if (!colorsCoordinate(bottom.color || '', shoe.color || '')) continue;
//           if (!stylesMatch(bottom, shoe)) continue;

//           const weather = determineWeather(top, bottom);
          
//           // Check weather appropriateness
//           if (!isWeatherAppropriate(top, weather) || !isWeatherAppropriate(bottom, weather)) continue;

//           // Select accessories based on style and occasion
//           let selectedAccessory = undefined;
//           if (accessories.length > 0) {
//             const matchingAccessories = accessories.filter(acc => 
//               stylesMatch(top, acc) && colorsCoordinate(top.color || '', acc.color || '')
//             );
//             if (matchingAccessories.length > 0) {
//               selectedAccessory = matchingAccessories[Math.floor(Math.random() * matchingAccessories.length)];
//             }
//           }

//           // Select outerwear for cold weather
//           let selectedOuterwear = undefined;
//           if (outerwear.length > 0 && ['Cold', 'Rainy'].includes(weather)) {
//             const matchingOuterwear = outerwear.filter(out => 
//               stylesMatch(top, out) && 
//               isWeatherAppropriate(out, weather) &&
//               colorsCoordinate(top.color || '', out.color || '')
//             );
//             if (matchingOuterwear.length > 0) {
//               selectedOuterwear = matchingOuterwear[Math.floor(Math.random() * matchingOuterwear.length)];
//             }
//           }

//           // Select hat occasionally (20% chance)
//           let selectedHat = undefined;
//           if (hats.length > 0 && Math.random() < 0.2) {
//             const matchingHats = hats.filter(hat => 
//               stylesMatch(top, hat) && colorsCoordinate(top.color || '', hat.color || '')
//             );
//             if (matchingHats.length > 0) {
//               selectedHat = matchingHats[Math.floor(Math.random() * matchingHats.length)];
//             }
//           }

//           const outfit: Outfit = {
//             id: outfitId++,
//             top: createOutfitItem(top),
//             bottom: createOutfitItem(bottom),
//             shoes: createOutfitItem(shoe),
//             ...(selectedAccessory && { accessory: createOutfitItem(selectedAccessory) }),
//             ...(selectedOuterwear && { outerwear: createOutfitItem(selectedOuterwear) }),
//             ...(selectedHat && { hats: createOutfitItem(selectedHat) }),
//             occasion: selectedOccasion,
//             weather: weather,
//             liked: false,
//           };

//           generatedOutfits.push(outfit);

//           if (generatedOutfits.length >= maxOutfits) break outerLoop;
//         }
//       }
//     }

//     // If we have too few outfits, relax constraints
//     if (generatedOutfits.length < 5) {
//       console.log('Relaxing constraints to generate more outfits...');
//       outfitId = 1;
//       generatedOutfits.length = 0;

//       shuffledTops.forEach((top) => {
//         shuffledBottoms.forEach((bottom) => {
//           shuffledShoes.forEach((shoe) => {
//             const weather = determineWeather(top, bottom);
            
//             const outfit: Outfit = {
//               id: outfitId++,
//               top: createOutfitItem(top),
//               bottom: createOutfitItem(bottom),
//               shoes: createOutfitItem(shoe),
//               occasion: selectedOccasion,
//               weather: weather,
//               liked: false,
//             };

//             generatedOutfits.push(outfit);
//             if (generatedOutfits.length >= maxOutfits) return;
//           });
//         });
//       });
//     }

//     setOutfits(generatedOutfits);
//     setCurrentOutfitIndex(0);
//     setIsGenerating(false);
//   }, [items, selectedOccasion, createOutfitItem, determineWeather, colorsCoordinate, stylesMatch, isWeatherAppropriate]);

//   const saveOutfitToDatabase = useCallback(async (outfit: Outfit) => {
//     try {
//       // Prepare outfit data according to backend SaveOutfitDto
//       const outfitData = {
//         topId: outfit.top.id,
//         bottomId: outfit.bottom.id,
//         shoesId: outfit.shoes.id,
//         accessoryId: outfit.accessory?.id ?? null,
//         outwearId: outfit.outerwear?.id ?? null,
//         hatsId: outfit.hats?.id ?? null,
//         occasion: outfit.occasion,
//         weather: outfit.weather,
//       };

//       console.log('Saving outfit to database:', outfitData);
      
//       await saveOutfit(outfitData);
      
//       setShowSavedNotification(true);
//       setTimeout(() => setShowSavedNotification(false), 3000);
      
//       console.log('Outfit saved successfully');
//     } catch (error) {
//       console.error('Error saving outfit:', error);
//       alert('Failed to save outfit. Please try again.');
//     }
//   }, [saveOutfit]);

//   const toggleLike = useCallback(async (id: number) => {
//     const outfit = outfits.find(o => o.id === id);
//     if (!outfit) return;

//     const newLikedState = !outfit.liked;

//     // Update UI immediately for better UX
//     setOutfits(prevOutfits =>
//       prevOutfits.map(o =>
//         o.id === id ? { ...o, liked: newLikedState } : o
//       )
//     );

//     // If liking the outfit and it's not already saved, save it
//     if (newLikedState) {
//       if (isOutfitAlreadySaved(outfit)) {
//         console.log('Outfit already saved, skipping database save');
//       } else {
//         await saveOutfitToDatabase({ ...outfit, liked: true });
//       }
//     }
//   }, [outfits, isOutfitAlreadySaved, saveOutfitToDatabase]);

//   const generateNewOutfit = useCallback(() => {
//     setCurrentOutfitIndex(prev => (prev + 1) % outfits.length);
//   }, [outfits.length]);

//   useEffect(() => {
//     loadUserInfo();
//     updateItemLength();
//     loadSavedOutfits();
//   }, [loadUserInfo, updateItemLength, loadSavedOutfits]);

//   useEffect(() => {
//     if (items && items.length > 0) {
//       generateOutfits();
//     }
//   }, [items, selectedOccasion]);

//   const currentOutfit = useMemo(() => 
//     outfits[currentOutfitIndex], 
//     [outfits, currentOutfitIndex]
//   );

//   if (isGenerating) {
//     return (
//       <Box style={{ minHeight: '100vh', background: 'white' }}>
//         <Center style={{ minHeight: '100vh' }}>
//           <Stack align="center" gap="md">
//             <Loader size="xl" color="3f3f3fff" />
//             <Text c="3f3f3fff" size="lg">Generating outfit combinations...</Text>
//           </Stack>
//         </Center>
//       </Box>
//     );
//   }

//   if (outfits.length === 0) {
//     return (
//       <Box style={{ minHeight: '100vh', background: 'white' }}>
//         <Container size="lg" py="xl">
//           <Card shadow="lg" padding="xl" radius="lg">
//             <Stack align="center" gap="md">
//               <Title order={2}>Unable to Generate Outfits</Title>
//               <Text c="dimmed">
//                 Make sure you have at least one top, bottom, and shoes in your closet.
//               </Text>
//               <Button onClick={generateOutfits} leftSection={<IconRefresh size={20} />}>
//                 Try Again
//               </Button>
//             </Stack>
//           </Card>
//         </Container>
//       </Box>
//     );
//   }

//   const renderOutfitItem = (item: OutfitItem | undefined, label: string, color: string) => {
//     if (!item) return null;

//     return (
//       <Stack gap="xs" align="center">
//         {item.imageUrl ? (
//           <Box
//             style={{
//               width: 120,
//               height: 120,
//               borderRadius: 8,
//               overflow: 'hidden',
//               border: '2px solid #e9ecef',
//             }}
//           >
//             <img
//               src={item.imageUrl}
//               alt={item.name}
//               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//             />
//           </Box>
//         ) : (
//           <Box style={{ fontSize: '80px' }}>{item.emoji}</Box>
//         )}
//         <Text size="sm" fw={500}>{item.name}</Text>
//         <Badge color={color} variant="light">{label}</Badge>
//       </Stack>
//     );
//   };

//   return (
//     <Box style={{ minHeight: '100vh', background: 'white', position: 'relative' }}>
//       {showSavedNotification && (
//         <Box style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
//           <Notification
//             icon={<IconCheck size={18} />}
//             color="teal"
//             title="Outfit Saved!"
//             onClose={() => setShowSavedNotification(false)}
//           >
//             Your outfit has been saved to your collection.
//           </Notification>
//         </Box>
//       )}

//       <Container size="lg" py="xl">
//         <Stack gap="xl">
//           <Group justify="space-between">
//             <div>
//               <Title order={1} c="#3f3f3fff" mb="xs">Outfit Suggestions</Title>
//               <Text c="#3f3f3fff" size="lg">
//                 What should I wear today? ({outfits.length} combinations available)
//               </Text>
//             </div>
//             <Button
//               component="a"
//               href="/myoutfits"
//               leftSection={<IconBookmark size={20} />}
//               variant="white"
//               size="md"
//             >
//               View Saved Outfits ({savedOutfits.length})
//             </Button>
//           </Group>

//           <Paper shadow="sm" p="md" radius="md">
//             <Stack gap="md">
//               <Select
//                 label="Occasion"
//                 placeholder="Select occasion"
//                 data={occasions}
//                 value={selectedOccasion}
//                 onChange={(value) => setSelectedOccasion(value || 'Casual')}
//                 size="md"
//               />

//               <div>
//                 <Text size="sm" fw={500} mb="xs">Weather</Text>
//                 <Group gap="xs">
//                   {weatherConditions.map((weather) => (
//                     <Button
//                       key={weather.value}
//                       variant={selectedWeather === weather.value ? 'filled' : 'light'}
//                       leftSection={<weather.icon size={18} />}
//                       size="sm"
//                       onClick={() => setSelectedWeather(weather.value)}
//                     >
//                       {weather.label}
//                     </Button>
//                   ))}
//                 </Group>
//               </div>
//             </Stack>
//           </Paper>

//           {currentOutfit && (
//             <Card shadow="lg" padding="xl" radius="lg" style={{ backgroundColor: 'white' }}>
//               <Stack gap="lg">
//                 <Box style={{ textAlign: 'center' }}>
//                   <Text size="sm" c="dimmed" mb="md">
//                     Outfit {currentOutfitIndex + 1} of {outfits.length}
//                   </Text>

//                   <Flex justify="center" gap="xl" mb="lg" wrap="wrap">
//                     {renderOutfitItem(currentOutfit.hats, 'Hat', 'indigo')}
//                     {renderOutfitItem(currentOutfit.top, 'Top', 'violet')}
//                     {renderOutfitItem(currentOutfit.outerwear, 'Outerwear', 'grape')}
//                     {renderOutfitItem(currentOutfit.bottom, 'Bottom', 'blue')}
//                     {renderOutfitItem(currentOutfit.shoes, 'Shoes', 'green')}
//                     {renderOutfitItem(currentOutfit.accessory, 'Accessory', 'orange')}
//                   </Flex>

//                   <Group justify="center" gap="xs" mb="md">
//                     <Badge size="lg" variant="dot" color="grape">
//                       {currentOutfit.occasion}
//                     </Badge>
//                     <Badge size="lg" variant="dot" color="cyan">
//                       {currentOutfit.weather}
//                     </Badge>
//                     {isOutfitAlreadySaved(currentOutfit) && (
//                       <Badge size="lg" variant="dot" color="teal">
//                         Already Saved
//                       </Badge>
//                     )}
//                   </Group>
//                 </Box>

//                 <Group justify="center" gap="md">
//                   <ActionIcon
//                     size="xl"
//                     variant="light"
//                     color={currentOutfit.liked ? 'red' : 'gray'}
//                     onClick={() => toggleLike(currentOutfit.id)}
//                     loading={isSaving}
//                     disabled={isSaving}
//                   >
//                     {currentOutfit.liked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
//                   </ActionIcon>

//                   <Button
//                     size="lg"
//                     leftSection={<IconRefresh size={20} />}
//                     onClick={generateNewOutfit}
//                   >
//                     Try Another
//                   </Button>

//                   <Button
//                     size="lg"
//                     variant="light"
//                     onClick={generateOutfits}
//                   >
//                     Regenerate All
//                   </Button>
//                 </Group>
//               </Stack>
//             </Card>
//           )}
//         </Stack>
//       </Container>
//     </Box>
//   );
// };

// export default OutfitSuggestionsPage;


// // import { useEffect, useState, useMemo, useCallback } from 'react';
// // import {
// //   Container,
// //   Title,
// //   Text,
// //   Button,
// //   Group,
// //   Stack,
// //   Card,
// //   Badge,
// //   Select,
// //   Box,
// //   ActionIcon,
// //   Paper,
// //   Loader,
// //   Center,
// //   Notification,
// //   Flex,
// // } from '@mantine/core';
// // import {
// //   IconRefresh,
// //   IconHeart,
// //   IconHeartFilled,
// //   IconCheck,
// //   IconBookmark,
// // } from '@tabler/icons-react';
// // import { useUserStore } from '../../stores/UserStore';
// // import { useClothingStore } from '../../stores/clothingStore';
// // import { occasions, weatherConditions } from '../../constants';
// // import type { ClothingItem, Outfit, OutfitDetails, OutfitItem, SaveOutfitRequest } from '../../interfaces/interfaces';
// // import { getSavedOutfits, saveCompleteOutfit } from '../../sevices/OutfitServices';

// // const CATEGORY_EMOJIS: Record<string, string> = {
// //   'Tops': '👕',
// //   'Bottoms': '👖',
// //   'Shoes': '👟',
// //   'Accessories': '🧢',
// //   'Dresses': '👗',
// //   'Outerwear': '🧥',
// //   'Hats': '🎩',
// // };

// // const DEFAULT_EMOJI = '👔';

// // const OutfitSuggestionsPage = () => {
// //   const [selectedOccasion, setSelectedOccasion] = useState('Casual');
// //   const [selectedWeather, setSelectedWeather] = useState('Sunny');
// //   const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
// //   const [outfits, setOutfits] = useState<Outfit[]>([]);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [showSavedNotification, setShowSavedNotification] = useState(false);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [savedOutfits, setSavedOutfits] = useState<OutfitDetails[]>([]);

// //   const { loadUserInfo } = useUserStore();
// //   const { updateItemLength, items } = useClothingStore();

// //   const getEmojiForCategory = useCallback((category: string): string => {
// //     return CATEGORY_EMOJIS[category] || DEFAULT_EMOJI;
// //   }, []);

// //   const createOutfitItem = useCallback((item: ClothingItem): OutfitItem => ({
// //     id: item.id,
// //     name: item.name,
// //     emoji: getEmojiForCategory(item.category),
// //     imageUrl: item.imageUrl,
// //   }), [getEmojiForCategory]);

// //   const determineWeather = useCallback((top: ClothingItem, bottom: ClothingItem): string => {
// //     if (top.season === 'Winter' || bottom.season === 'Winter') return 'Cold';
// //     if (top.season === 'Summer' || bottom.season === 'Summer') return 'Sunny';
// //     if (top.season === 'Spring' || bottom.season === 'Spring') return 'Rainy';
// //     return 'Any';
// //   }, []);

// //   // Helper function to check if colors coordinate well
// //   const colorsCoordinate = useCallback((color1: string, color2: string): boolean => {
// //     const neutrals = ['black', 'white', 'gray', 'grey', 'beige', 'navy', 'brown', 'cream'];
// //     const color1Lower = color1.toLowerCase();
// //     const color2Lower = color2.toLowerCase();
    
// //     // Neutrals go with everything
// //     if (neutrals.some(n => color1Lower.includes(n)) || neutrals.some(n => color2Lower.includes(n))) {
// //       return true;
// //     }
    
// //     // Same color family
// //     if (color1Lower === color2Lower) return true;
    
// //     // Classic combinations
// //     const goodCombos = [
// //       ['blue', 'white'], ['blue', 'brown'], ['blue', 'gray'],
// //       ['red', 'black'], ['red', 'white'], ['red', 'navy'],
// //       ['green', 'brown'], ['green', 'beige'], ['green', 'white'],
// //       ['yellow', 'gray'], ['yellow', 'navy'], ['yellow', 'white'],
// //       ['pink', 'gray'], ['pink', 'white'], ['pink', 'navy'],
// //       ['purple', 'gray'], ['purple', 'white'],
// //       ['orange', 'blue'], ['orange', 'brown'],
// //     ];
    
// //     return goodCombos.some(([c1, c2]) => 
// //       (color1Lower.includes(c1) && color2Lower.includes(c2)) ||
// //       (color1Lower.includes(c2) && color2Lower.includes(c1))
// //     );
// //   }, []);

// //   // Helper function to check if styles match
// //   const stylesMatch = useCallback((item1: ClothingItem, item2: ClothingItem): boolean => {
// //     if (!item1.style || !item2.style) return true; // If no style info, assume they match
    
// //     const style1 = item1.style.toLowerCase();
// //     const style2 = item2.style.toLowerCase();
    
// //     // Same style always matches
// //     if (style1 === style2) return true;
    
// //     // Compatible style combinations
// //     const compatibleStyles = [
// //       ['casual', 'sporty'],
// //       ['casual', 'streetwear'],
// //       ['formal', 'business'],
// //       ['formal', 'elegant'],
// //       ['bohemian', 'casual'],
// //       ['vintage', 'retro'],
// //       ['minimalist', 'modern'],
// //     ];
    
// //     return compatibleStyles.some(([s1, s2]) => 
// //       (style1.includes(s1) && style2.includes(s2)) ||
// //       (style1.includes(s2) && style2.includes(s1))
// //     );
// //   }, []);

// //   // Helper function to check weather appropriateness
// //   const isWeatherAppropriate = useCallback((item: ClothingItem, weather: string): boolean => {
// //     if (!item.season) return true;
    
// //     const seasonLower = item.season.toLowerCase();
// //     const weatherLower = weather.toLowerCase();
    
// //     if (weatherLower === 'any') return true;
    
// //     const weatherSeasonMap: Record<string, string[]> = {
// //       'cold': ['winter', 'fall', 'autumn'],
// //       'rainy': ['spring', 'fall', 'autumn'],
// //       'sunny': ['summer', 'spring'],
// //     };
    
// //     return weatherSeasonMap[weatherLower]?.some(s => seasonLower.includes(s)) ?? true;
// //   }, []);

// //   const isOutfitAlreadySaved = useCallback((outfit: Outfit): boolean => {
// //     return savedOutfits.some(saved => 
// //       saved.top.id === outfit.top.id &&
// //       saved.bottom.id === outfit.bottom.id &&
// //       saved.shoes.id === outfit.shoes.id &&
// //       (!outfit.accessory || saved.accessory?.id === outfit.accessory.id) &&
// //       (!outfit.outerwear || saved.outerwear?.id === outfit.outerwear.id) &&
// //       (!outfit.hats || saved.hats?.id === outfit.hats.id)
// //     );
// //   }, [savedOutfits]);

// //   const loadSavedOutfits = useCallback(async () => {
// //     try {
// //       const data = await getSavedOutfits();
// //       setSavedOutfits(data);
// //     } catch (error) {
// //       console.error('Error loading saved outfits:', error);
// //     }
// //   }, []);

// //   const generateOutfits = useCallback(() => {
// //     if (!items || items.length === 0) return;

// //     setIsGenerating(true);

// //     const categorizedItems = {
// //       tops: items.filter(item => item.category === 'Tops'),
// //       bottoms: items.filter(item => item.category === 'Bottoms'),
// //       shoes: items.filter(item => item.category === 'Shoes'),
// //       accessories: items.filter(item => item.category === 'Accessories'),
// //       outerwear: items.filter(item => item.category === 'Outerwear'),
// //       hats: items.filter(item => item.category === 'Hats'),
// //     };

// //     const { tops, bottoms, shoes, accessories, outerwear, hats } = categorizedItems;

// //     if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
// //       setIsGenerating(false);
// //       setOutfits([]);
// //       return;
// //     }

// //     const generatedOutfits: Outfit[] = [];
// //     let outfitId = 1;
// //     const maxOutfits = 100; // Limit total combinations to improve performance

// //     // Shuffle arrays for variety
// //     const shuffledTops = [...tops].sort(() => Math.random() - 0.5);
// //     const shuffledBottoms = [...bottoms].sort(() => Math.random() - 0.5);
// //     const shuffledShoes = [...shoes].sort(() => Math.random() - 0.5);

// //     outerLoop: for (const top of shuffledTops) {
// //       for (const bottom of shuffledBottoms) {
// //         // Check if top and bottom coordinate
// //         if (!colorsCoordinate(top.color || '', bottom.color || '')) continue;
// //         if (!stylesMatch(top, bottom)) continue;

// //         for (const shoe of shuffledShoes) {
// //           // Check if shoes work with the outfit
// //           if (!colorsCoordinate(bottom.color || '', shoe.color || '')) continue;
// //           if (!stylesMatch(bottom, shoe)) continue;

// //           const weather = determineWeather(top, bottom);
          
// //           // Check weather appropriateness
// //           if (!isWeatherAppropriate(top, weather) || !isWeatherAppropriate(bottom, weather)) continue;

// //           // Select accessories based on style and occasion
// //           let selectedAccessory = undefined;
// //           if (accessories.length > 0) {
// //             const matchingAccessories = accessories.filter(acc => 
// //               stylesMatch(top, acc) && colorsCoordinate(top.color || '', acc.color || '')
// //             );
// //             if (matchingAccessories.length > 0) {
// //               selectedAccessory = matchingAccessories[Math.floor(Math.random() * matchingAccessories.length)];
// //             }
// //           }

// //           // Select outerwear for cold weather
// //           let selectedOuterwear = undefined;
// //           if (outerwear.length > 0 && ['Cold', 'Rainy'].includes(weather)) {
// //             const matchingOuterwear = outerwear.filter(out => 
// //               stylesMatch(top, out) && 
// //               isWeatherAppropriate(out, weather) &&
// //               colorsCoordinate(top.color || '', out.color || '')
// //             );
// //             if (matchingOuterwear.length > 0) {
// //               selectedOuterwear = matchingOuterwear[Math.floor(Math.random() * matchingOuterwear.length)];
// //             }
// //           }

// //           // Select hat occasionally (20% chance)
// //           let selectedHat = undefined;
// //           if (hats.length > 0 && Math.random() < 0.2) {
// //             const matchingHats = hats.filter(hat => 
// //               stylesMatch(top, hat) && colorsCoordinate(top.color || '', hat.color || '')
// //             );
// //             if (matchingHats.length > 0) {
// //               selectedHat = matchingHats[Math.floor(Math.random() * matchingHats.length)];
// //             }
// //           }

// //           const outfit: Outfit = {
// //             id: outfitId++,
// //             top: createOutfitItem(top),
// //             bottom: createOutfitItem(bottom),
// //             shoes: createOutfitItem(shoe),
// //             ...(selectedAccessory && { accessory: createOutfitItem(selectedAccessory) }),
// //             ...(selectedOuterwear && { outerwear: createOutfitItem(selectedOuterwear) }),
// //             ...(selectedHat && { hats: createOutfitItem(selectedHat) }),
// //             occasion: selectedOccasion,
// //             weather: weather,
// //             liked: false,
// //           };

// //           generatedOutfits.push(outfit);

// //           if (generatedOutfits.length >= maxOutfits) break outerLoop;
// //         }
// //       }
// //     }

// //     // If we have too few outfits, relax constraints
// //     if (generatedOutfits.length < 5) {
// //       console.log('Relaxing constraints to generate more outfits...');
// //       outfitId = 1;
// //       generatedOutfits.length = 0;

// //       shuffledTops.forEach((top) => {
// //         shuffledBottoms.forEach((bottom) => {
// //           shuffledShoes.forEach((shoe) => {
// //             const weather = determineWeather(top, bottom);
            
// //             const outfit: Outfit = {
// //               id: outfitId++,
// //               top: createOutfitItem(top),
// //               bottom: createOutfitItem(bottom),
// //               shoes: createOutfitItem(shoe),
// //               occasion: selectedOccasion,
// //               weather: weather,
// //               liked: false,
// //             };

// //             generatedOutfits.push(outfit);
// //             if (generatedOutfits.length >= maxOutfits) return;
// //           });
// //         });
// //       });
// //     }

// //     setOutfits(generatedOutfits);
// //     setCurrentOutfitIndex(0);
// //     setIsGenerating(false);
// //   }, [items, selectedOccasion, createOutfitItem, determineWeather, colorsCoordinate, stylesMatch, isWeatherAppropriate]);

// //   const saveOutfitToDatabase = useCallback(async (outfit: Outfit) => {
// //     try {
// //       setIsSaving(true);

// //       // Prepare outfit data according to backend SaveOutfitDto
// //       const outfitData: SaveOutfitRequest = {
// //         topId: outfit.top.id,
// //         bottomId: outfit.bottom.id,
// //         shoesId: outfit.shoes.id,
// //         accessoryId: outfit.accessory?.id ?? null,
// //         outwearId: outfit.outerwear?.id ?? null,
// //         hatsId: outfit.hats?.id ?? null,
// //         occasion: outfit.occasion,
// //         weather: outfit.weather,
// //       };

// //       console.log('Saving outfit to database:', outfitData);
      
// //       await saveCompleteOutfit(outfitData);
      
// //       setShowSavedNotification(true);
// //       setTimeout(() => setShowSavedNotification(false), 3000);
      
// //       // Reload saved outfits to update the list
// //       await loadSavedOutfits();
      
// //       console.log('Outfit saved successfully');
// //     } catch (error) {
// //       console.error('Error saving outfit:', error);
// //       alert('Failed to save outfit. Please try again.');
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   }, [loadSavedOutfits]);

// //   const toggleLike = useCallback(async (id: number) => {
// //     const outfit = outfits.find(o => o.id === id);
// //     if (!outfit) return;

// //     const newLikedState = !outfit.liked;

// //     // Update UI immediately for better UX
// //     setOutfits(prevOutfits =>
// //       prevOutfits.map(o =>
// //         o.id === id ? { ...o, liked: newLikedState } : o
// //       )
// //     );

// //     // If liking the outfit and it's not already saved, save it
// //     if (newLikedState) {
// //       if (isOutfitAlreadySaved(outfit)) {
// //         console.log('Outfit already saved, skipping database save');
// //       } else {
// //         await saveOutfitToDatabase({ ...outfit, liked: true });
// //       }
// //     }
// //   }, [outfits, isOutfitAlreadySaved, saveOutfitToDatabase]);

// //   const generateNewOutfit = useCallback(() => {
// //     setCurrentOutfitIndex(prev => (prev + 1) % outfits.length);
// //   }, [outfits.length]);

// //   useEffect(() => {
// //     loadUserInfo();
// //     updateItemLength();
// //     loadSavedOutfits();
// //   }, [loadUserInfo, updateItemLength, loadSavedOutfits]);

// //   useEffect(() => {
// //     if (items && items.length > 0) {
// //       generateOutfits();
// //     }
// //   }, [items, selectedOccasion]);

// //   const currentOutfit = useMemo(() => 
// //     outfits[currentOutfitIndex], 
// //     [outfits, currentOutfitIndex]
// //   );

// //   if (isGenerating) {
// //     return (
// //       <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
// //         <Center style={{ minHeight: '100vh' }}>
// //           <Stack align="center" gap="md">
// //             <Loader size="xl" color="white" />
// //             <Text c="white" size="lg">Generating outfit combinations...</Text>
// //           </Stack>
// //         </Center>
// //       </Box>
// //     );
// //   }


// //   if (outfits.length === 0) {
// //     return (
// //       <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
// //         <Container size="lg" py="xl">
// //           <Card shadow="lg" padding="xl" radius="lg">
// //             <Stack align="center" gap="md">
// //               <Title order={2}>Unable to Generate Outfits</Title>
// //               <Text c="dimmed">
// //                 Make sure you have at least one top, bottom, and shoes in your closet.
// //               </Text>
// //               <Button onClick={generateOutfits} leftSection={<IconRefresh size={20} />}>
// //                 Try Again
// //               </Button>
// //             </Stack>
// //           </Card>
// //         </Container>
// //       </Box>
// //     );
// //   }

// //   const renderOutfitItem = (item: OutfitItem | undefined, label: string, color: string) => {
// //     if (!item) return null;

// //     return (
// //       <Stack gap="xs" align="center">
// //         {item.imageUrl ? (
// //           <Box
// //             style={{
// //               width: 120,
// //               height: 120,
// //               borderRadius: 8,
// //               overflow: 'hidden',
// //               border: '2px solid #e9ecef',
// //             }}
// //           >
// //             <img
// //               src={item.imageUrl}
// //               alt={item.name}
// //               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //             />
// //           </Box>
// //         ) : (
// //           <Box style={{ fontSize: '80px' }}>{item.emoji}</Box>
// //         )}
// //         <Text size="sm" fw={500}>{item.name}</Text>
// //         <Badge color={color} variant="light">{label}</Badge>
// //       </Stack>
// //     );
// //   };

// //   return (
// //     <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
// //       {showSavedNotification && (
// //         <Box style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
// //           <Notification
// //             icon={<IconCheck size={18} />}
// //             color="teal"
// //             title="Outfit Saved!"
// //             onClose={() => setShowSavedNotification(false)}
// //           >
// //             Your outfit has been saved to your collection.
// //           </Notification>
// //         </Box>
// //       )}

// //       <Container size="lg" py="xl">
// //         <Stack gap="xl">
// //           <Group justify="space-between">
// //             <div>
// //               <Title order={1} c="white" mb="xs">Outfit Suggestions</Title>
// //               <Text c="rgba(255,255,255,0.9)" size="lg">
// //                 What should I wear today? ({outfits.length} combinations available)
// //               </Text>
// //             </div>
// //             <Button
// //               component="a"
// //               href="/saved-outfits"
// //               leftSection={<IconBookmark size={20} />}
// //               variant="white"
// //               size="md"
// //             >
// //               View Saved Outfits ({savedOutfits.length})
// //             </Button>
// //           </Group>

// //           <Paper shadow="sm" p="md" radius="md">
// //             <Stack gap="md">
// //               <Select
// //                 label="Occasion"
// //                 placeholder="Select occasion"
// //                 data={occasions}
// //                 value={selectedOccasion}
// //                 onChange={(value) => setSelectedOccasion(value || 'Casual')}
// //                 size="md"
// //               />

// //               <div>
// //                 <Text size="sm" fw={500} mb="xs">Weather</Text>
// //                 <Group gap="xs">
// //                   {weatherConditions.map((weather) => (
// //                     <Button
// //                       key={weather.value}
// //                       variant={selectedWeather === weather.value ? 'filled' : 'light'}
// //                       leftSection={<weather.icon size={18} />}
// //                       size="sm"
// //                       onClick={() => setSelectedWeather(weather.value)}
// //                     >
// //                       {weather.label}
// //                     </Button>
// //                   ))}
// //                 </Group>
// //               </div>
// //             </Stack>
// //           </Paper>

// //           {currentOutfit && (
// //             <Card shadow="lg" padding="xl" radius="lg" style={{ backgroundColor: 'white' }}>
// //               <Stack gap="lg">
// //                 <Box style={{ textAlign: 'center' }}>
// //                   <Text size="sm" c="dimmed" mb="md">
// //                     Outfit {currentOutfitIndex + 1} of {outfits.length}
// //                   </Text>

// //                   <Flex justify="center" gap="xl" mb="lg" wrap="wrap">
// //                     {renderOutfitItem(currentOutfit.hats, 'Hat', 'indigo')}
// //                     {renderOutfitItem(currentOutfit.top, 'Top', 'violet')}
// //                     {renderOutfitItem(currentOutfit.outerwear, 'Outerwear', 'grape')}
// //                     {renderOutfitItem(currentOutfit.bottom, 'Bottom', 'blue')}
// //                     {renderOutfitItem(currentOutfit.shoes, 'Shoes', 'green')}
// //                     {renderOutfitItem(currentOutfit.accessory, 'Accessory', 'orange')}
// //                   </Flex>

// //                   <Group justify="center" gap="xs" mb="md">
// //                     <Badge size="lg" variant="dot" color="grape">
// //                       {currentOutfit.occasion}
// //                     </Badge>
// //                     <Badge size="lg" variant="dot" color="cyan">
// //                       {currentOutfit.weather}
// //                     </Badge>
// //                     {isOutfitAlreadySaved(currentOutfit) && (
// //                       <Badge size="lg" variant="dot" color="teal">
// //                         Already Saved
// //                       </Badge>
// //                     )}
// //                   </Group>
// //                 </Box>

// //                 <Group justify="center" gap="md">
// //                   <ActionIcon
// //                     size="xl"
// //                     variant="light"
// //                     color={currentOutfit.liked ? 'red' : 'gray'}
// //                     onClick={() => toggleLike(currentOutfit.id)}
// //                     loading={isSaving}
// //                     disabled={isSaving}
// //                   >
// //                     {currentOutfit.liked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
// //                   </ActionIcon>

// //                   <Button
// //                     size="lg"
// //                     leftSection={<IconRefresh size={20} />}
// //                     onClick={generateNewOutfit}
// //                   >
// //                     Try Another
// //                   </Button>

// //                   <Button
// //                     size="lg"
// //                     variant="light"
// //                     onClick={generateOutfits}
// //                   >
// //                     Regenerate All
// //                   </Button>
// //                 </Group>
// //               </Stack>
// //             </Card>
// //           )}
// //         </Stack>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default OutfitSuggestionsPage;



// // import { useEffect, useState, useMemo, useCallback } from 'react';
// // import {
// //   Container,
// //   Title,
// //   Text,
// //   Button,
// //   Group,
// //   Stack,
// //   Card,
// //   Badge,
// //   Select,
// //   Box,
// //   ActionIcon,
// //   Paper,
// //   Loader,
// //   Center,
// //   Notification,
// //   Flex,
// // } from '@mantine/core';
// // import {
// //   IconRefresh,
// //   IconHeart,
// //   IconHeartFilled,
// //   IconCheck,
// //   IconBookmark,
// // } from '@tabler/icons-react';
// // import { useUserStore } from '../../stores/UserStore';
// // import { useClothingStore } from '../../stores/clothingStore';
// // import { occasions, weatherConditions } from '../../constants';
// // import type { ClothingItem, Outfit, OutfitDetails, OutfitItem, SaveOutfitRequest } from '../../interfaces/interfaces';
// // import { getSavedOutfits, saveCompleteOutfit } from '../../sevices/OutfitServices';

// // const CATEGORY_EMOJIS: Record<string, string> = {
// //   'Tops': '👕',
// //   'Bottoms': '👖',
// //   'Shoes': '👟',
// //   'Accessories': '🧢',
// //   'Dresses': '👗',
// //   'Outerwear': '🧥',
// //   'Hats': '🎩',
// // };

// // const DEFAULT_EMOJI = '👔';

// // const OutfitSuggestionsPage = () => {
// //   const [selectedOccasion, setSelectedOccasion] = useState('Casual');
// //   const [selectedWeather, setSelectedWeather] = useState('Sunny');
// //   const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
// //   const [outfits, setOutfits] = useState<Outfit[]>([]);
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [showSavedNotification, setShowSavedNotification] = useState(false);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [savedOutfits, setSavedOutfits] = useState<OutfitDetails[]>([]);

// //   const { loadUserInfo } = useUserStore();
// //   const { updateItemLength, items } = useClothingStore();

// //   const getEmojiForCategory = useCallback((category: string): string => {
// //     return CATEGORY_EMOJIS[category] || DEFAULT_EMOJI;
// //   }, []);

// //   const createOutfitItem = useCallback((item: ClothingItem): OutfitItem => ({
// //     id: item.id,
// //     name: item.name,
// //     emoji: getEmojiForCategory(item.category),
// //     imageUrl: item.imageUrl,
// //   }), [getEmojiForCategory]);

// //   const determineWeather = useCallback((top: ClothingItem, bottom: ClothingItem): string => {
// //     if (top.season === 'Winter' || bottom.season === 'Winter') return 'Cold';
// //     if (top.season === 'Summer' || bottom.season === 'Summer') return 'Sunny';
// //     if (top.season === 'Spring' || bottom.season === 'Spring') return 'Rainy';
// //     return 'Any';
// //   }, []);

// //   const isOutfitAlreadySaved = useCallback((outfit: Outfit): boolean => {
// //     return savedOutfits.some(saved => 
// //       saved.top.id === outfit.top.id &&
// //       saved.bottom.id === outfit.bottom.id &&
// //       saved.shoes.id === outfit.shoes.id &&
// //       (!outfit.accessory || saved.accessory?.id === outfit.accessory.id) &&
// //       (!outfit.outerwear || saved.outerwear?.id === outfit.outerwear.id) &&
// //       (!outfit.hats || saved.hats?.id === outfit.hats.id)
// //     );
// //   }, [savedOutfits]);

// //   const loadSavedOutfits = useCallback(async () => {
// //     try {
// //       const data = await getSavedOutfits();
// //       setSavedOutfits(data);
// //     } catch (error) {
// //       console.error('Error loading saved outfits:', error);
// //     }
// //   }, []);

// //   const generateOutfits = useCallback(() => {
// //     if (!items || items.length === 0) return;

// //     setIsGenerating(true);

// //     const categorizedItems = {
// //       tops: items.filter(item => item.category === 'Tops'),
// //       bottoms: items.filter(item => item.category === 'Bottoms'),
// //       shoes: items.filter(item => item.category === 'Shoes'),
// //       accessories: items.filter(item => item.category === 'Accessories'),
// //       outerwear: items.filter(item => item.category === 'Outerwear'),
// //       hats: items.filter(item => item.category === 'Hats'),
// //     };

// //     const { tops, bottoms, shoes, accessories, outerwear, hats } = categorizedItems;

// //     if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
// //       setIsGenerating(false);
// //       setOutfits([]);
// //       return;
// //     }

// //     const generatedOutfits: Outfit[] = [];
// //     let outfitId = 1;

// //     tops.forEach((top, topIndex) => {
// //       bottoms.forEach((bottom, bottomIndex) => {
// //         shoes.forEach((shoe, shoeIndex) => {
// //           const accessoryIndex = accessories.length > 0 
// //             ? (topIndex + bottomIndex + shoeIndex) % accessories.length 
// //             : -1;
          
// //           const outerwearIndex = outerwear.length > 0
// //             ? (topIndex + bottomIndex) % outerwear.length
// //             : -1;

// //           const hatsIndex = hats.length > 0
// //             ? (topIndex + shoeIndex) % hats.length
// //             : -1;

// //           const outfit: Outfit = {
// //             id: outfitId++,
// //             top: createOutfitItem(top),
// //             bottom: createOutfitItem(bottom),
// //             shoes: createOutfitItem(shoe),
// //             ...(accessoryIndex >= 0 && { accessory: createOutfitItem(accessories[accessoryIndex]) }),
// //             ...(outerwearIndex >= 0 && { outerwear: createOutfitItem(outerwear[outerwearIndex]) }),
// //             ...(hatsIndex >= 0 && { hats: createOutfitItem(hats[hatsIndex]) }),
// //             occasion: selectedOccasion,
// //             weather: determineWeather(top, bottom),
// //             liked: false,
// //           };

// //           generatedOutfits.push(outfit);
// //         });
// //       });
// //     });

// //     setOutfits(generatedOutfits);
// //     setCurrentOutfitIndex(0);
// //     setIsGenerating(false);
// //   }, [items, selectedOccasion, createOutfitItem, determineWeather]);

// //   const saveOutfitToDatabase = useCallback(async (outfit: Outfit) => {
// //     try {
// //       setIsSaving(true);

// //       // Prepare outfit data according to backend SaveOutfitDto
// //       const outfitData: SaveOutfitRequest = {
// //         topId: outfit.top.id,
// //         bottomId: outfit.bottom.id,
// //         shoesId: outfit.shoes.id,
// //         accessoryId: outfit.accessory?.id ?? null,
// //         outwearId: outfit.outerwear?.id ?? null,
// //         hatsId: outfit.hats?.id ?? null,
// //         occasion: outfit.occasion,
// //         weather: outfit.weather,
// //       };

// //       console.log('Saving outfit to database:', outfitData);
      
// //       await saveCompleteOutfit(outfitData);
      
// //       setShowSavedNotification(true);
// //       setTimeout(() => setShowSavedNotification(false), 3000);
      
// //       // Reload saved outfits to update the list
// //       await loadSavedOutfits();
      
// //       console.log('Outfit saved successfully');
// //     } catch (error) {
// //       console.error('Error saving outfit:', error);
// //       alert('Failed to save outfit. Please try again.');
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   }, [loadSavedOutfits]);

// //   const toggleLike = useCallback(async (id: number) => {
// //     const outfit = outfits.find(o => o.id === id);
// //     if (!outfit) return;

// //     const newLikedState = !outfit.liked;

// //     // Update UI immediately for better UX
// //     setOutfits(prevOutfits =>
// //       prevOutfits.map(o =>
// //         o.id === id ? { ...o, liked: newLikedState } : o
// //       )
// //     );

// //     // If liking the outfit and it's not already saved, save it
// //     if (newLikedState) {
// //       if (isOutfitAlreadySaved(outfit)) {
// //         console.log('Outfit already saved, skipping database save');
// //       } else {
// //         await saveOutfitToDatabase({ ...outfit, liked: true });
// //       }
// //     }
// //   }, [outfits, isOutfitAlreadySaved, saveOutfitToDatabase]);

// //   const generateNewOutfit = useCallback(() => {
// //     setCurrentOutfitIndex(prev => (prev + 1) % outfits.length);
// //   }, [outfits.length]);

// //   useEffect(() => {
// //     loadUserInfo();
// //     updateItemLength();
// //     loadSavedOutfits();
// //   }, [loadUserInfo, updateItemLength, loadSavedOutfits]);

// //   useEffect(() => {
// //     if (items && items.length > 0) {
// //       generateOutfits();
// //     }
// //   }, [items, selectedOccasion]);

// //   const currentOutfit = useMemo(() => 
// //     outfits[currentOutfitIndex], 
// //     [outfits, currentOutfitIndex]
// //   );

// //   if (isGenerating) {
// //     return (
// //       <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
// //         <Center style={{ minHeight: '100vh' }}>
// //           <Stack align="center" gap="md">
// //             <Loader size="xl" color="white" />
// //             <Text c="white" size="lg">Generating outfit combinations...</Text>
// //           </Stack>
// //         </Center>
// //       </Box>
// //     );
// //   }


// //   if (outfits.length === 0) {
// //     return (
// //       <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
// //         <Container size="lg" py="xl">
// //           <Card shadow="lg" padding="xl" radius="lg">
// //             <Stack align="center" gap="md">
// //               <Title order={2}>Unable to Generate Outfits</Title>
// //               <Text c="dimmed">
// //                 Make sure you have at least one top, bottom, and shoes in your closet.
// //               </Text>
// //               <Button onClick={generateOutfits} leftSection={<IconRefresh size={20} />}>
// //                 Try Again
// //               </Button>
// //             </Stack>
// //           </Card>
// //         </Container>
// //       </Box>
// //     );
// //   }

// //   const renderOutfitItem = (item: OutfitItem | undefined, label: string, color: string) => {
// //     if (!item) return null;

// //     return (
// //       <Stack gap="xs" align="center">
// //         {item.imageUrl ? (
// //           <Box
// //             style={{
// //               width: 120,
// //               height: 120,
// //               borderRadius: 8,
// //               overflow: 'hidden',
// //               border: '2px solid #e9ecef',
// //             }}
// //           >
// //             <img
// //               src={item.imageUrl}
// //               alt={item.name}
// //               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //             />
// //           </Box>
// //         ) : (
// //           <Box style={{ fontSize: '80px' }}>{item.emoji}</Box>
// //         )}
// //         <Text size="sm" fw={500}>{item.name}</Text>
// //         <Badge color={color} variant="light">{label}</Badge>
// //       </Stack>
// //     );
// //   };

// //   return (
// //     <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
// //       {showSavedNotification && (
// //         <Box style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
// //           <Notification
// //             icon={<IconCheck size={18} />}
// //             color="teal"
// //             title="Outfit Saved!"
// //             onClose={() => setShowSavedNotification(false)}
// //           >
// //             Your outfit has been saved to your collection.
// //           </Notification>
// //         </Box>
// //       )}

// //       <Container size="lg" py="xl">
// //         <Stack gap="xl">
// //           <Group justify="space-between">
// //             <div>
// //               <Title order={1} c="white" mb="xs">Outfit Suggestions</Title>
// //               <Text c="rgba(255,255,255,0.9)" size="lg">
// //                 What should I wear today? ({outfits.length} combinations available)
// //               </Text>
// //             </div>
// //             <Button
// //               component="a"
// //               href="/saved-outfits"
// //               leftSection={<IconBookmark size={20} />}
// //               variant="white"
// //               size="md"
// //             >
// //               View Saved Outfits ({savedOutfits.length})
// //             </Button>
// //           </Group>

// //           <Paper shadow="sm" p="md" radius="md">
// //             <Stack gap="md">
// //               <Select
// //                 label="Occasion"
// //                 placeholder="Select occasion"
// //                 data={occasions}
// //                 value={selectedOccasion}
// //                 onChange={(value) => setSelectedOccasion(value || 'Casual')}
// //                 size="md"
// //               />

// //               <div>
// //                 <Text size="sm" fw={500} mb="xs">Weather</Text>
// //                 <Group gap="xs">
// //                   {weatherConditions.map((weather) => (
// //                     <Button
// //                       key={weather.value}
// //                       variant={selectedWeather === weather.value ? 'filled' : 'light'}
// //                       leftSection={<weather.icon size={18} />}
// //                       size="sm"
// //                       onClick={() => setSelectedWeather(weather.value)}
// //                     >
// //                       {weather.label}
// //                     </Button>
// //                   ))}
// //                 </Group>
// //               </div>
// //             </Stack>
// //           </Paper>

// //           {currentOutfit && (
// //             <Card shadow="lg" padding="xl" radius="lg" style={{ backgroundColor: 'white' }}>
// //               <Stack gap="lg">
// //                 <Box style={{ textAlign: 'center' }}>
// //                   <Text size="sm" c="dimmed" mb="md">
// //                     Outfit {currentOutfitIndex + 1} of {outfits.length}
// //                   </Text>

// //                   <Flex justify="center" gap="xl" mb="lg" wrap="wrap">
// //                     {renderOutfitItem(currentOutfit.hats, 'Hat', 'indigo')}
// //                     {renderOutfitItem(currentOutfit.top, 'Top', 'violet')}
// //                     {renderOutfitItem(currentOutfit.outerwear, 'Outerwear', 'grape')}
// //                     {renderOutfitItem(currentOutfit.bottom, 'Bottom', 'blue')}
// //                     {renderOutfitItem(currentOutfit.shoes, 'Shoes', 'green')}
// //                     {renderOutfitItem(currentOutfit.accessory, 'Accessory', 'orange')}
// //                   </Flex>

// //                   <Group justify="center" gap="xs" mb="md">
// //                     <Badge size="lg" variant="dot" color="grape">
// //                       {currentOutfit.occasion}
// //                     </Badge>
// //                     <Badge size="lg" variant="dot" color="cyan">
// //                       {currentOutfit.weather}
// //                     </Badge>
// //                     {isOutfitAlreadySaved(currentOutfit) && (
// //                       <Badge size="lg" variant="dot" color="teal">
// //                         Already Saved
// //                       </Badge>
// //                     )}
// //                   </Group>
// //                 </Box>

// //                 <Group justify="center" gap="md">
// //                   <ActionIcon
// //                     size="xl"
// //                     variant="light"
// //                     color={currentOutfit.liked ? 'red' : 'gray'}
// //                     onClick={() => toggleLike(currentOutfit.id)}
// //                     loading={isSaving}
// //                     disabled={isSaving}
// //                   >
// //                     {currentOutfit.liked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
// //                   </ActionIcon>

// //                   <Button
// //                     size="lg"
// //                     leftSection={<IconRefresh size={20} />}
// //                     onClick={generateNewOutfit}
// //                   >
// //                     Try Another
// //                   </Button>

// //                   <Button
// //                     size="lg"
// //                     variant="light"
// //                     onClick={generateOutfits}
// //                   >
// //                     Regenerate All
// //                   </Button>
// //                 </Group>
// //               </Stack>
// //             </Card>
// //           )}
// //         </Stack>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default OutfitSuggestionsPage;