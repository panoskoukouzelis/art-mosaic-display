
import React from 'react';
import { isYouTubeLink, getYouTubeEmbedUrl } from '@/utils/youtubeUtils';
import { stripHtml } from '@/utils/htmlUtils';

interface ArtworkDetailProps {
  content: string;
  link?: {
    url: string;
    is_external: boolean;
    nofollow: boolean;
  };
  buttonText?: string;
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ 
  content, 
  link, 
  buttonText 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Λεπτομέρεια</h3>
      {isYouTubeLink(content) ? (
        <div className="aspect-video rounded-lg overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(content)}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {stripHtml(content)}
        </p>
      )}
      
      {link?.url && (
        <div className="mt-4">
          <a
            href={link.url}
            target={link.is_external ? "_blank" : "_self"}
            rel={link.nofollow ? "nofollow" : ""}
            className="text-blue-500 underline"
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  );
};
