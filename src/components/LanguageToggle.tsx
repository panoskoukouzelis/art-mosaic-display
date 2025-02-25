
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const toggleLanguage = () => {
    const newLang = isEnglish ? 'el' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLanguage}
      className="relative w-[5rem] gap-2"
    >
      <span className={`transition-opacity ${isEnglish ? 'opacity-100' : 'opacity-40'}`}>EN</span>
      {isEnglish ? (
        <ToggleRight className="absolute right-2 h-4 w-4 text-primary transition-all" />
      ) : (
        <ToggleLeft className="absolute right-2 h-4 w-4 text-primary transition-all" />
      )}
      <span className={`transition-opacity ${!isEnglish ? 'opacity-100' : 'opacity-40'}`}>ΕΛ</span>
    </Button>
  );
}
