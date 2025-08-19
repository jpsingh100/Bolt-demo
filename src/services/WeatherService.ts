import axios from 'axios';
import { WeatherData, OpenWeatherResponse, GeocodingResponse } from '../types/weather';
import { QuoteService } from './QuoteService';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Background images for different weather conditions and locations
const getBackgroundImage = (weatherMain: string, location: string): string => {
  const weatherBackgrounds: { [key: string]: string[] } = {
    clear: [
      'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ],
    clouds: [
      'https://images.pexels.com/photos/590478/pexels-photo-590478.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ],
    rain: [
      'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ],
    snow: [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1571442/pexels-photo-1571442.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ],
    thunderstorm: [
      'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ],
    default: [
      'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/417195/pexels-photo-417195.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ]
  };

  const backgrounds = weatherBackgrounds[weatherMain.toLowerCase()] || weatherBackgrounds.default;
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
};

const getWeatherCondition = (weatherMain: string): string => {
  const conditionMap: { [key: string]: string } = {
    'clear': 'sunny',
    'clouds': 'cloudy',
    'rain': 'rainy',
    'drizzle': 'drizzle',
    'thunderstorm': 'stormy',
    'snow': 'snowy',
    'mist': 'misty',
    'fog': 'foggy',
    'haze': 'hazy'
  };
  
  return conditionMap[weatherMain.toLowerCase()] || 'partly-cloudy';
};

export class WeatherService {
  static async getLocationByZipcode(zipcode: string): Promise<GeocodingResponse> {
    try {
      const response = await axios.get<GeocodingResponse>(
        `${GEO_URL}/zip?zip=${zipcode},US&appid=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Invalid zipcode ${zipcode}. Please check the zipcode and try again.`);
        } else if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key configuration.');
        }
      }
      throw new Error('Failed to fetch location data. Please check your internet connection and try again.');
    }
  }

  static async getWeatherByZipcode(zipcode: string): Promise<WeatherData> {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('OpenWeatherMap API key is not configured. Please add your API key to the .env file.');
    }

    try {
      // First, get location details including state from Geocoding API
      const locationData = await this.getLocationByZipcode(zipcode);
      
      // Then, get weather data using coordinates
      const response = await axios.get<OpenWeatherResponse>(
        `${BASE_URL}/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${API_KEY}&units=imperial`
      );

      const data = response.data;
      const weatherMain = data.weather[0].main;
      
      // Generate AI quote
      const quote = await QuoteService.generateQuote(
        locationData.name,
        weatherMain,
        Math.round(data.main.temp),
        data.weather[0].description
      );
      
      const weatherData: WeatherData = {
        location: locationData.name,
        region: locationData.state || '',
        country: locationData.country,
        temperature: Math.round(data.main.temp),
        windSpeed: Math.round(data.wind.speed),
        humidity: data.main.humidity,
        condition: getWeatherCondition(weatherMain),
        description: data.weather[0].description
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        backgroundImage: getBackgroundImage(weatherMain, locationData.name),
        quote: quote,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000) // Convert to km
      };

      return weatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Invalid zipcode ${zipcode}. Please check the zipcode and try again.`);
        } else if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key configuration.');
        } else if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
      }
      // Re-throw the error if it's already a custom error from getLocationByZipcode
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
    }
  }


  static convertTemperature(temp: number, toUnit: 'F' | 'C'): number {
    if (toUnit === 'C') {
      return Math.round((temp - 32) * 5 / 9);
    } else {
      return Math.round(temp * 9 / 5 + 32);
    }
  }

  static getTemperatureLevel(temp: number, unit: 'F' | 'C'): number {
    const fahrenheit = unit === 'F' ? temp : this.convertTemperature(temp, 'F');
    if (fahrenheit <= 32) return 1;
    if (fahrenheit <= 50) return 2;
    if (fahrenheit <= 70) return 3;
    if (fahrenheit <= 85) return 4;
    return 5;
  }

  static getWindLevel(windSpeed: number): number {
    if (windSpeed <= 5) return 1;
    if (windSpeed <= 10) return 2;
    if (windSpeed <= 15) return 3;
    if (windSpeed <= 20) return 4;
    return 5;
  }

  static getHumidityLevel(humidity: number): number {
    if (humidity <= 20) return 1;
    if (humidity <= 40) return 2;
    if (humidity <= 60) return 3;
    if (humidity <= 80) return 4;
    return 5;
  }
}