
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import artworksData from '../data/artworks.json';
import { cn } from '@/lib/utils';

const Screensaver = ({ onInteraction }: { onInteraction: () => void }) => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  });

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
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container h-full flex items-center">
          {artworksData.artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className={cn(
                "embla__slide relative flex-[0_0_70%] min-w-0 h-[80vh] mx-4",
                "transform perspective-1000 rotate-y-[-20deg] scale-90",
                "transition-transform duration-500"
              )}
              style={{
                transform: `perspective(1000px) rotateY(-20deg) scale(0.9)`,
              }}
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-xl">
                <h2 className="text-2xl font-semibold">{artwork.title}</h2>
                <p className="text-sm opacity-80">{artwork.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screensaver;
