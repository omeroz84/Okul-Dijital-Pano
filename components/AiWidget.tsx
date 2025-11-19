import React from 'react';
import { AiContent } from '../types';
import { Sparkles, Quote, Lightbulb, Info } from 'lucide-react';

interface AiWidgetProps {
  content: AiContent | null;
}

const AiWidget: React.FC<AiWidgetProps> = ({ content }) => {
  if (!content) return null;

  const getIcon = () => {
    switch (content.type) {
      case 'quote': return <Quote className="w-6 h-6 text-purple-300" />;
      case 'fact': return <Lightbulb className="w-6 h-6 text-yellow-300" />;
      default: return <Info className="w-6 h-6 text-blue-300" />;
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex flex-col justify-center min-h-[180px]">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-3 relative z-10">
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Yapay Zeka Köşesi</span>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
           {getIcon()}
           {content.title}
        </h3>
        <p className="text-indigo-100 text-lg leading-relaxed italic font-medium">
          "{content.content}"
        </p>
      </div>
    </div>
  );
};

export default AiWidget;