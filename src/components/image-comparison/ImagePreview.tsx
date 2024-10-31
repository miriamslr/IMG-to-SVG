import React from 'react';

interface ImagePreviewProps {
  originalImage: string;
  vectorImage: string;
  position: number;
  dimensions: { width: number; height: number };
  transformStyle: React.CSSProperties;
  containerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const ImagePreview = ({
  originalImage,
  vectorImage,
  position,
  dimensions,
  transformStyle,
  containerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}: ImagePreviewProps) => {
  const getScaleValue = (transform: string | undefined): number => {
    if (!transform) return 1;
    const match = transform.match(/scale\(([\d.]+)\)/);
    return match ? parseFloat(match[1]) : 1;
  };

  const scale = getScaleValue(transformStyle.transform?.toString());

  return (
    <div
      ref={containerRef}
      className="relative border rounded-lg overflow-hidden bg-white cursor-grab active:cursor-grabbing mb-4 mx-auto"
      style={{
        width: '100%',
        height: dimensions.height * scale,
        maxWidth: dimensions.width * scale
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0" style={transformStyle}>
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          dangerouslySetInnerHTML={{ __html: vectorImage }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: 'clip-path 0.1s ease-out',
          ...transformStyle
        }}
      >
        <img
          src={originalImage}
          alt="Original"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>

      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Vetorizado
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Original
      </div>
    </div>
  );
};