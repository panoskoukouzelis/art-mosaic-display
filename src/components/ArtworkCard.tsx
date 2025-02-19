
import { useState } from 'react';
import { motion } from 'framer-motion';
import Hotspot from './Hotspot';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  hotspots: Array<{
    id: string;
    x: number;
    y: number;
    description: string;
  }>;
}

interface Props {
  artwork: Artwork;
  onClick: () => void;
  selected: boolean;
}

const ArtworkCard = ({ artwork, onClick, selected }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group cursor-pointer rounded-lg overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setShowHotspots(true)}
      onMouseLeave={() => setShowHotspots(false)}
    >
      <div className="relative">
        <div 
          className={`absolute inset-0 bg-muted transition-opacity duration-500 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} 
        />
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
        {showHotspots && artwork.hotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            x={hotspot.x}
            y={hotspot.y}
            description={hotspot.description}
          />
        ))}
        <div 
          className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <h3 className="text-lg font-medium text-white mb-1">{artwork.title}</h3>
          <p className="text-sm text-white/80">{artwork.artist}, {artwork.year}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
