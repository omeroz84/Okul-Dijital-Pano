import React from 'react';
import { motion } from 'framer-motion';

interface WidgetCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
  delay?: number;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ children, title, className = '', icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative group hover:bg-white/10 transition-colors duration-500 ${className}`}
    >
      {(title || icon) && (
        <div className="px-6 pt-5 pb-2 flex items-center gap-2 z-10">
            {icon && <span className="text-white/60 group-hover:text-white/90 transition-colors">{icon}</span>}
            {title && <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white/80 transition-colors">{title}</h3>}
        </div>
      )}
      <div className="flex-1 relative z-0">
        {children}
      </div>
    </motion.div>
  );
};

export default WidgetCard;