import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { convertSvgToPdf, convertToAi, convertToCdr } from '@/utils/fileConverters';

interface DownloadButtonsProps {
  vectorContent: string;
}

export const DownloadButtons = ({ vectorContent }: DownloadButtonsProps) => {
  const handleDownload = async (format: 'svg' | 'pdf' | 'ai' | 'cdr') => {
    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'svg':
          blob = new Blob([vectorContent], { type: 'image/svg+xml' });
          filename = 'vector.svg';
          break;
        case 'pdf':
          blob = await convertSvgToPdf(vectorContent);
          filename = 'vector.pdf';
          break;
        case 'ai':
          const aiContent = convertToAi(vectorContent);
          blob = new Blob([aiContent], { type: 'application/illustrator' });
          filename = 'vector.ai';
          break;
        case 'cdr':
          const cdrContent = convertToCdr(vectorContent);
          blob = new Blob([cdrContent], { type: 'application/x-cdr' });
          filename = 'vector.cdr';
          break;
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
  );
};