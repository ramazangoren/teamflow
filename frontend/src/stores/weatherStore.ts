import { create } from 'zustand';
import { getWeather } from '../sevices/weatherServices';

interface WeatherData {
    date: string;
    day: string;
    degree: string;
    description: string;
    humidity: string;
    icon: string;
    max: string;
    min: string;
    night: string;
    status: string;
}

interface WeatherStore {
    // State
    todayWeather: WeatherData | null;
    restOftheWeekWeather: WeatherData[];
    city: string | null;
    loading: boolean;
    error: string | null;
    showWeekly: boolean;

    // Actions
    setShowWeekly: (show: boolean) => void;
    requestLocationAndLoadWeather: () => Promise<void>;
    loadWeatherData: (cityName: string) => Promise<void>;
    getCityFromCoordinates: (lat: number, lon: number) => Promise<string>;
    reset: () => void;
}

const transliterateToLatin = (text: string): string => {
    const turkishToLatin: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    };

    return text.toLowerCase()
        .split('')
        .map(char => turkishToLatin[char] || char)
        .join('');
};

export const useWeatherStore = create<WeatherStore>((set) => ({
    // Initial State
    todayWeather: null,
    restOftheWeekWeather: [],
    city: null,
    loading: true,
    error: null,
    showWeekly: false,

    // Actions
    setShowWeekly: (show) => set({ showWeekly: show }),

    getCityFromCoordinates: async (lat: number, lon: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
            );
            const data = await response.json();

            const cityName = data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.county ||
                'istanbul';

            return transliterateToLatin(cityName);
        } catch (error) {
            console.error('Error getting city name:', error);
            return 'istanbul';
        }
    },

    loadWeatherData: async (cityName: string) => {
        set({ loading: true, error: null });
        try {
            const weatherData = await getWeather(cityName);
            
            if (weatherData && Array.isArray(weatherData) && weatherData.length > 0) {
                set({
                    todayWeather: weatherData[0],
                    restOftheWeekWeather: weatherData.slice(1, 6),
                    loading: false,
                    error: null
                });
            } else {
                set({
                    error: 'Failed to load weather data',
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error loading weather:', error);
            set({
                error: 'Failed to load weather data',
                loading: false
            });
        }
    },

    requestLocationAndLoadWeather: async () => {
        if (!navigator.geolocation) {
            set({
                error: 'Geolocation is not supported by your browser',
                loading: false
            });
            return;
        }

        set({ loading: true, error: null });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const getCityFromCoordinates = useWeatherStore.getState().getCityFromCoordinates;
                const loadWeatherData = useWeatherStore.getState().loadWeatherData;

                const cityName = await getCityFromCoordinates(lat, lon);
                set({ city: cityName });
                await loadWeatherData(cityName);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'An unknown error occurred.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                
                set({
                    error: errorMessage,
                    loading: false
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    },

    reset: () => set({
        todayWeather: null,
        restOftheWeekWeather: [],
        city: null,
        loading: true,
        error: null,
        showWeekly: false
    })
}));