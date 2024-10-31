import { toast } from '@/components/ui/use-toast';
import { prepareSvgForDownload } from './svgUtils';

type DownloadFormat = 'svg' | 'pdf' | 'ai' | 'cdr';

export const handleDownload = (vectorImage: string, format: DownloadFormat) => {
  try {
    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'svg':
        const processedSvg = prepareSvgForDownload(vectorImage);
        blob = new Blob([processedSvg], { type: 'image/svg+xml' });
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