
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Loader2 } from 'lucide-react';
import { fetchArtworkById } from '@/services/artworkService';
import { ArtworkImage } from '@/components/artwork/ArtworkImage';
import { ArtworkDetail } from '@/components/artwork/ArtworkDetail';
import { MobileDetailSheet } from '@/components/artwork/MobileDetailSheet';

const ArtworkView = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<any>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchArtwork = async () => {
      if (id) {
        try {
          const data = await fetchArtworkById(Number(id));
          console.log("Fetched Artwork Data:", data);
          setArtwork(data);
        } catch (error) {
          console.error('Artwork not found:', error);
        }
      }
    };

    fetchArtwork();
  }, [id]);

  if (!artwork) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const activeHotspotData = activeHotspot 
    ? artwork.hotspots.find(h => h._id === activeHotspot) 
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end items-center space-x-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1">
            <ArtworkImage 
              imageUrl={artwork.feature_image}
              hotspots={artwork.hotspots}
              onHotspotClick={setActiveHotspot}
            />
          </div>

          {isMobile ? (
            <MobileDetailSheet 
              isOpen={!!activeHotspot}
              onClose={() => setActiveHotspot(null)}
              hotspot={activeHotspotData}
            />
          ) : (
            activeHotspot && (
              <div className="w-80 h-[calc(100vh-12rem)] bg-card rounded-lg p-6 overflow-y-auto border">
                {activeHotspotData && (
                  <ArtworkDetail 
                    content={activeHotspotData.bwdihp_tooltip_content}
                    link={activeHotspotData.bwdihp_tooltip_image_link}
                    buttonText={activeHotspotData.bwdihp_tooltip_btn}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkView;
