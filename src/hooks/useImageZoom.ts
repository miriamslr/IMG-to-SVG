import { useState, useEffect } from 'react';

interface UseImageZoomProps {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useImageZoom = ({
  minZoom = 0.1,
  maxZoom = 3,
  zoomStep = 0.1,
  containerRef
}: UseImageZoomProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setZoom(prev => Math.min(Math.max(prev + delta, minZoom), maxZoom));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, minZoom, maxZoom]);

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
  };
};