
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtworkCard from './ArtworkCard';

interface APIResponse {
  data: Array<{
    post_id: number;
    title: string;
    feature_image: string;
    content: string;
    hotspots: Array<{
      id: string;
      x: number;
      y: number;
      description: string;
    }>;
  }>;
  current_page: number;
  total_pages: number;
}

const BASE_API_URL = 'http://20.86.33.156:8080/wordpress/wp-json/hotspot/v1/get_all_hotspots';

const ArtGallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
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

      const data: APIResponse = await response.json();
      console.log('API Response:', data);

      if (data && Array.isArray(data.data)) {
        const artworksFormatted = data.data.map((item) => ({
          id: item.post_id,
          title: item.title,
          imageUrl: item.feature_image,
          description: item.content,
          hotspots: item.hotspots,
          height: Math.floor(Math.random() * (500 - 300 + 1)) + 300
        }));

        setArtworks(artworksFormatted);
        setCurrentPage(data.current_page);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1);
  }, []);

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchArtworks(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-muted"></div>
            <div className="h-4 w-32 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && artworks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Δεν βρέθηκαν έργα τέχνης.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="break-inside-avoid mb-4"
            style={{ height: `${artwork.height}px` }}
          >
            <ArtworkCard
              artwork={artwork}
              onClick={() => handleArtworkClick(artwork.id)}
              selected={selectedArtwork === artwork.id}
            />
          </div>
        ))}
      </div>

      {currentPage < totalPages && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={handleNextPage}
            className="group relative overflow-hidden"
            size="lg"
            variant="default"
          >
            <span className="relative flex items-center gap-2">
              Επόμενη σελίδα
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 w-3/12 bg-white/20 skew-x-[45deg] group-hover:w-full transition-all duration-500 -translate-x-full group-hover:translate-x-full" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
