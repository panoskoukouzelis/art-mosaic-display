
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import artworksData from '../data/artworks.json';

const AUTOPLAY_INTERVAL = 3000;

const Screensaver = ({ onInteraction }: { onInteraction: () => void }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    startIndex: 1,
    slidesToScroll: 3,
    align: 'center',
    containScroll: 'trimSnaps'
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

  // Ομαδοποίηση των έργων τέχνης σε τριάδες
  const groupedArtworks = artworksData.artworks.reduce((groups, artwork, index) => {
    const groupIndex = Math.floor(index / 3);
    if (!groups[groupIndex]) {
      groups[groupIndex] = [];
    }
    groups[groupIndex].push(artwork);
    return groups;
  }, [] as typeof artworksData.artworks[]);

  return (
    <div className="fixed inset-0 bg-neutral-900 z-50">
      <div 
        className="embla h-full w-full" 
        ref={emblaRef}
      >
        <div className="embla__container h-full flex items-center">
          {groupedArtworks.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="embla__slide relative min-w-fit h-full flex items-center gap-4 p-4"
            >
              {group.map((artwork) => (
                <div 
                  key={artwork.id}
                  className="relative w-[400px] h-[600px] border-2 border-white/20 rounded-lg overflow-hidden"
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h2 className="text-xl font-semibold text-white mb-1">{artwork.title}</h2>
                    <p className="text-sm text-white/80">{artwork.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screensaver;
