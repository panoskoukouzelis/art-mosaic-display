import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL;

const fetchAllArtworks = async () => {
  const allArtworks = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await axios.get(`${BASE_API_URL}/?page=${currentPage}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    allArtworks.push(...data.data);
    totalPages = data.total_pages;
    currentPage++;
  }

  return allArtworks;
};

const ArtworkCard = ({ artwork, onClick }) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
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
        <h3 className="text-lg font-semibold text-white group-hover:text-[hsl(var(--gallery-accent))] transition-colors duration-300 mb-2">
          {artwork.title}
        </h3>
        {artwork.content && (
          <p className="text-sm text-gray-300 leading-relaxed">
            {truncateText(artwork.content)}
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

  const { data: artworks, isLoading } = useQuery({
    queryKey: ['allArtworks'],
    queryFn: fetchAllArtworks,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-[#15161a] rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
              <div className="aspect-[4/3] bg-gray-800 animate-pulse"></div>
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

  if (!artworks || artworks.length === 0) {
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
          />
        ))}
      </div>
    </div>
  );
};

export default ArtGallery;