
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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

const ArtworkCard = ({ artwork, onClick, isLoading: isImageLoading }) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="group relative bg-[#15161a] dark:bg-[#15161a] rounded-lg overflow-hidden shadow-lg border border-gray-700/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        <img 
          src={artwork.thumbnail} 
          alt={artwork.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* View Details Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className="bg-[hsl(var(--gallery-accent))] hover:bg-[hsl(var(--gallery-accent))]/90 text-white border-0"
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('artwork.detail')}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--gallery-accent))] group-hover:text-[hsl(var(--gallery-accent))] transition-colors duration-300 mb-2">
          {artwork.title}
        </h3>
        {artwork.description && (
          <p className="text-sm text-gray-300 leading-relaxed">
            {truncateText(artwork.description)}
          </p>
        )}
      </div>
    </div>
  );
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

  // Show placeholder cards while loading initial data
  if (isLoading && !artworks.length) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-[#15161a] rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
              <div className="aspect-[4/3] bg-gray-800 animate-pulse flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
              <div className="p-4">
                <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
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
          <ArtworkCard
            key={artwork.post_id}
            artwork={artwork}
            onClick={() => handleArtworkClick(artwork.post_id)}
            isLoading={false}
          />
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
