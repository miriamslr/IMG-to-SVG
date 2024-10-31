import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  
  if (!originalImage) return null;

  const adjustedVectorImage = vectorImage.replace(
    /<svg[^>]*>/,
    `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" preserveAspectRatio="none">`
  );

  const scale = containerRef.current 
    ? Math.min(1, containerRef.current.clientWidth / dimensions.width) * zoom
    : 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = (format: 'svg' | 'pdf' | 'ai' | 'cdr') => {
    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'svg':
          blob = new Blob([adjustedVectorImage], { type: 'image/svg+xml' });
          filename = `vector-result.svg`;
          break;
        case 'pdf':
          toast({
            title: "Formato não suportado",
            description: "A conversão para PDF requer processamento no servidor.",
            variant: "destructive"
          });
          return;
        case 'ai':
        case 'cdr':
          toast({
            title: "Formato não suportado",
            description: `A conversão para ${format.toUpperCase()} requer software proprietário.`,
            variant: "destructive"
          });
          return;
        default:
          return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: `Seu arquivo ${format.toUpperCase()} está sendo baixado.`
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao gerar o arquivo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div 
          ref={containerRef}
          className="relative border rounded-lg overflow-hidden bg-white flex-grow cursor-grab active:cursor-grabbing"
          style={{
            width: '100%',
            height: dimensions.height * scale,
            maxWidth: dimensions.width * zoom
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="absolute inset-0"
            style={{ 
              transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
              transformOrigin: 'top left'
            }}
          >
            <div 
              style={{ 
                width: dimensions.width,
                height: dimensions.height
              }}
              dangerouslySetInnerHTML={{ __html: adjustedVectorImage }}
            />
          </div>
          
          <div 
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              transition: 'clip-path 0.1s ease-out',
              transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
              transformOrigin: 'top left'
            }}
          >
            <img 
              src={originalImage} 
              alt="Original"
              style={{
                width: dimensions.width,
                height: dimensions.height
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

        <div className="h-auto py-8">
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={0.1}
            max={3}
            step={0.1}
            orientation="vertical"
            className="h-full"
          />
        </div>
      </div>

      <div className="px-4 w-full max-w-md mx-auto">
        <Slider
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          min={0}
          max={100}
          step={0.1}
          className="z-10"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Button onClick={() => handleDownload('svg')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          SVG
        </Button>
        <Button onClick={() => handleDownload('pdf')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button onClick={() => handleDownload('ai')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          AI
        </Button>
        <Button onClick={() => handleDownload('cdr')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          CDR
        </Button>
      </div>
    </div>
  );
};

export default ImageComparison;