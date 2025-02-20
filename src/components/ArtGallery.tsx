import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkCard from './ArtworkCard';
import Masonry from 'react-masonry-css';

const API_URL = 'http://20.86.33.156:8080/wordpress/wp-json/hotspot/v1/get_all_hotspots/?page=1';

const breakpointColumns = {
  default: 3,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1
};

const ArtGallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);

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
        console.log('API Response:', data); // Debugging

        if (data && Array.isArray(data.data)) {
          const artworksFormatted = data.data.map((item, index) => ({
            id: item.post_id,
            title: item.title,
            imageUrl: item.feature_image,
            description: item.content,
            hotspots: item.hotspots,
            aspectClass: ['aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]'][index % 4]
          }));

          setArtworks(artworksFormatted);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (id: number) => {
    setSelectedArtwork(id);
    navigate(`/artwork/${id}`);
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4 md:-ml-6 lg:-ml-8"
      columnClassName="pl-4 md:pl-6 lg:pl-8 bg-clip-padding"
    >
      {artworks.map((artwork) => (
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
