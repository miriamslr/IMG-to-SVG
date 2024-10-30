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
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="none">`
  );

  const scale = containerRef.current 
    ? Math.min(1, containerRef.current.clientWidth / dimensions.width)
    : 1;

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden bg-white mx-auto"
        style={{
          width: '100%',
          height: dimensions.height * scale,
          maxWidth: dimensions.width
        }}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          <div 
            style={{ 
              width: dimensions.width,
              height: dimensions.height
            }}
            dangerouslySetInnerHTML={{ __html: adjustedVectorImage }}
          />
        </div>
        
        <div 
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            transition: 'clip-path 0.1s ease-out',
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          <img 
            src={originalImage} 
            alt="Original"
            style={{
              width: dimensions.width,
              height: dimensions.height
            }}
          />
        </div>

        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Original
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Vetorizado
        </div>
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