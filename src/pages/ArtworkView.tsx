
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const rect = elem.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMagnifierPosition({ x, y });
  };

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Λεπτομέρεια</SheetTitle>
        <SheetDescription>
          {artwork.hotspots.find(h => h.id === activeHotspot)?.description}
        </SheetDescription>
      </SheetHeader>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <ModeToggle />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1">
            <div className="relative w-full aspect-[4/3] bg-accent rounded-lg overflow-hidden">
              <div
                className="relative w-full h-full touch-none"
                onPointerMove={handlePointerMove}
                onPointerEnter={() => setShowMagnifier(true)}
                onPointerLeave={() => {
                  setShowMagnifier(false);
                  setIsOverHotspot(false);
                }}
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  draggable={false}
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
                        draggable={false}
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
                    onPointerEnter={() => {
                      setIsOverHotspot(true);
                      setActiveHotspot(hotspot.id);
                    }}
                    onPointerLeave={() => {
                      if (!activeHotspot) {
                        setIsOverHotspot(false);
                      }
                    }}
                    onClick={() => {
                      setIsOverHotspot(true);
                      setActiveHotspot(hotspot.id);
                    }}
                  >
                    <Hand className="w-6 h-6 text-white drop-shadow-lg" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isMobile ? (
            <Sheet 
              open={!!activeHotspot} 
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setActiveHotspot(null);
                  setIsOverHotspot(false);
                }
              }}
            >
              <SheetContent 
                side="left" 
                onPointerEnter={() => setIsOverHotspot(true)}
                onPointerLeave={() => {
                  if (!activeHotspot) {
                    setIsOverHotspot(false);
                  }
                }}
              >
                <SidebarContent />
              </SheetContent>
            </Sheet>
          ) : (
            activeHotspot && (
              <div className="w-80 h-[calc(100vh-12rem)] bg-card rounded-lg p-6 overflow-y-auto border">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Λεπτομέρεια</h3>
                  <p className="text-sm text-muted-foreground">
                    {artwork.hotspots.find(h => h.id === activeHotspot)?.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkView;
