import React from 'react';
import { WeatherState } from '../types';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherState;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  
  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('güneş') || c.includes('açık')) return <Sun className="w-16 h-16 text-yellow-400" />;
    if (c.includes('yağmur') || c.includes('sağanak')) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (c.includes('kar')) return <Snowflake className="w-16 h-16 text-white" />;
    if (c.includes('rüzgar')) return <Wind className="w-16 h-16 text-gray-300" />;
    if (c.includes('bulut')) return <Cloud className="w-16 h-16 text-gray-200" />;
    return <Cloud className="w-16 h-16 text-gray-200" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between text-white shadow-xl border border-white/10 h-full">
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1 text-blue-200 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold truncate max-w-[120px]">
                {weather.city}
                {weather.district ? `, ${weather.district}` : ''}
            </span>
        </div>
        <span className="text-5xl font-bold tracking-tighter">{Math.round(weather.temp)}°</span>
        <span className="text-sm opacity-80 mt-1 font-medium">{weather.condition}</span>
      </div>
      <div className="animate-pulse scale-90">
        {getIcon(weather.condition)}
      </div>
    </div>
  );
};

export default WeatherWidget;