
import ArtGallery from '@/components/ArtGallery';
import { ModeToggle } from '@/components/mode-toggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-8">
        <ModeToggle />
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-light text-foreground">Συλλογή Τέχνης</h1>
          <p className="text-muted-foreground md:text-lg">Ανακαλύψτε αριστουργήματα της τέχνης</p>
        </header>
        <main>
          <ArtGallery />
        </main>
      </div>
    </div>
  );
};

export default Index;
