
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkCard from './ArtworkCard';
import artworksData from '../data/artworks.json';
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 4,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1
};

const ArtGallery = () => {
  const navigate = useNavigate();
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  // Υπολογισμός διαφορετικών μεγεθών για τις εικόνες
  const artworksWithSizes = artworksData.artworks.map((artwork, index) => {
    const sizes = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]'];
    const sizeIndex = index % sizes.length;
    return {
      ...artwork,
      aspectClass: sizes[sizeIndex]
    };
  });

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4 md:-ml-6 lg:-ml-8"
      columnClassName="pl-4 md:pl-6 lg:pl-8 bg-clip-padding"
    >
      {artworksWithSizes.map((artwork) => (
        <div 
          key={artwork.id} 
          className={`mb-4 md:mb-6 lg:mb-8 ${artwork.aspectClass}`}
        >
          <ArtworkCard
            artwork={artwork}
            onClick={() => handleArtworkClick(artwork.id)}
            selected={selectedArtwork === artwork.id}
          />
        </div>
      ))}
    </Masonry>
  );
};

export default ArtGallery;
