import React, { useState, useEffect } from 'react';
import { SlidePhoto } from '../types';

interface PhotoSliderProps {
  photos: SlidePhoto[];
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-3xl border border-slate-700 text-slate-500">
            Görsel Yok
        </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl border border-white/10 group">
      {/* Background Image with Blur for fill */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110 transition-all duration-1000"
        style={{ backgroundImage: `url(${currentPhoto.url})` }}
      />
      
      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <img 
            src={currentPhoto.url} 
            alt="Slide" 
            className="max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-700 ease-in-out transform scale-100"
        />
      </div>

      {/* Caption */}
      {currentPhoto.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 pt-24">
            <h3 className="text-white text-3xl font-bold drop-shadow-md translate-y-0 transition-transform duration-500">
                {currentPhoto.caption}
            </h3>
        </div>
      )}
      
      {/* Indicators */}
      <div className="absolute top-4 right-4 flex gap-2">
          {photos.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
              />
          ))}
      </div>
    </div>
  );
};

export default PhotoSlider;