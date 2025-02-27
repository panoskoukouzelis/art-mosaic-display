
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import ArtworkCard from './ArtworkCard';

const BASE_API_URL = 'https://staging.pedpelop.gr/wp-json/hotspot/v1/get_all_hotspots';

const fetchArtworksPage = async (page) => {
  const response = await fetch(`${BASE_API_URL}/?page=${page}`, {
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

const ArtGallery = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworks, setArtworks] = useState([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['artworks', currentPage],
    queryFn: () => fetchArtworksPage(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData
  });

  useEffect(() => {
    if (data) {
      setArtworks((prev) => {
        const newArtworks = data.data.filter(
          (newArtwork) => !prev.some((existing) => existing.post_id === newArtwork.post_id)
        );
        return [...prev, ...newArtworks];
      });
    }
  }, [data]);

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  const handleNextPage = () => {
    if (data && currentPage < data.total_pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading && !artworks.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('gallery.noArtworks')}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <div key={artwork.post_id} className="flex justify-center">
            <div 
              className="relative p-4 rounded-lg shadow-lg border border-gray-300 cursor-pointer transition duration-300 dark:bg-gray-800 bg-white" 
              onClick={() => handleArtworkClick(artwork.post_id)}
            >
              <img src={artwork.thumbnail} alt={artwork.title} className="w-full h-auto object-cover rounded-sm shadow-md" />
              <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">{artwork.title}</p>
            </div>
          </div>
        ))}
      </div>

      {data && currentPage < data.total_pages && (
        <div className="flex justify-center mt-12">
          {isFetching ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Button
              onClick={handleNextPage}
              className="group relative overflow-hidden"
              size="lg"
              variant="default"
            >
              <span className="relative flex items-center gap-2">
                {t('gallery.nextPage')}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 w-3/12 bg-white/20 skew-x-[45deg] group-hover:w-full transition-all duration-500 -translate-x-full group-hover:translate-x-full" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
