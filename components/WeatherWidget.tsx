import React from 'react';
import { WeatherState } from '../types';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherState;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('güneş') || c.includes('açık')) return <Sun className="w-20 h-20 text-amber-400 drop-shadow-lg" />;
    if (c.includes('yağmur') || c.includes('sağanak')) return <CloudRain className="w-20 h-20 text-blue-400 drop-shadow-lg" />;
    if (c.includes('kar')) return <Snowflake className="w-20 h-20 text-cyan-100 drop-shadow-lg" />;
    if (c.includes('rüzgar')) return <Wind className="w-20 h-20 text-slate-300 drop-shadow-lg" />;
    return <Cloud className="w-20 h-20 text-slate-200 drop-shadow-lg" />;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50">
          <MapPin size={16} className="text-white inline mr-1" />
          <span className="text-xs text-white font-medium uppercase tracking-wider">{weather.city}</span>
      </div>

      <div className="scale-110 transition-transform duration-500 hover:scale-125">
        {getIcon(weather.condition)}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-5xl font-black text-white tracking-tighter">{Math.round(weather.temp)}°</div>
        <div className="text-blue-200 font-medium mt-1">{weather.condition}</div>
      </div>
    </div>
  );
};

export default WeatherWidget;