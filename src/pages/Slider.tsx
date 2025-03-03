
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

const AUTOPLAY_INTERVAL = 3000; // 3 seconds

const Slider = () => {
  const [images, setImages] = useState<string[]>([]);
  const [inspectMode, setInspectMode] = useState(false);

  useEffect(() => {
    axios.get('https://staging.pedpelop.gr/wp-json/hotspot/v1/get_all_hotspots/?page=1')
      .then(response => {
        const fetchedImages = response.data.data.map((item: any) => item.thumbnail);
        setImages(fetchedImages);
        console.log(fetchedImages); // Log data for checking
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle inspect mode with Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        setInspectMode(prev => !prev);
        console.log(`Inspect mode ${!inspectMode ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectMode]);

  return (
    <div className="fixed inset-0 bg-neutral-900 z-50 flex flex-col">
      {/* Thumbnail Container (επάνω) */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 text-center bg-gray-800 text-white rounded-b-lg"
        style={{
          width: "50%",
          padding: "2.5rem", // 2.5rem padding
          clipPath: "polygon(5% 100%, 100% 100%, 93% 100%, 100% 0%, 50% 0%, 0% 0%)",
        }}
      >
        Art Gallery {inspectMode && "(Inspect Mode Enabled)"}
      </div>
  
      {/* Swiper Carousel */}
      <div className="flex-grow flex items-center justify-center">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={3}
          slidesPerGroup={1}
          autoplay={{
            delay: AUTOPLAY_INTERVAL,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="relative">
              <div className="carousel-item" style={{ '--index': index } as React.CSSProperties}>
                <img src={src} alt={`Slide ${index}`} className="w-full h-auto rounded-lg shadow-xl" draggable={false} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
  
      {/* Text Container (κάτω) */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center bg-gray-800 text-white rounded-t-lg"
        style={{
          width: "50%",
          padding: "10px", // Padding για το κείμενο
          fontSize: "1.5rem",
          clipPath: "polygon(5% 0, 0% 100%, 100% 100%, 93% 0%, 95% 0%, 50% 0%)",
        }}
      >
        Art Gallery {inspectMode && "(Inspect Mode Enabled)"}
      </div>
    </div>
  );
  
  
};

export default Slider;
