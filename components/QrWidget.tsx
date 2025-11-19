import React from 'react';
import { QrCode } from 'lucide-react';

const QrWidget: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-white text-slate-900 relative overflow-hidden group">
      {/* Decorative circles */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-2xl"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-2xl"></div>

      <div className="relative z-10 bg-white p-3 rounded-xl shadow-lg border border-slate-100">
        {/* Placeholder QR Code - In a real app, use a QR library */}
        <QrCode size={96} className="text-slate-900" strokeWidth={1.5} />
      </div>
      
      <div className="mt-4 text-center z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Bizi Takip Edin</p>
        <p className="font-bold text-slate-800">websitemiz.com</p>
      </div>
    </div>
  );
};

export default QrWidget;