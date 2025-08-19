import React, { useState } from 'react';
import { Search, MapPin, RotateCcw, AlertCircle, Thermometer, Eye, Gauge, Sparkles } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { WeatherService } from '../services/WeatherService';
import IconScale from './IconScale';

const WeatherApp: React.FC = () => {
  const [zipcode, setZipcode] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipcode.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const weatherData = await WeatherService.getWeatherByZipcode(zipcode);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTemperatureUnit = () => {
    setTempUnit(prev => prev === 'F' ? 'C' : 'F');
  };

  const getDisplayTemperature = () => {
    if (!weather) return 0;
    return tempUnit === 'F' 
      ? weather.temperature 
      : WeatherService.convertTemperature(weather.temperature, 'C');
  };

  const getTemperatureLevel = () => {
    if (!weather) return 1;
    return WeatherService.getTemperatureLevel(getDisplayTemperature(), tempUnit);
  };

  const backgroundStyle = weather ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${weather.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out"
      style={weather ? backgroundStyle : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter zipcode (e.g., 10001, 90210, 33101)"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              </div>
              <button
                type="submit"
                disabled={loading || !zipcode.trim()}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'Get Weather'}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8">
          <div className="max-w-6xl mx-auto w-full">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-6 text-white">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle size={20} />
                  <p className="text-center">{error}</p>
                </div>
              </div>
            )}

            {weather && (
              <div className="space-y-8">
                {/* Quote Section */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="text-yellow-300" size={20} />
                    <span className="text-sm text-white/70 font-medium">AI-Generated Inspiration</span>
                    <Sparkles className="text-yellow-300" size={20} />
                  </div>
                  <blockquote className="text-xl md:text-2xl font-light text-white italic leading-relaxed max-w-4xl mx-auto">
                    "{weather.quote}"
                  </blockquote>
                </div>

                {/* Location & Main Weather Info */}
                <div className="text-center space-y-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {weather.location}
                    </h1>
                    <p className="text-xl text-white/80">
                      {weather.region && `${weather.region}, `}{weather.country}
                    </p>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block border border-white/30">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-6xl md:text-7xl font-bold text-white">
                          {getDisplayTemperature()}°
                        </p>
                        <p className="text-lg text-white/80 mt-2">{weather.description}</p>
                      </div>
                      <button
                        onClick={toggleTemperatureUnit}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white transition-all duration-300"
                        title={`Switch to ${tempUnit === 'F' ? 'Celsius' : 'Fahrenheit'}`}
                      >
                        <RotateCcw size={24} />
                        <span className="ml-2 font-semibold">{tempUnit === 'F' ? 'C' : 'F'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Weather Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 text-center">
                    <Thermometer className="mx-auto mb-2 text-white/80" size={24} />
                    <p className="text-sm text-white/70">Feels Like</p>
                    <p className="text-lg font-semibold text-white">
                      {tempUnit === 'F' ? weather.feelsLike : WeatherService.convertTemperature(weather.feelsLike, 'C')}°{tempUnit}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 text-center">
                    <Gauge className="mx-auto mb-2 text-white/80" size={24} />
                    <p className="text-sm text-white/70">Pressure</p>
                    <p className="text-lg font-semibold text-white">{weather.pressure} hPa</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 text-center">
                    <Eye className="mx-auto mb-2 text-white/80" size={24} />
                    <p className="text-sm text-white/70">Visibility</p>
                    <p className="text-lg font-semibold text-white">{weather.visibility} km</p>
                  </div>
                </div>
                {/* Weather Attributes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <IconScale 
                    level={getTemperatureLevel()}
                    type="temperature"
                    value={getDisplayTemperature()}
                    unit={`°${tempUnit}`}
                  />
                  <IconScale 
                    level={WeatherService.getWindLevel(weather.windSpeed)}
                    type="wind"
                    value={weather.windSpeed}
                    unit="mph"
                  />
                  <IconScale 
                    level={WeatherService.getHumidityLevel(weather.humidity)}
                    type="humidity"
                    value={weather.humidity}
                    unit="%"
                  />
                </div>
              </div>
            )}

            {!weather && !error && !loading && (
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-12 border border-white/30 max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome to Weather Insights</h2>
                  <p className="text-lg text-white/80 mb-6">
                    Get real-time weather data for any location with beautiful visuals and uplifting insights.
                  </p>
                  <p className="text-white/70">
                    Enter any valid zipcode to get started!
                  </p>
                  <div className="mt-4 text-sm text-white/60">
                    <p>Powered by OpenWeatherMap API</p>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-12 border border-white/30 max-w-2xl mx-auto">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-xl text-white">Fetching real-time weather data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;