
import ArtGallery from '@/components/ArtGallery';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useStaticTexts } from '@/hooks/useStaticTexts';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();
  const { getText, isLoading } = useStaticTexts();

  const homeTitle = getText('homeTitle');
  const homeSubtitle = getText('homeSubTitle');

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-8">
        <div className="flex justify-end items-center gap-2 mb-8">
          <LanguageToggle />
          <ModeToggle />
        </div>
        <header className="mb-8 md:mb-12">
          {isLoading ? (
            <div className="flex flex-col space-y-4 animate-pulse">
              <div className="h-8 w-64 bg-muted rounded"></div>
              <div className="h-6 w-96 bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-light text-foreground">
                {homeTitle || t('gallery.title')}
              </h1>
              <p className="text-muted-foreground md:text-lg">
                {homeSubtitle || t('gallery.subtitle')}
              </p>
            </>
          )}
        </header>
        <main>
          <ArtGallery />
        </main>
      </div>
    </div>
  );
};

export default Index;
