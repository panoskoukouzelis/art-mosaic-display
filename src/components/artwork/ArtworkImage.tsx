
import React, { useState } from 'react';
import { HotspotButton } from './HotspotButton';
import { Magnifier } from './Magnifier';

interface Hotspot {
  _id: string;
  bwdihp_hotspot_left_position: { size: string };
  bwdihp_hotspot_top_position: { size: string };
  [key: string]: any;
}

interface ArtworkImageProps {
  imageUrl: string;
  hotspots: Hotspot[];
  onHotspotClick: (id: string) => void;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  imageUrl,
  hotspots,
  onHotspotClick
}) => {
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [isOverHotspot, setIsOverHotspot] = useState(false);
  
  const ZOOM_LEVEL = 3;
  const MAGNIFIER_SIZE = 160;

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

  const handleHotspotEnter = (id: string) => {
    setIsOverHotspot(true);
    onHotspotClick(id);
  };

  const handleHotspotLeave = () => {
    setIsOverHotspot(false);
  };

  return (
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
          src={imageUrl}
          alt="Artwork"
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {showMagnifier && !isOverHotspot && (
          <Magnifier 
            position={magnifierPosition}
            zoomLevel={ZOOM_LEVEL}
            size={MAGNIFIER_SIZE}
            imageSrc={imageUrl}
          />
        )}

        {hotspots.map((hotspot) => (
          <HotspotButton
            key={hotspot._id}
            id={hotspot._id}
            left={hotspot.bwdihp_hotspot_left_position.size}
            top={hotspot.bwdihp_hotspot_top_position.size}
            onHotspotEnter={handleHotspotEnter}
            onHotspotLeave={handleHotspotLeave}
            onClick={onHotspotClick}
          />
        ))}
      </div>
    </div>
  );
};
