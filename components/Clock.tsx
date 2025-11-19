import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatters
  const timeString = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4">
      <div className="text-7xl font-bold tracking-tight drop-shadow-lg">{timeString}</div>
      <div className="text-xl mt-2 font-light text-blue-100 opacity-90">{dateString}</div>
    </div>
  );
};

export default Clock;