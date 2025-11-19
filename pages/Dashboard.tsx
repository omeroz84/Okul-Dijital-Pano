
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData } from '../services/storage';
import { AppData, ThemeType } from '../types';
import Clock from '../components/Clock';
import WeatherWidget from '../components/WeatherWidget';
import DutyTeachers from '../components/DutyTeachers';
import DutyStudents from '../components/DutyStudents';
import PhotoSlider from '../components/PhotoSlider';
import AiWidget from '../components/AiWidget';
import { Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AppData>(getStoredData());

  // Poll for updates every 5 seconds so changes in admin panel reflect immediately
  useEffect(() => {
    const interval = setInterval(() => {
      setData(getStoredData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getThemeClass = (theme: ThemeType) => {
      switch(theme) {
          case 'blue': return 'bg-blue-950';
          case 'red': return 'bg-red-950';
          case 'green': return 'bg-green-950';
          case 'black': return 'bg-zinc-950';
          case 'slate':
          default: return 'bg-slate-900';
      }
  };

  const themeClass = getThemeClass(data.theme);

  return (
    <div className={`w-screen h-screen ${themeClass} overflow-hidden flex flex-col relative font-inter transition-colors duration-1000`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Visible Admin Link */}
      <Link 
        to="/admin" 
        className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/20 hover:bg-black/40 text-white/50 hover:text-white px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300 group"
        title="Yönetim Paneli"
      >
        <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap">Yönetim</span>
      </Link>

      {/* School Header */}
      <header className="w-full text-center py-3 z-20 bg-white/5 backdrop-blur-sm border-b border-white/5 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" style={{textShadow: '0 4px 10px rgba(0,0,0,0.5)'}}>
              {data.schoolName || 'ATATÜRK ANADOLU LİSESİ'}
          </h1>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 pb-2 flex gap-6 overflow-hidden z-10 min-h-0">
        
        {/* Left Column: Large Visuals (60%) */}
        <div className="flex-[3] flex flex-col gap-6 h-full">
           <PhotoSlider photos={data.photos} />
        </div>

        {/* Right Column: Info Widgets (40%) */}
        <div className="flex-[2] flex flex-col gap-4 h-full min-h-0">
          {/* Top: Clock & Weather Row */}
          <div className="h-36 flex gap-4 shrink-0">
             <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md overflow-hidden">
                <Clock />
             </div>
             <div className="flex-1">
                <WeatherWidget weather={data.weather} />
             </div>
          </div>

          {/* Middle: Duty Sections (Split Row) */}
          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
             <div className="flex-1 h-full">
                <DutyTeachers teachers={data.teachers} />
             </div>
             <div className="flex-1 h-full">
                <DutyStudents students={data.dutyStudents} />
             </div>
          </div>

          {/* Bottom: AI Widget */}
          <div className="h-auto shrink-0">
            <AiWidget content={data.aiContent} />
          </div>
        </div>
      </div>

      {/* Footer: Ticker */}
      <div className="h-14 shrink-0 bg-yellow-500 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex items-center relative overflow-hidden">
        <div className="bg-yellow-600 h-full px-6 flex items-center z-10 font-black text-yellow-950 uppercase tracking-widest shadow-lg whitespace-nowrap">
            📢 Duyurular
        </div>
        <div className="ticker-wrap flex-1 flex items-center">
            <div className="ticker text-2xl font-bold text-yellow-900">
                {data.announcements.map((a, i) => (
                    <span key={a.id} className="mx-12 inline-block">
                        <span className="mr-2 text-yellow-700">●</span> 
                        <span className="font-black">{a.title}:</span> {a.content}
                    </span>
                ))}
                 {/* Duplicate for seamless loop if few items */}
                 {data.announcements.map((a, i) => (
                    <span key={a.id + '_dup'} className="mx-12 inline-block">
                        <span className="mr-2 text-yellow-700">●</span> 
                        <span className="font-black">{a.title}:</span> {a.content}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
