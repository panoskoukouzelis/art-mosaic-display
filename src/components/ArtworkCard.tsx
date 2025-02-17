
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
}

const ArtworkCard = ({ artwork }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group rounded-lg overflow-hidden bg-white"
    >
      <div className="relative aspect-[3/4]">
        <div className={`absolute inset-0 bg-gray-100 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onMouseEnter={() => setShowHotspots(true)}
          onMouseLeave={() => setShowHotspots(false)}
        />
        {showHotspots && artwork.hotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            x={hotspot.x}
            y={hotspot.y}
            description={hotspot.description}
          />
        ))}
      </div>
      <div className="p-4 bg-white/90 backdrop-blur-sm">
        <h3 className="text-lg font-medium text-gray-900">{artwork.title}</h3>
        <p className="text-sm text-gray-600">{artwork.artist}, {artwork.year}</p>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
