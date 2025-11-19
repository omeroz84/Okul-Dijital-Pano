import React, { useState, useEffect } from 'react';
import { SlidePhoto } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoSliderProps {
  photos: SlidePhoto[];
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
            <span className="text-sm font-medium uppercase tracking-widest">Görsel Yok</span>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode='wait'>
        <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
        >
             {/* Background Blur for fit */}
            <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40"
                style={{ backgroundImage: `url(${photos[currentIndex].url})` }}
            />
            
            {/* Main Image */}
            <div className="absolute inset-0 flex items-center justify-center">
                <img 
                    src={photos[currentIndex].url} 
                    alt="Slide" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

            {/* Caption */}
            {photos[currentIndex].caption && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-8 left-8 right-8 max-w-3xl"
                >
                    <h3 className="text-white text-4xl font-black tracking-tight drop-shadow-lg leading-tight">
                        {photos[currentIndex].caption}
                    </h3>
                </motion.div>
            )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
          {photos.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
              />
          ))}
      </div>
    </div>
  );
};

export default PhotoSlider;