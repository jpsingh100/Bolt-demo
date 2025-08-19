export interface WeatherData {
  location: string;
  region: string;
  country: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  description: string;
  backgroundImage: string;
  quote: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
}

export interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  visibility: number;
}

export interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  zip: string;
}

export interface IconScaleProps {
  level: number;
  type: 'temperature' | 'wind' | 'humidity';
  value: number;
  unit?: string;
}