import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const dayString = date.toLocaleDateString('tr-TR', { weekday: 'long' });
  const fullDateString = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-6 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[50px] rounded-full"></div>

      <div className="relative z-10 text-center">
        <div className="text-[5rem] leading-none font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 drop-shadow-2xl">
            {timeString}
        </div>
        <div className="mt-2">
            <div className="text-2xl font-bold text-blue-200">{dayString}</div>
            <div className="text-sm font-medium text-white/50 uppercase tracking-widest mt-1">{fullDateString}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;