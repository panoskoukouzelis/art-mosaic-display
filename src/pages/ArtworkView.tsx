
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hand, ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ZOOM_LEVEL = 3;
const MAGNIFIER_SIZE = 160;
const BASE_API_URL = 'https://staging.pedpelop.gr/wp-json/hotspot/v1/get_hotspot';

const fetchArtworkById = async (id: number) => {
  const response = await fetch(`${BASE_API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }

  return response.json();
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");

const isYouTubeLink = (url: string) => {
  const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return ytRegex.test(url);
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";
  
  // Αν είναι μόνο το ID, επιστρέφουμε απευθείας το embed link
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}`;
  }

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};


const ArtworkView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<any>(null);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isOverHotspot, setIsOverHotspot] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const rect = elem.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMagnifierPosition({ 
      x: Math.min(Math.max(x, MAGNIFIER_SIZE/2/rect.width*100), 100 - MAGNIFIER_SIZE/2/rect.width*100),
      y: Math.min(Math.max(y, MAGNIFIER_SIZE/2/rect.height*100), 100 - MAGNIFIER_SIZE/2/rect.height*100)
    });
  };

  const HotspotContent = ({ hotspotData }) => {
    if (!hotspotData) return null;

    return (
      <div className="h-full overflow-y-auto space-y-4">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">
            {hotspotData.bwdihp_hotspot_title || t('artwork.detail')}
          </h2>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveHotspot(null)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* YouTube Video */}
        {hotspotData.bwdihp_tooltip_video_show === "yes" && hotspotData.bwdihp_youtube_link && (
          <div className="aspect-video rounded-lg overflow-hidden border mb-4">
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(hotspotData.bwdihp_youtube_link)}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        )}

        {/* Εικόνα με link αν υπάρχει */}
        {hotspotData.bwdihp_tooltip_image_show === "yes" && hotspotData.bwdihp_tooltip_image?.url && (
          <div className="mt-4 mb-4">
            <a
              href={hotspotData.bwdihp_tooltip_image_link?.url || "#"}
              target={hotspotData.bwdihp_tooltip_image_link?.is_external ? "_blank" : "_self"}
              rel={hotspotData.bwdihp_tooltip_image_link?.nofollow ? "nofollow" : ""}
            >
              <img
                src={hotspotData.bwdihp_tooltip_image.url}
                alt={hotspotData.bwdihp_tooltip_image.alt || "Hotspot Image"}
                className="w-full rounded-lg border"
              />
            </a>
          </div>
        )}

        {/* Περιεχόμενο με HTML */}
        <div className="text-sm text-muted-foreground">
          <div dangerouslySetInnerHTML={{ __html: hotspotData.bwdihp_tooltip_content }} />
        </div>
      </div>
    );
  };

  const SidebarContent = () => {
    const activeHotspotData = artwork.hotspots.find(h => h._id === activeHotspot);
    
    if (!activeHotspotData) return null;

    return (
      <>
        {isMobile ? (
          <div className="h-full overflow-y-auto space-y-4">
            <SheetHeader>
              <SheetTitle>{activeHotspotData.bwdihp_hotspot_title || 'Λεπτομέρεια'}</SheetTitle>
            </SheetHeader>

            {/* YouTube Video */}
            {activeHotspotData.bwdihp_tooltip_video_show === "yes" && activeHotspotData.bwdihp_youtube_link && (
              <div className="aspect-video rounded-lg overflow-hidden border mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(activeHotspotData.bwdihp_youtube_link)}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            )}

            {/* Εικόνα με link αν υπάρχει */}
            {activeHotspotData.bwdihp_tooltip_image_show === "yes" && activeHotspotData.bwdihp_tooltip_image?.url && (
              <div className="mt-4 mb-4">
                <a
                  href={activeHotspotData.bwdihp_tooltip_image_link?.url || "#"}
                  target={activeHotspotData.bwdihp_tooltip_image_link?.is_external ? "_blank" : "_self"}
                  rel={activeHotspotData.bwdihp_tooltip_image_link?.nofollow ? "nofollow" : ""}
                >
                  <img
                    src={activeHotspotData.bwdihp_tooltip_image.url}
                    alt={activeHotspotData.bwdihp_tooltip_image.alt || "Hotspot Image"}
                    className="w-full rounded-lg border"
                  />
                </a>
              </div>
            )}

            {/* Περιεχόμενο με HTML */}
            <SheetDescription>
              <div dangerouslySetInnerHTML={{ __html: activeHotspotData.bwdihp_tooltip_content }} />
            </SheetDescription>
          </div>
        ) : (
          <HotspotContent hotspotData={activeHotspotData} />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center gap-2 mb-8">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('gallery.title')}
          </Button>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>
        
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
                  src={artwork.feature_image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {showMagnifier && !isOverHotspot && (
                  <div
                    className="absolute w-40 h-40 pointer-events-none border-2 border-white/50 rounded-full overflow-hidden"
                    style={{
                      left: `calc(${magnifierPosition.x}% - ${MAGNIFIER_SIZE/2}px)`,
                      top: `calc(${magnifierPosition.y}% - ${MAGNIFIER_SIZE/2}px)`,
                    }}
                  >
                    <div
                      className="absolute"
                      style={{
                        width: `${ZOOM_LEVEL * 100}%`,
                        height: `${ZOOM_LEVEL * 100}%`,
                        left: `${-magnifierPosition.x * ZOOM_LEVEL + 50}%`,
                        top: `${-magnifierPosition.y * ZOOM_LEVEL + 50}%`,
                      }}
                    >
                      <img
                        src={artwork.feature_image}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>
                )}

                {artwork.hotspots.map((hotspot) => (
                  <TooltipProvider key={hotspot._id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "absolute -ml-4 -mt-4 w-8 h-8 flex items-center justify-center",
                            "hover:scale-110 transition-transform"
                          )}
                          style={{ 
                            left: `${hotspot.bwdihp_hotspot_left_position.size}%`, 
                            top: `${hotspot.bwdihp_hotspot_top_position.size}%` 
                          }}
                          onClick={() => {
                            setIsOverHotspot(true);
                            setActiveHotspot(hotspot._id);
                          }}
                        >
                          <Hand className="w-6 h-6 text-white drop-shadow-lg" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('artwork.open')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>

          {isMobile ? (
            <Sheet 
              open={!!activeHotspot} 
              onOpenChange={(isOpen) => { 
                if (!isOpen) setActiveHotspot(null); 
              }}
            >
              <SheetContent side="left" className="w-[350px] sm:w-[450px] max-w-full">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          ) : (
            activeHotspot && (
              <div className="w-[350px] lg:w-[450px] h-[calc(100vh-12rem)] bg-card rounded-lg p-6 overflow-y-auto border">
                <SidebarContent />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkView;
