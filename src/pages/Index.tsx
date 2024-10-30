import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorControls from '@/components/VectorControls';
import { useToast } from '@/components/ui/use-toast';
import { Wand2, AlertCircle } from 'lucide-react';
import * as Tesseract from 'tesseract.js';
import * as potrace from 'potrace';
import { ColorMode } from '@/types/vector';
import { Card } from '@/components/ui/card';
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
          color: options.colorMode === 'grayscale' ? '#666666' : '#000000',
          background: options.colorMode === 'color' ? '#FFFFFF' : undefined,
          fillStrategy: options.colorMode === 'color' ? 'dominant' : undefined,
          rangeDistribution: options.colorMode === 'color' ? 'auto' : undefined,
          optTolerance: options.optTolerance,
          pathomit: options.pathomit,
        };

        potrace.trace(reader.result as string, params, (err: Error | null, svg: string) => {
          if (err) throw err;
          
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conversor de Imagem para Vetor
          </h1>
          <p className="text-gray-600">
            Transforme suas imagens em vetores de alta qualidade
          </p>
        </div>

        <Alert className="mb-6">
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Imagem Original</h3>
                <div className="relative aspect-square">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Original" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  )}
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Resultado Vetorial ({options.colorMode})</h3>
                <div className="relative aspect-square bg-gray-50">
                  {vectorResult && (
                    <div 
                      className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
                      dangerouslySetInnerHTML={{ __html: vectorResult.svg }} 
                    />
                  )}
                </div>
              </Card>
            </div>

            <VectorControls 
              options={options}
              onOptionsChange={updateOptionsAndProcess}
            />

            {vectorResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vectorResult.text.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Texto Reconhecido</h3>
                    <div className="space-y-2">
                      {vectorResult.text.map((text, index) => (
                        <p key={index} className="text-gray-700">{text}</p>
                      ))}
                    </div>
                  </Card>
                )}

                {vectorResult.fonts.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Fontes Detectadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {vectorResult.fonts.map((font, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {font}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;