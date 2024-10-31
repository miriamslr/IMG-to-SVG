import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { prepareSvgForDownload } from '@/utils/svgUtils';

interface VectorPreviewProps {
  svgContent: string;
  recognizedText: string[];
  detectedFonts: string[];
  originalImage?: string;
}

const VectorPreview = ({ 
  svgContent, 
  recognizedText, 
  detectedFonts,
  originalImage 
}: VectorPreviewProps) => {
  const preparedSvg = prepareSvgForDownload(svgContent);

  const handleDownload = async (format: 'svg' | 'pdf' | 'ai' | 'cdr') => {
    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'svg':
          blob = new Blob([svgContent], { type: 'image/svg+xml' });
          filename = `vector.svg`;
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
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Imagem Original</h3>
            {originalImage && (
              <div className="border rounded-lg p-4 bg-gray-50 h-[400px] flex items-center justify-center">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Resultado Vetorial</h3>
            <div 
              className="border rounded-lg p-4 bg-gray-50 h-[400px] flex items-center justify-center" 
              dangerouslySetInnerHTML={{ __html: preparedSvg }} 
            />
          </div>
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
    </div>
  );
};

export default VectorPreview;
