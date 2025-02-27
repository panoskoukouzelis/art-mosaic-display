import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

SwiperCore.use([EffectCoverflow]);

const AUTOPLAY_INTERVAL = 3000; // 3 δευτερόλεπτα

const Screensaver = ({ onInteraction }: { onInteraction: () => void }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    axios.get('https://staging.pedpelop.gr/wp-json/hotspot/v1/get_all_hotspots/?page=1')
      .then(response => {
        const fetchedImages = response.data.data.map((item: any) => item.thumbnail);
        setImages(fetchedImages);
        console.log(fetchedImages); // Εκτυπώστε τα δεδομένα για έλεγχο
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const autoplay = useCallback(() => {
    const autoplayTimer = setInterval(() => {
      // Placeholder if you want to trigger some autoplay action
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(autoplayTimer);
  }, []);

  useEffect(() => {
    const cleanup = autoplay();
    return () => cleanup && cleanup();
  }, [autoplay]);

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
    <div className="fixed inset-0 bg-neutral-900 z-50 flex items-center justify-center">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={3} // Εμφάνιση 3 slides κάθε φορά
        slidesPerGroup={1} // Μετακίνηση κατά 1 slide κάθε φορά
        autoplay={{
          delay: AUTOPLAY_INTERVAL,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow]}
        className="w-full max-w-4xl"
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
  );
};

export default Screensaver;