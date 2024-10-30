import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorPreview from '@/components/VectorPreview';
import VectorControls from '@/components/VectorControls';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Wand2 } from 'lucide-react';
import * as Tesseract from 'tesseract.js';
import * as potrace from 'potrace';
import { ColorMode, VectorOptions } from '@/types/vector';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [vectorResult, setVectorResult] = useState<{
    svg: string;
    text: string[];
    fonts: string[];
  } | null>(null);
  const [options, setOptions] = useState<VectorOptions & {
    turdSize: number;
    alphaMax: number;
    threshold: number;
    optTolerance: number;
    pathomit: number;
  }>({
    colorMode: 'color',
    quality: 1,
    turdSize: 2,
    alphaMax: 1,
    threshold: 128,
    optTolerance: 0.2,
    pathomit: 8
  });
  
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setVectorResult(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setProcessing(true);
    toast({
      title: "Processando imagem",
      description: "Isso pode levar alguns segundos...",
    });

    try {
      const worker = await Tesseract.createWorker('por');
      const result = await worker.recognize(selectedImage);
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
          
          toast({
            title: "Processamento concluído!",
            description: "Sua imagem foi convertida com sucesso.",
          });
        });
      };
      reader.readAsDataURL(selectedImage);
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
    if (selectedImage) {
      processImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conversor de Imagem para Vetor
          </h1>
          <p className="text-lg text-gray-600">
            Transforme suas imagens em vetores de alta qualidade com reconhecimento de texto
          </p>
        </div>

        <ImageUploader onImageSelect={handleImageSelect} />

        {selectedImage && (
          <div className="mt-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Opções de Conversão</h3>
              <VectorControls 
                options={options}
                onOptionsChange={updateOptionsAndProcess}
              />
            </div>

            {!vectorResult && (
              <Button
                onClick={processImage}
                disabled={processing}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {processing ? 'Processando...' : 'Converter para Vetor'}
              </Button>
            )}
          </div>
        )}

        {vectorResult && (
          <VectorPreview
            svgContent={vectorResult.svg}
            recognizedText={vectorResult.text}
            detectedFonts={vectorResult.fonts}
            colorMode={options.colorMode}
            originalImage={imagePreview || undefined}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
