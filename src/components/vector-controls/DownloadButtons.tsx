import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DownloadButtonsProps {
  vectorSvg: string;
}

const DownloadButtons = ({ vectorSvg }: DownloadButtonsProps) => {
  const handleDownload = async (format: 'svg' | 'pdf' | 'png' | 'jpeg') => {
    try {
      const svgBlob = new Blob([vectorSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      if (format === 'svg') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `vector.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          
          if (format === 'png') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vector.${format}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }, `image/${format}`);
        };
        img.src = url;
      }

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
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Button onClick={() => handleDownload('svg')} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        SVG
      </Button>
      <Button onClick={() => handleDownload('pdf')} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
      <Button onClick={() => handleDownload('png')} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        PNG
      </Button>
      <Button onClick={() => handleDownload('jpeg')} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        JPEG
      </Button>
    </div>
  );
};

export default DownloadButtons;