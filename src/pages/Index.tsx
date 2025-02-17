
import ArtGallery from '@/components/ArtGallery';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Συλλογή Τέχνης</h1>
        <p className="text-gray-600">Ανακαλύψτε αριστουργήματα της τέχνης</p>
      </header>
      <main className="max-w-7xl mx-auto">
        <ArtGallery />
      </main>
    </div>
  );
};

export default Index;
