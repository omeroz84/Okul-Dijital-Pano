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
      case 'quote': return <Quote className="w-8 h-8 text-purple-300 opacity-50 absolute top-4 right-4" />;
      case 'fact': return <Lightbulb className="w-8 h-8 text-yellow-300 opacity-50 absolute top-4 right-4" />;
      default: return <Info className="w-8 h-8 text-blue-300 opacity-50 absolute top-4 right-4" />;
    }
  };

  return (
    <div className="relative h-full p-6 flex flex-col justify-center overflow-hidden group">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors duration-700"></div>

      {getIcon()}
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Günün İçeriği</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
           {content.title}
        </h3>
        <p className="text-indigo-100/90 text-base font-medium leading-relaxed line-clamp-3">
          "{content.content}"
        </p>
      </div>
    </div>
  );
};

export default AiWidget;