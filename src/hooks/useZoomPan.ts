import { useState, useRef, useCallback } from 'react';

interface UseZoomPanProps {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export const useZoomPan = ({
  minZoom = 0.1,
  maxZoom = 3,
  zoomStep = 0.1
}: UseZoomPanProps = {}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomToPoint = useCallback((deltaY: number, clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Calculate new zoom level
    const delta = -deltaY * 0.001;
    const newZoom = Math.min(Math.max(zoom + delta, minZoom), maxZoom);
    
    // Calculate how the point should move to stay under the cursor
    const scaleChange = newZoom / zoom;
    const newPan = {
      x: pan.x - (x - pan.x) * (scaleChange - 1),
      y: pan.y - (y - pan.y) * (scaleChange - 1)
    };

    setZoom(newZoom);
    setPan(newPan);
  }, [zoom, pan, minZoom, maxZoom]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  }, [maxZoom, zoomStep]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom));
  }, [minZoom, zoomStep]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.min(Math.max(newZoom, minZoom), maxZoom));
  }, [minZoom, maxZoom]);

  return {
    zoom,
    pan,
    setPan,
    handleZoomIn,
    handleZoomOut,
    handleZoomChange,
    handleZoomToPoint,
    containerRef
  };
};