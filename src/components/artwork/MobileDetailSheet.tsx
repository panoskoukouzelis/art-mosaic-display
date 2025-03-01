
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { stripHtml } from '@/utils/htmlUtils';

interface MobileDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  hotspot: {
    _id: string;
    bwdihp_tooltip_content: string;
    bwdihp_tooltip_image_link?: {
      url: string;
      is_external: boolean;
      nofollow: boolean;
    };
    bwdihp_tooltip_btn?: string;
  } | null;
}

export const MobileDetailSheet: React.FC<MobileDetailSheetProps> = ({
  isOpen,
  onClose,
  hotspot
}) => {
  if (!hotspot) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="left">
        <div className="h-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Λεπτομέρεια</SheetTitle>
            <SheetDescription>
              {stripHtml(hotspot.bwdihp_tooltip_content || "")}
              
              {/* Αν υπάρχει σύνδεσμος, εμφάνιση του */}
              {hotspot.bwdihp_tooltip_image_link?.url && (
                <div className="mt-4">
                  <a
                    href={hotspot.bwdihp_tooltip_image_link.url}
                    target={hotspot.bwdihp_tooltip_image_link.is_external ? "_blank" : "_self"}
                    rel={hotspot.bwdihp_tooltip_image_link.nofollow ? "nofollow" : ""}
                    className="text-blue-500 underline"
                  >
                    {hotspot.bwdihp_tooltip_btn}
                  </a>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
        </div>
      </SheetContent>
    </Sheet>
  );
};
