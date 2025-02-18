
import ArtGallery from '@/components/ArtGallery';
import { ModeToggle } from '@/components/mode-toggle';
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 4,
  1536: 3,
  1280: 3,
  1024: 2,
  768: 2,
  640: 1
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-8">
        <ModeToggle />
        <header className="mb-8 md:mb-12">
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-4 md:-ml-6 lg:-ml-8"
            columnClassName="pl-4 md:pl-6 lg:pl-8 bg-clip-padding"
          >
            <div className="mb-4 md:mb-6 lg:mb-8">
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-light text-foreground">Συλλογή Τέχνης</h1>
              <p className="text-muted-foreground md:text-lg">Ανακαλύψτε αριστουργήματα της τέχνης</p>
            </div>
          </Masonry>
        </header>
        <main>
          <ArtGallery />
        </main>
      </div>
    </div>
  );
};

export default Index;
