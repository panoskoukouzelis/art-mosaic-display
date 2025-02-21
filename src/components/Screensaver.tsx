
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import artworksData from '../data/artworks.json';

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
    <div className="fixed inset-0 bg-neutral-900 z-50">
      <div 
        className="embla h-full w-full" 
        ref={emblaRef}
      >
        <div className="embla__container h-full flex items-center">
          {artworksData.artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="embla__slide relative min-w-full h-full"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-contain"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-2xl font-semibold text-white mb-2">{artwork.title}</h2>
                <p className="text-sm text-white/80">{artwork.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screensaver;
