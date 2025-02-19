
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import artworksData from '../data/artworks.json';
import { cn } from '@/lib/utils';

const AUTOPLAY_INTERVAL = 3000;

const Screensaver = ({ onInteraction }: { onInteraction: () => void }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    startIndex: 1
  });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    
    const autoplayTimer = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(autoplayTimer);
  }, [emblaApi]);

  useEffect(() => {
    const cleanup = autoplay();
    return () => {
      if (cleanup) cleanup();
    };
  }, [autoplay]);

  useEffect(() => {
    const handleInteraction = () => {
      onInteraction();
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [onInteraction]);

  return (
    <div className="fixed inset-0 bg-neutral-900 z-50 overflow-hidden">
      <div 
        className="embla h-full w-full" 
        ref={emblaRef}
      >
        <div 
          className="embla__container h-full flex items-center"
          style={{
            perspective: '1000px',
            transform: 'translateY(-5%) rotateX(10deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {artworksData.artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="embla__slide relative min-w-0 h-[80vh]"
              style={{
                transform: `rotateY(45deg) translateZ(-200px)`,
                transformStyle: 'preserve-3d',
                margin: '0 -100px'
              }}
            >
              <div 
                className="relative w-full h-full"
                style={{
                  transform: 'rotateY(-45deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  style={{
                    boxShadow: '0 0 100px rgba(0,0,0,0.5)',
                  }}
                  draggable={false}
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8))',
                    transform: 'translateZ(1px)'
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  style={{
                    transform: 'translateZ(2px)'
                  }}
                >
                  <h2 className="text-2xl font-semibold mb-2">{artwork.title}</h2>
                  <p className="text-sm opacity-80">{artwork.artist}</p>
                </div>
                <div 
                  className="absolute inset-0"
                  style={{
                    transform: 'translateZ(-1000px) scale(2)',
                    background: 'linear-gradient(45deg, #000 0%, #111 100%)',
                    filter: 'blur(2px)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screensaver;
