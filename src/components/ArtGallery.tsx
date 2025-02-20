
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ArtworkCard from './ArtworkCard';

const API_URL = 'http://20.86.33.156:8080/wordpress/wp-json/hotspot/v1/get_all_hotspots/?page=1';

const ArtGallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data && Array.isArray(data.data)) {
          const artworksFormatted = data.data.map((item) => ({
            id: item.post_id,
            title: item.title,
            imageUrl: item.feature_image,
            description: item.content,
            hotspots: item.hotspots,
            // Random height between 300 and 500px
            height: Math.floor(Math.random() * (500 - 300 + 1)) + 300
          }));

          setArtworks(artworksFormatted);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const displayedArtworks = artworks.slice(0, page * itemsPerPage);
  const canLoadMore = displayedArtworks.length < artworks.length;

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

  if (!loading && displayedArtworks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Δεν βρέθηκαν έργα τέχνης.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {displayedArtworks.map((artwork) => (
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

      {canLoadMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="group relative px-8 py-3 rounded-full overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 w-3/12 bg-white/20 skew-x-[45deg] group-hover:w-full transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
            <span className="relative flex items-center gap-2">
              Φόρτωση περισσότερων
              <svg
                className="w-5 h-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
