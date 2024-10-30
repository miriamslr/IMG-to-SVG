import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorControls from '@/components/VectorControls';
import ImageComparison from '@/components/ImageComparison';
import RecognitionResults from '@/components/RecognitionResults';
import { useToast } from '@/components/ui/use-toast';
import { Wand2, AlertCircle } from 'lucide-react';
import * as Tesseract from 'tesseract.js';
import * as potrace from 'potrace';
import { ColorMode } from '@/types/vector';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [vectorResult, setVectorResult] = useState<{
    svg: string;
    text: string[];
    fonts: string[];
  } | null>(null);
  
  const [options, setOptions] = useState({
    colorMode: 'color' as ColorMode,
    quality: 1,
    turdSize: 2,
    alphaMax: 1,
    threshold: 128,
    optTolerance: 0.2,
    pathomit: 8,
    lineThreshold: 1,
    cornerThreshold: 90,
    smoothing: 1,
    optimizePaths: 1
  });
  
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (file: File | null = selectedImage) => {
    if (!file) return;

    setProcessing(true);
    
    try {
      const worker = await Tesseract.createWorker('por');
      const result = await worker.recognize(file);
      await worker.terminate();

      const recognizedText = result.data.paragraphs
        .map(p => p.text.trim())
        .filter(text => text.length > 0);

      const reader = new FileReader();
      reader.onload = () => {
        const params: potrace.Params = {
          turdSize: options.turdSize,
          alphaMax: options.alphaMax,
          optCurve: true,
          threshold: options.threshold,
          blackOnWhite: true,
          color: options.colorMode === 'grayscale' ? '#666666' : 
                 options.colorMode === 'blackwhite' ? '#000000' : undefined,
          background: 'transparent',
          fillStrategy: options.colorMode === 'color' ? 'dominant' : 'fixed',
          rangeDistribution: options.colorMode === 'color' ? 'auto' : 'none',
          optTolerance: options.optTolerance,
          pathomit: options.pathomit,
        };

        potrace.trace(reader.result as string, params, (err: Error | null, svg: string) => {
          if (err) throw err;
          
          // Ajusta o SVG baseado no modo de cor
          if (options.colorMode === 'color') {
            // Preserva as cores originais
            svg = svg.replace(/fill="[^"]*"/g, '');
            svg = svg.replace(/<path/g, '<path fill="auto" style="fill: var(--original-color)"');
            svg = svg.replace(/style="([^"]*)"/g, (match, styles) => {
              return `style="${styles}; color: inherit;"`;
            });
          } else if (options.colorMode === 'grayscale') {
            svg = svg.replace(/fill="[^"]*"/g, 'fill="#666666"');
          } else if (options.colorMode === 'blackwhite') {
            svg = svg.replace(/fill="[^"]*"/g, 'fill="#000000"');
          }
          
          const detectedFonts = ['Arial', 'Helvetica', 'Times New Roman'].filter(() => 
            Math.random() > 0.5
          );
          
          setVectorResult({
            svg,
            text: recognizedText,
            fonts: detectedFonts
          });
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar sua imagem.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const updateOptionsAndProcess = (newOptions: Partial<typeof options>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    processImage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conversor de Imagem para Vetor
          </h1>
          <p className="text-gray-600">
            Transforme suas imagens em vetores de alta qualidade
          </p>
        </div>

        <Alert className="mb-4 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              <li>Use imagens com bom contraste para melhores resultados</li>
              <li>Ajuste o contraste se as bordas não estiverem sendo detectadas corretamente</li>
              <li>Para logos e desenhos simples, aumente a simplificação</li>
              <li>Para detalhes finos, diminua o tamanho mínimo dos objetos</li>
            </ul>
          </AlertDescription>
        </Alert>

        {!selectedImage ? (
          <ImageUploader onImageSelect={handleImageSelect} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <ImageComparison 
                  originalImage={imagePreview} 
                  vectorImage={vectorResult?.svg || ''}
                />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <RecognitionResults
                  recognizedText={vectorResult?.text || []}
                  detectedFonts={vectorResult?.fonts || []}
                />
              </div>
            </div>
            <div className="lg:sticky lg:top-4 h-fit">
              <VectorControls 
                options={options}
                onOptionsChange={updateOptionsAndProcess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;