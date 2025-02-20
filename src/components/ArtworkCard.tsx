
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Artwork {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group w-full h-full cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 bg-card"
      onClick={onClick}
    >
      <div className="relative h-full">
        <div 
          className={`absolute inset-0 bg-muted transition-opacity duration-500 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} 
        />
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xl font-semibold mb-1">{artwork.title}</h3>
            <p className="text-sm opacity-75 line-clamp-2">{artwork.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
