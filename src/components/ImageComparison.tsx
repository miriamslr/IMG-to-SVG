import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  
  if (!originalImage) return null;

  return (
    <div className="relative w-full aspect-[4/3] border rounded-lg overflow-hidden bg-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ 
            __html: vectorImage.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"') 
          }}
        />
      </div>
      
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: 'clip-path 0.1s ease-out'
        }}
      >
        <img 
          src={originalImage} 
          alt="Original" 
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="absolute inset-x-0 bottom-4 mx-auto w-2/3">
        <Slider
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          min={0}
          max={100}
          step={0.1}
          className="z-10"
        />
      </div>

      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
        Vetorizado
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
        Original
      </div>

      <div 
        className="absolute top-1/2 w-0.5 h-12 bg-white shadow-lg -translate-y-1/2 pointer-events-none"
        style={{ left: `${position}%` }}
      />
    </div>
  );
};

export default ImageComparison;