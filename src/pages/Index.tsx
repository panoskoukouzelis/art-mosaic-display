
import ArtGallery from '@/components/ArtGallery';
import { ModeToggle } from '@/components/mode-toggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8 xl:p-12">
      <ModeToggle />
      <header className="max-w-[2000px] mx-auto mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-light text-foreground mb-2">Συλλογή Τέχνης</h1>
        <p className="text-muted-foreground md:text-lg">Ανακαλύψτε αριστουργήματα της τέχνης</p>
      </header>
      <main className="max-w-[2000px] mx-auto">
        <ArtGallery />
      </main>
    </div>
  );
};

export default Index;
