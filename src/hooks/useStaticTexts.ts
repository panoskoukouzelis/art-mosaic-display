
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface StaticTextsResponse {
  homeTitle: {
    el: string;
    en: string;
  };
  homeSubTitle: {
    el: string;
    en: string;
  };
  [key: string]: {
    el: string;
    en: string;
  };
}

const fetchStaticTexts = async (): Promise<StaticTextsResponse> => {
  const response = await axios.get('https://staging.pedpelop.gr/wp-json/hotspot/v1/static_texts');
  console.log('Static texts fetched:', response.data);
  return response.data;
};

export const useStaticTexts = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'el';
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['staticTexts'],
    queryFn: fetchStaticTexts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
  
  const getText = (key: string): string => {
    if (!data || !data[key]) {
      console.log(`No data for key: ${key}`);
      return '';
    }
    
    const text = data[key][currentLang as 'el' | 'en'] || '';
    console.log(`Text for ${key} (${currentLang}):`, text);
    return text;
  };
  
  return {
    getText,
    isLoading,
    error
  };
};
