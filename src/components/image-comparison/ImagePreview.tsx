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
      {vectorImage && (
        <div className="absolute inset-0" style={transformStyle}>
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            dangerouslySetInnerHTML={{ 
              __html: vectorImage.replace(
                /<svg/,
                `<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet"`
              )
            }}
          />
        </div>
      )}

      {originalImage && (
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
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Vetorizado
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Original
      </div>
    </>
  );
};