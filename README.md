# Weather Insights App

A beautiful, modern weather application that provides real-time weather data for any zipcode using the OpenWeatherMap API.

## Features

- **Real-time Weather Data**: Fetches live weather information using OpenWeatherMap API
- **AI-Generated Quotes**: Dynamic, personalized motivational quotes generated using OpenRouter API
- **Zipcode Lookup**: Enter any valid zipcode to get weather information
- **Temperature Toggle**: Switch between Fahrenheit and Celsius
- **Visual Icon Scales**: 5-level visual indicators for temperature, wind speed, and humidity
- **Dynamic Backgrounds**: Location and weather-appropriate background images
- **Uplifting Quotes**: AI-generated motivational quotes based on weather conditions
- **Additional Metrics**: Feels-like temperature, atmospheric pressure, and visibility
- **Responsive Design**: Optimized for desktop and mobile devices

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API keys section
4. Copy your API key

### 2. Get OpenRouter API Key (Optional)

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for an account
3. Create a new API key
4. Copy your API key

### 3. Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values with your actual API keys:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   VITE_OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
   ```

**Note**: If you don't provide an OpenRouter API key, the app will use pre-written fallback quotes.

### 4. Start the Application

The development server should start automatically. If not, run:
```bash
npm run dev
```

## Usage

1. Enter any valid zipcode in the search field
2. Click "Get Weather" or press Enter
3. View real-time weather data with visual indicators
4. Toggle between Fahrenheit and Celsius using the temperature toggle button
5. Enjoy the dynamic background and uplifting weather quote!

## API Integration

This app integrates with two APIs:

### OpenWeatherMap API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**: zipcode, API key, units (imperial)
- **Response**: Temperature, humidity, wind speed, weather conditions, and more

### OpenRouter API (Optional)
- **Model**: Anthropic Claude 3 Haiku
- **Purpose**: Generate personalized, uplifting weather quotes
- **Fallback**: Pre-written quotes if API is unavailable

## Error Handling

The app includes comprehensive error handling for:
- Invalid or missing API keys
- Invalid zipcodes
- Network connectivity issues
- API rate limiting
- Server errors

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API requests
- **Vite** for development and building
- **OpenWeatherMap API** for weather data
- **OpenRouter API** for AI-generated quotes

## Browser Support

This application works in all modern browsers that support ES2020+ features.