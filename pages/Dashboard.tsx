import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData } from '../services/storage';
import { AppData } from '../types';
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

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden flex flex-col relative font-inter">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Secret Admin Link using React Router Link */}
      <Link to="/admin" className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity z-50 text-white/20 hover:text-white">
        <Settings size={24} />
      </Link>

      {/* Main Content Area */}
      <div className="flex-1 p-6 pb-2 flex gap-6 overflow-hidden z-10">
        
        {/* Left Column: Large Visuals (60%) */}
        <div className="flex-[3] flex flex-col gap-6 h-full">
           <PhotoSlider photos={data.photos} />
        </div>

        {/* Right Column: Info Widgets (40%) */}
        <div className="flex-[2] flex flex-col gap-4 h-full">
          {/* Top: Clock & Weather Row */}
          <div className="h-40 flex gap-4">
             <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg border border-white/10">
                <Clock />
             </div>
             <div className="flex-1">
                <WeatherWidget weather={data.weather} />
             </div>
          </div>

          {/* Middle: Duty Sections (Split Row) */}
          <div className="flex-1 flex gap-4 min-h-0">
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
      <div className="h-16 bg-yellow-500 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex items-center relative overflow-hidden">
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