import { useState, useRef, useEffect } from 'react';

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setZoom(prev => {
          const newZoom = prev + delta;
          return Math.min(Math.max(newZoom, minZoom), maxZoom);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [minZoom, maxZoom, zoomStep, containerRef, handleZoomIn, handleZoomOut]);

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
  };
};