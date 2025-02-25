
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLanguage}
      className="w-16"
    >
      {i18n.language === 'el' ? 'EN' : 'ΕΛ'}
    </Button>
  );
}
