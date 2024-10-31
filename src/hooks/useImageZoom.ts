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
  const [pan, setPan] = useState({ x: 0, y: 0 });

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
      if (e.altKey) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY * -0.01;
        const newZoom = Math.min(Math.max(zoom + delta, minZoom), maxZoom);
        const scale = newZoom / zoom;

        // Calcula o novo ponto de pan para manter o mouse no mesmo ponto relativo à imagem
        const newPanX = mouseX - (mouseX - pan.x) * scale;
        const newPanY = mouseY - (mouseY - pan.y) * scale;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, minZoom, maxZoom, zoomStep, handleZoomIn, handleZoomOut, zoom, pan]);

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
    pan,
    setPan,
  };
};