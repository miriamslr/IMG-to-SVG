import React, { useEffect, useRef } from 'react';
import { ColorMode } from '@/types/vector';
import { toast } from '@/components/ui/use-toast';
import Raphael from 'raphael';
import type { RaphaelPaper } from 'raphael';
import DownloadButtons from './vector-preview/DownloadButtons';
import PreviewPanel from './vector-preview/PreviewPanel';

interface VectorPreviewProps {
  svgContent: string;
  recognizedText: string[];
  detectedFonts: string[];
  colorMode: ColorMode;
  originalImage?: string;
}

const VectorPreview = ({ 
  svgContent, 
  recognizedText, 
  detectedFonts, 
  colorMode,
  originalImage 
}: VectorPreviewProps) => {
  const vectorRef = useRef<HTMLDivElement>(null);
  const raphaelRef = useRef<RaphaelPaper | null>(null);

  useEffect(() => {
    if (vectorRef.current && svgContent) {
      if (raphaelRef.current) {
        raphaelRef.current.remove();
      }

      const container = vectorRef.current;
      const paper = Raphael(container, container.clientWidth, container.clientHeight);
      raphaelRef.current = paper;

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const paths = svgDoc.getElementsByTagName('path');

      Array.from(paths).forEach(path => {
        const pathData = path.getAttribute('d');
        if (pathData) {
          const raphaelPath = paper.path(pathData);
          
          switch (colorMode) {
            case 'blackwhite':
              raphaelPath.attr({ fill: '#000000', stroke: 'none' });
              break;
            case 'grayscale':
              raphaelPath.attr({ fill: '#666666', stroke: 'none' });
              break;
            case 'color':
              const originalFill = path.getAttribute('fill');
              raphaelPath.attr({ 
                fill: originalFill || '#000000',
                stroke: 'none'
              });
              break;
          }
        }
      });
    }
  }, [svgContent, colorMode]);

  const handleDownload = async (format: 'svg' | 'pdf' | 'ai' | 'cdr') => {
    try {
      if (!raphaelRef.current) return;

      const svgElement = vectorRef.current?.querySelector('svg');
      const svgData = svgElement ? svgElement.outerHTML : '';
      
      if (!svgData) {
        throw new Error('SVG data not found');
      }

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'svg':
          blob = new Blob([svgData], { type: 'image/svg+xml' });
          filename = `vector-${colorMode}.svg`;
          break;
        case 'pdf':
        case 'ai':
        case 'cdr':
          toast({
            title: "Formato não suportado",
            description: `A conversão para ${format.toUpperCase()} requer processamento adicional.`,
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
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <PreviewPanel title="Imagem Original">
            {originalImage && (
              <img 
                src={originalImage} 
                alt="Original" 
                className="max-w-full max-h-full object-contain"
              />
            )}
          </PreviewPanel>
          <PreviewPanel title={`Resultado Vetorial (${colorMode})`}>
            <div ref={vectorRef} className="w-full h-full" />
          </PreviewPanel>
        </div>

        {recognizedText.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Texto Reconhecido</h3>
            <div className="space-y-2">
              {recognizedText.map((text, index) => (
                <p key={index} className="text-gray-700">{text}</p>
              ))}
            </div>
          </div>
        )}

        {detectedFonts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Fontes Detectadas</h3>
            <div className="flex flex-wrap gap-2">
              {detectedFonts.map((font, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {font}
                </span>
              ))}
            </div>
          </div>
        )}

        <DownloadButtons onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default VectorPreview;