
import React from 'react';
import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotspotButtonProps {
  left: string;
  top: string;
  id: string;
  onHotspotEnter: (id: string) => void;
  onHotspotLeave: () => void;
  onClick: (id: string) => void;
}

export const HotspotButton: React.FC<HotspotButtonProps> = ({
  left,
  top,
  id,
  onHotspotEnter,
  onHotspotLeave,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "absolute -ml-4 -mt-4 w-8 h-8 flex items-center justify-center",
        "hover:scale-110 transition-transform"
      )}
      style={{ left: `${left}%`, top: `${top}%` }}
      onPointerEnter={() => onHotspotEnter(id)}
      onPointerLeave={onHotspotLeave}
      onClick={() => onClick(id)}
    >
      <Hand className="w-6 h-6 text-white drop-shadow-lg" />
    </button>
  );
};
