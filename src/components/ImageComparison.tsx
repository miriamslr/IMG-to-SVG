import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageNaturalDimensions, setImageNaturalDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        // Dimensões totais do arquivo
        setDimensions({
          width: img.width,
          height: img.height
        });
        
        // Dimensões reais da imagem (sem espaços em branco)
        if (imageRef.current) {
          const naturalWidth = imageRef.current.naturalWidth;
          const naturalHeight = imageRef.current.naturalHeight;
          setImageNaturalDimensions({
            width: naturalWidth,
            height: naturalHeight
          });
        }
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="none">`
  );

  const containerWidth = containerRef.current?.clientWidth || 0;
  const containerHeight = containerRef.current?.clientHeight || 0;
  const scale = Math.min(
    (containerWidth - 32) / dimensions.width,
    (containerHeight - 32) / dimensions.height,
    1
  );

  const PreviewContent = () => {
    const imageContainerStyle = {
      width: dimensions.width * scale,
      height: dimensions.height * scale,
      margin: 'auto',
      position: 'relative' as const
    };

    return (
      <div className="relative border rounded-lg overflow-hidden bg-white h-full flex items-center justify-center">
        <div style={imageContainerStyle}>
          {/* SVG Container */}
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
                height: dimensions.height,
                position: 'absolute',
                top: 0,
                left: 0
              }}
              dangerouslySetInnerHTML={{ __html: adjustedVectorImage }}
            />
          </div>
          
          {/* Original Image Container */}
          <div 
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
            <img 
              ref={imageRef}
              src={originalImage} 
              alt="Original"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
          </div>
        </div>

        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Original
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
          Vetorizado
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div 
        ref={containerRef} 
        className="relative flex-1 min-h-0"
      >
        <PreviewContent />
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