
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  x: number;
  y: number;
  description: string;
  onClick?: () => void;
}

const Hotspot = ({ x, y, description, onClick }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute w-6 h-6 -ml-3 -mt-3 cursor-pointer z-20"
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={onClick}
          >
            <div className="relative w-full h-full">
              {/* Main dot */}
              <div className="w-full h-full bg-[hsl(var(--gallery-accent))] rounded-full" />
              {/* Pulsing ring */}
              <div className="absolute inset-0 bg-[hsl(var(--gallery-accent))] rounded-full animate-ping opacity-75" />
              {/* Inner glow */}
              <div className="absolute inset-1 bg-[hsl(var(--gallery-accent))] rounded-full animate-pulse" />
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hotspot;
