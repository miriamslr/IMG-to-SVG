import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const maxWidth = Math.min(600, window.innerWidth - 32); // Reduzido de 800 para 600
        const width = maxWidth;
        const height = width * aspectRatio;
        
        setDimensions({ width, height });
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="100%" height="100%" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="xMidYMid meet">`
  );

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden bg-white mx-auto"
        style={{
          width: '100%',
          maxWidth: dimensions.width,
          aspectRatio: dimensions.width / dimensions.height
        }}
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: adjustedVectorImage }} />
        </div>
        
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            transition: 'clip-path 0.1s ease-out'
          }}
        >
          <img 
            src={originalImage} 
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Vetorizado
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Original
        </div>

        <div 
          className="absolute top-1/2 w-0.5 h-12 bg-white shadow-lg -translate-y-1/2 pointer-events-none"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="px-4 w-full max-w-md mx-auto">
        <Slider
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          min={0}
          max={100}
          step={0.1}
          className="z-10"
        />
      </div>
    </div>
  );
};

export default ImageComparison;