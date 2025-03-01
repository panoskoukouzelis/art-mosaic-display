
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

const AUTOPLAY_INTERVAL = 3000; // 3 δευτερόλεπτα

const Screensaver = ({ onInteraction }: { onInteraction: () => void }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    axios.get('https://staging.pedpelop.gr/wp-json/hotspot/v1/get_all_hotspots/?page=1')
      .then(response => {
        const fetchedImages = response.data.data.map((item: any) => item.thumbnail);
        setImages(fetchedImages);
        console.log(fetchedImages);
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  useEffect(() => {
    const handleInteraction = () => onInteraction();
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [onInteraction]);

  return (
    <div className="fixed inset-0 bg-neutral-900 z-50 flex items-center justify-center w-full h-screen">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: AUTOPLAY_INTERVAL,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={src} 
                alt={`Slide ${index}`} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                style={{
                  maxHeight: '80vh',
                  width: 'auto',
                }} 
                draggable={false} 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Screensaver;
