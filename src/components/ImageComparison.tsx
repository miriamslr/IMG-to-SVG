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
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height
        });
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  // Ajusta o SVG para usar as dimensões exatas do arquivo original
  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}">`
  );

  const containerWidth = containerRef.current?.clientWidth || 0;
  const containerHeight = containerRef.current?.clientHeight || 0;
  const scale = Math.min(
    (containerWidth - 32) / dimensions.width,
    (containerHeight - 32) / dimensions.height,
    1
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div 
        ref={containerRef} 
        className="relative flex-1 min-h-0 bg-[url('/grid.png')]"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            style={{
              width: dimensions.width * scale,
              height: dimensions.height * scale,
              position: 'relative'
            }}
          >
            {/* SVG Container */}
            <div 
              style={{ 
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              dangerouslySetInnerHTML={{ __html: adjustedVectorImage }}
            />
            
            {/* Original Image Container */}
            <div 
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                clipPath: `inset(0 ${100 - position}% 0 0)`
              }}
            >
              <img 
                ref={imageRef}
                src={originalImage} 
                alt="Original"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill'
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Original
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Vetorizado
        </div>
      </div>

      <div className="h-[60px] px-4 w-full max-w-md mx-auto flex items-center">
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