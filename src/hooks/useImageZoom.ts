import { useState, useRef, useEffect } from 'react';

interface UseImageZoomProps {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export const useImageZoom = ({
  minZoom = 0.1,
  maxZoom = 3,
  zoomStep = 0.1
}: UseImageZoomProps = {}) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY < 0 ? zoomStep : -zoomStep;
        setZoom(prev => {
          const newZoom = prev + delta;
          return Math.min(Math.max(newZoom, minZoom), maxZoom);
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [minZoom, maxZoom, zoomStep]);

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
    containerRef
  };
};