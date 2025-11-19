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
import QrWidget from '../components/QrWidget';
import WidgetCard from '../components/WidgetCard';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AppData>(getStoredData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getStoredData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getThemeColors = (theme: ThemeType) => {
      switch(theme) {
          case 'blue': return 'from-blue-950 to-slate-950';
          case 'red': return 'from-red-950 to-slate-950';
          case 'green': return 'from-green-950 to-slate-950';
          case 'black': return 'from-zinc-950 to-black';
          case 'slate':
          default: return 'from-slate-900 to-slate-950';
      }
  };

  return (
    <div className={`w-screen h-screen bg-gradient-to-br ${getThemeColors(data.theme)} overflow-hidden flex flex-col relative font-inter text-white selection:bg-blue-500/30`}>
      
      {/* Background Ambient Noise/Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Admin Link */}
      <Link to="/admin" className="absolute top-6 right-6 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20">
            <Settings size={20} className="text-white/70" />
        </div>
      </Link>

      {/* Header */}
      <header className="px-8 py-5 z-10 flex justify-between items-end shrink-0">
          <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
              >
                {data.schoolName}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-1 w-24 bg-blue-500 mt-2 rounded-full"
              />
          </div>
          <div className="text-right hidden md:block">
             <div className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Dijital Bilgilendirme Panosu</div>
          </div>
      </header>

      {/* BENTO GRID LAYOUT */}
      <main className="flex-1 p-8 pt-2 min-h-0 z-10">
        <div className="grid grid-cols-4 grid-rows-3 gap-6 h-full w-full">
            
            {/* 1. MAIN VISUAL (2x2) */}
            <WidgetCard className="col-span-2 row-span-2 bg-black/40 !p-0" delay={0.1}>
                <PhotoSlider photos={data.photos} />
            </WidgetCard>

            {/* 2. CLOCK (1x1) */}
            <WidgetCard className="col-span-1 row-span-1" delay={0.2}>
                <Clock />
            </WidgetCard>

            {/* 3. WEATHER (1x1) */}
            <WidgetCard className="col-span-1 row-span-1" delay={0.3}>
                <WeatherWidget weather={data.weather} />
            </WidgetCard>

            {/* 4. TEACHERS (1x2 Vertical) */}
            <WidgetCard title="Nöbetçi Öğretmenler" className="col-span-1 row-span-2" delay={0.4}>
                <DutyTeachers teachers={data.teachers} />
            </WidgetCard>

            {/* 5. STUDENTS (1x1) */}
            <WidgetCard title="Nöbetçi Öğrenciler" className="col-span-1 row-span-1" delay={0.5}>
                <DutyStudents students={data.dutyStudents} />
            </WidgetCard>
            
             {/* 6. AI CONTENT (2x1 Wide) */}
             <WidgetCard className="col-span-2 row-span-1" delay={0.6}>
                <AiWidget content={data.aiContent} />
            </WidgetCard>

            {/* 7. QR WIDGET (1x1) */}
            <WidgetCard className="col-span-1 row-span-1 !bg-white !p-0" delay={0.7}>
                <QrWidget />
            </WidgetCard>

        </div>
      </main>

      {/* Footer Ticker */}
      <div className="h-16 shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/10 z-20 flex items-center">
         <div className="bg-blue-600 h-full px-8 flex items-center font-black text-white uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] z-10">
            Duyurular
         </div>
         <div className="ticker-wrap flex-1 relative">
            <div className="ticker text-2xl font-medium text-white/90">
                {data.announcements.length > 0 ? data.announcements.map((a) => (
                    <span key={a.id} className="mx-16 inline-flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="font-bold text-blue-200">{a.title}:</span> 
                        <span>{a.content}</span>
                    </span>
                )) : <span className="mx-10">Henüz duyuru eklenmedi.</span>}
                 {/* Duplicates for smooth loop */}
                 {data.announcements.length > 0 && data.announcements.map((a) => (
                    <span key={a.id + '_dup'} className="mx-16 inline-flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="font-bold text-blue-200">{a.title}:</span> 
                        <span>{a.content}</span>
                    </span>
                ))}
            </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;