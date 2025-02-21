import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import ArtworkCard from './ArtworkCard';

interface Hotspot {
  _id: string;
  bwdihp_hotspot_title: string;
  bwdihp_tooltip_btn: string;
  bwdihp_tooltip_content?: string;
  bwdihp_hotspot_left_position?: {
    unit: string;
    size: number;
    sizes: any[];
  };
  bwdihp_hotspot_top_position?: {
    unit: string;
    size: number;
    sizes: any[];
  };
}

interface ArtworkData {
  post_id: number;
  title: string;
  content: string;
  hotspots: Hotspot[];
  feature_image: string;
}

interface APIResponse {
  current_page: number;
  total_pages: number;
  per_page: number;
  data: ArtworkData[];
}

const BASE_API_URL = 'http://20.86.33.156:8080/wordpress/wp-json/hotspot/v1/get_all_hotspots';

const fetchArtworksPage = async (page: number): Promise<APIResponse> => {
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
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['artworks', currentPage],
    queryFn: () => fetchArtworksPage(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData
  });

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  const handleNextPage = () => {
    if (data && currentPage < data.total_pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading && !data) {
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

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Δεν βρέθηκαν έργα τέχνης.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {data.data.map((artwork) => (
          <div
            key={artwork.post_id}
            className="break-inside-avoid mb-4"
            style={{ height: `${Math.floor(Math.random() * (500 - 300 + 1)) + 300}px` }}
          >
            <ArtworkCard
              artwork={{
                id: artwork.post_id,
                title: artwork.title,
                imageUrl: artwork.feature_image,
                hotspots: artwork.hotspots.map(h => ({
                  id: h._id,
                  x: h.bwdihp_hotspot_left_position?.size || 0,
                  y: h.bwdihp_hotspot_top_position?.size || 0,
                  description: h.bwdihp_tooltip_content || ''
                }))
              }}
              onClick={() => handleArtworkClick(artwork.post_id)}
              selected={selectedArtwork === artwork.post_id}
            />
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
                Επόμενη σελίδα
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
