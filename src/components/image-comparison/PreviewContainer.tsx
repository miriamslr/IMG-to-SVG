import React from 'react';

interface PreviewContainerProps {
  dimensions: { width: number; height: number };
  zoom: number;
  children: React.ReactNode;
}

export const PreviewContainer = ({ dimensions, zoom, children }: PreviewContainerProps) => {
  // Calcula as dimensões mantendo a proporção e limitando a altura a 300px em zoom 100%
  const baseHeight = Math.min(300, dimensions.height);
  const scale = baseHeight / dimensions.height;
  const baseWidth = dimensions.width * scale;

  return (
    <div 
      className="relative border rounded-lg overflow-hidden bg-white cursor-grab active:cursor-grabbing mb-4 mx-auto"
      style={{
        width: baseWidth * zoom,
        height: baseHeight * zoom,
        maxWidth: '100%'
      }}
    >
      {children}
    </div>
  );
};