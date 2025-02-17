
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ChevronDown } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import artworksData from '../data/artworks.json';

const ITEMS_PER_PAGE = 9;

const breakpointColumns = {
  default: 3,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1
};

export const ArtGallery = () => {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<typeof artworksData.artworks>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Προσομοίωση φόρτωσης
    setTimeout(() => {
      setArtworks(artworksData.artworks);
      setLoading(false);
      setHasMore(artworksData.artworks.length > ITEMS_PER_PAGE);
    }, 1000);
  }, []);

  const paginatedArtworks = artworks.slice(0, currentPage * ITEMS_PER_PAGE);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setHasMore(nextPage * ITEMS_PER_PAGE < artworks.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-4 md:gap-6 lg:gap-8"
        columnClassName="space-y-4 md:space-y-6 lg:space-y-8 [&:first-child]:ml-0"
      >
        <AnimatePresence mode="popLayout">
          {paginatedArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Masonry>
      
      {hasMore && (
        <div className="flex justify-center pt-8 pb-16">
          <button
            onClick={loadMore}
            className="group flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>Περισσότερα έργα</span>
            <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ArtGallery;
