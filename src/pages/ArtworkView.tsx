
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ModeToggle } from '@/components/mode-toggle';
import artworksData from '../data/artworks.json';

const ArtworkView = () => {
  const { id } = useParams();
  const artwork = artworksData.artworks.find(a => a.id === Number(id));
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isOverHotspot, setIsOverHotspot] = useState(false);

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const rect = elem.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMagnifierPosition({ x, y });
  };

  const isHotspotArea = (x: number, y: number) => {
    return artwork.hotspots.some(hotspot => {
      const dx = hotspot.x - x;
      const dy = hotspot.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 5;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ModeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full max-w-6xl mx-auto aspect-[4/3] bg-accent rounded-lg overflow-hidden">
          <div
            className="relative w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseLeave={() => setShowMagnifier(false)}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
            
            {showMagnifier && !isOverHotspot && (
              <div
                className="absolute w-32 h-32 pointer-events-none border-2 border-white/50 rounded-full overflow-hidden"
                style={{
                  left: `calc(${magnifierPosition.x}% - 64px)`,
                  top: `calc(${magnifierPosition.y}% - 64px)`,
                }}
              >
                <div
                  className="absolute w-[400%] h-[400%]"
                  style={{
                    left: `${-magnifierPosition.x * 4 + 200}%`,
                    top: `${-magnifierPosition.y * 4 + 200}%`,
                  }}
                >
                  <img
                    src={artwork.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {artwork.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className={cn(
                  "absolute -ml-4 -mt-4 w-8 h-8 flex items-center justify-center",
                  "hover:scale-110 transition-transform"
                )}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onMouseEnter={() => {
                  setIsOverHotspot(true);
                  setActiveHotspot(hotspot.id);
                }}
                onMouseLeave={() => {
                  setIsOverHotspot(false);
                  setActiveHotspot(null);
                }}
                onClick={() => setActiveHotspot(hotspot.id)}
              >
                <Hand className="w-6 h-6 text-white drop-shadow-lg" />
              </button>
            ))}
          </div>
        </div>

        <Sheet open={!!activeHotspot} onOpenChange={() => setActiveHotspot(null)}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Λεπτομέρεια</SheetTitle>
              <SheetDescription>
                {artwork.hotspots.find(h => h.id === activeHotspot)?.description}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ArtworkView;
