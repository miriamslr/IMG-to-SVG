import React from 'react';

interface ImagePreviewProps {
  originalImage: string | null;
  vectorImage: string;
  position: number;
  dimensions: { width: number; height: number };
  transformStyle: React.CSSProperties;
}

export const ImagePreview = ({
  originalImage,
  vectorImage,
  position,
  dimensions,
  transformStyle,
}: ImagePreviewProps) => {
  return (
    <>
      <div className="absolute inset-0 w-full h-full" style={transformStyle}>
        <div
          className="absolute inset-0 w-full h-full"
          dangerouslySetInnerHTML={{ __html: vectorImage }}
        />
      </div>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: 'clip-path 0.1s ease-out',
          ...transformStyle
        }}
      >
        {originalImage && (
          <img
            src={originalImage}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>

      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Vetorizado
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Original
      </div>
    </>
  );
};