import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { ZoomControls } from './image-comparison/ZoomControls';
import { DownloadButtons } from './image-comparison/DownloadButtons';
import { ImagePreview } from './image-comparison/ImagePreview';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useImageZoom } from '@/hooks/useImageZoom';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
  } = useImageZoom();

  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = originalImage;
    }
  }, [originalImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey && e.button === 2) {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setPosition(Math.max(0, Math.min(100, percentage)));
      }
    } else if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.ctrlKey && e.buttons === 2) {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setPosition(Math.max(0, Math.min(100, percentage)));
      }
    } else if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimeout.current) {
      clearTimeout(interactionTimeout.current);
    }
  };

  const handleInteractionEnd = () => {
    if (interactionTimeout.current) {
      clearTimeout(interactionTimeout.current);
    }
    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 500);
  };

  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="none">`
  );

  const transformStyle = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transformOrigin: 'top left',
    width: dimensions.width,
    height: dimensions.height
  };

  const floatingControlsClass = alwaysVisible
    ? 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300'
    : '';
  
  const opacityClass = alwaysVisible && !isInteracting
    ? 'opacity-30 hover:opacity-100'
    : 'opacity-100';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="always-visible"
            checked={alwaysVisible}
            onCheckedChange={setAlwaysVisible}
          />
          <Label htmlFor="always-visible">Controles sempre visíveis</Label>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <div className="flex-1 flex flex-col items-center">
          <div 
            ref={containerRef}
            className="relative border rounded-lg overflow-hidden bg-white cursor-grab active:cursor-grabbing mb-4 mx-auto"
            style={{
              width: '100%',
              height: dimensions.height * zoom,
              maxWidth: dimensions.width * zoom
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          >
            <ImagePreview
              originalImage={originalImage}
              vectorImage={adjustedVectorImage}
              position={position}
              dimensions={dimensions}
              transformStyle={transformStyle}
            />
          </div>

          <div className={`${alwaysVisible ? 'hidden' : ''}`}>
            <ZoomControls
              zoom={zoom}
              onZoomChange={setZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          </div>
        </div>
      </div>

      <div className={`${alwaysVisible ? 'hidden' : 'px-4 w-full max-w-md mx-auto'}`}>
        <Slider
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          min={0}
          max={100}
          step={0.1}
          className="z-10"
        />
      </div>

      {alwaysVisible && (
        <div 
          className={`${floatingControlsClass} ${opacityClass} bg-white rounded-lg shadow-lg p-4 transition-all duration-300`}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onMouseMove={handleInteractionStart}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
        >
          <div className="space-y-4">
            <ZoomControls
              zoom={zoom}
              onZoomChange={setZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
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
      )}

      <DownloadButtons vectorContent={vectorImage} />
    </div>
  );
};

export default ImageComparison;
