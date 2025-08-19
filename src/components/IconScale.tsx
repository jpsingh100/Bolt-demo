import React from 'react';
import { 
  Thermometer, 
  Sun, 
  CloudSnow, 
  Snowflake,
  Wind,
  Zap,
  Droplets,
  CloudDrizzle,
  Cloud
} from 'lucide-react';
import { IconScaleProps } from '../types/weather';

const IconScale: React.FC<IconScaleProps> = ({ level, type, value, unit }) => {
  const getIcons = () => {
    switch (type) {
      case 'temperature':
        return [
          { icon: Snowflake, color: 'text-blue-300', label: 'Freezing' },
          { icon: CloudSnow, color: 'text-blue-400', label: 'Cold' },
          { icon: Thermometer, color: 'text-green-400', label: 'Mild' },
          { icon: Sun, color: 'text-yellow-400', label: 'Warm' },
          { icon: Sun, color: 'text-red-400', label: 'Hot' }
        ];
      case 'wind':
        return [
          { icon: Wind, color: 'text-gray-300', label: 'Calm' },
          { icon: Wind, color: 'text-blue-300', label: 'Light' },
          { icon: Wind, color: 'text-blue-400', label: 'Moderate' },
          { icon: Wind, color: 'text-blue-500', label: 'Strong' },
          { icon: Zap, color: 'text-purple-500', label: 'Very Strong' }
        ];
      case 'humidity':
        return [
          { icon: Sun, color: 'text-yellow-300', label: 'Dry' },
          { icon: Cloud, color: 'text-gray-400', label: 'Low' },
          { icon: CloudDrizzle, color: 'text-blue-300', label: 'Moderate' },
          { icon: Droplets, color: 'text-blue-400', label: 'High' },
          { icon: Droplets, color: 'text-blue-600', label: 'Very High' }
        ];
      default:
        return [];
    }
  };

  const icons = getIcons();
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-white mb-1">{capitalizedType}</h3>
        <p className="text-2xl font-bold text-white">
          {value}{unit && <span className="text-sm ml-1">{unit}</span>}
        </p>
      </div>
      
      <div className="flex justify-center space-x-2">
        {icons.map((iconData, index) => {
          const IconComponent = iconData.icon;
          const isActive = index + 1 === level;
          
          return (
            <div
              key={index}
              className={`relative group transition-all duration-300 ${
                isActive 
                  ? 'transform scale-110 drop-shadow-lg' 
                  : 'opacity-30 hover:opacity-60 hover:scale-105'
              }`}
            >
              <div className={`${
                isActive 
                  ? 'bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full p-2 shadow-lg' 
                  : 'p-2'
              } transition-all duration-300`}>
                <IconComponent 
                  size={20} 
                  className={`${
                    isActive 
                      ? `${iconData.color} filter brightness-110 contrast-110` 
                      : 'text-white/40 grayscale'
                  } transition-all duration-300`}
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                {iconData.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconScale;