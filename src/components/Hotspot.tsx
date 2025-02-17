
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  x: number;
  y: number;
  description: string;
}

const Hotspot = ({ x, y, description }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-full h-full bg-white rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-white/50 rounded-full animate-ping" />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hotspot;
