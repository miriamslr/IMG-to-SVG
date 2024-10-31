import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { convertSvgToPdf, convertSvgToImage } from '@/utils/fileConverters';

interface DownloadButtonsProps {
  vectorContent: string;
}

export const DownloadButtons = ({ vectorContent }: DownloadButtonsProps) => {
  const handleDownload = async (format: 'svg' | 'pdf' | 'png' | 'jpeg') => {
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
        case 'png':
          blob = await convertSvgToImage(vectorContent, 'png');
          filename = 'vector.png';
          break;
        case 'jpeg':
          blob = await convertSvgToImage(vectorContent, 'jpeg');
          filename = 'vector.jpg';
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
      <Button onClick={() => handleDownload('png')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        PNG
      </Button>
      <Button onClick={() => handleDownload('jpeg')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        JPEG
      </Button>
    </div>
  );
};