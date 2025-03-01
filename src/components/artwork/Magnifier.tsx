
import React from 'react';

interface MagnifierProps {
  position: { x: number; y: number };
  zoomLevel: number;
  size: number;
  imageSrc: string;
}

export const Magnifier: React.FC<MagnifierProps> = ({ position, zoomLevel, size, imageSrc }) => {
  return (
    <div
      className="absolute w-40 h-40 pointer-events-none border-2 border-white/50 rounded-full overflow-hidden"
      style={{
        left: `calc(${position.x}% - ${size/2}px)`,
        top: `calc(${position.y}% - ${size/2}px)`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="absolute"
        style={{
          width: `${zoomLevel * 100}%`,
          height: `${zoomLevel * 100}%`,
          left: `${-position.x * zoomLevel + 50}%`,
          top: `${-position.y * zoomLevel + 50}%`,
        }}
      >
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
};
