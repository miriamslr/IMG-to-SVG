import { useEffect } from 'react';

interface ZoomHandlersProps {
  setZoom: (value: number | ((prev: number) => number)) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useZoomHandlers = ({ setZoom, containerRef }: ZoomHandlersProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoom(prev => Math.min(prev + 0.1, 3));
        } else if (e.key === '-') {
          e.preventDefault();
          setZoom(prev => Math.max(prev - 0.1, 0.1));
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setZoom(prev => Math.min(Math.max(prev + delta, 0.1), 3));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    containerRef.current?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      containerRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [setZoom, containerRef]);
};