
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Loader } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import artworksData from '../data/artworks.json';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export const ArtGallery = () => {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<typeof artworksData.artworks>([]);

  useEffect(() => {
    // Προσομοίωση φόρτωσης
    setTimeout(() => {
      setArtworks(artworksData.artworks);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto gap-4"
      columnClassName="space-y-4 px-2"
    >
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </Masonry>
  );
};

export default ArtGallery;
