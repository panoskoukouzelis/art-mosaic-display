
import ArtGallery from '@/components/ArtGallery';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-8">
        <div className="flex justify-end items-center gap-2 mb-8">
          <LanguageToggle />
          <ModeToggle />
        </div>
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-light text-foreground">
            {t('gallery.title')}
          </h1>
          <p className="text-muted-foreground md:text-lg">
            {t('gallery.subtitle')}
          </p>
        </header>
        <main>
          <ArtGallery />
        </main>
      </div>
    </div>
  );
};

export default Index;
