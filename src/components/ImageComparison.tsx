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
        const containerWidth = containerRef.current?.clientWidth || 800;
        const scale = containerWidth / img.width;
        const calculatedHeight = img.height * scale;
        
        setDimensions({
          width: containerWidth,
          height: calculatedHeight
        });
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  // Ajusta o SVG para usar as mesmas dimensões da imagem original
  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="none">`
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full border rounded-lg overflow-hidden bg-white"
      style={{ height: dimensions.height }}
    >
      {/* Container do SVG vetorizado */}
      <div 
        className="absolute inset-0"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div 
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: adjustedVectorImage }}
        />
      </div>
      
      {/* Container da imagem original com clip-path */}
      <div 
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: 'clip-path 0.1s ease-out',
        }}
      >
        <img 
          src={originalImage} 
          alt="Original"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill'
          }}
        />
      </div>

      {/* Controles e labels */}
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