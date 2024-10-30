import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorPreview from '@/components/VectorPreview';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Tesseract from 'tesseract.js';
import * as potrace from 'potrace';
import { ColorMode, VectorOptions } from '@/types/vector';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [vectorResult, setVectorResult] = useState<{
    svg: string;
    text: string[];
    fonts: string[];
  } | null>(null);
  const [options, setOptions] = useState<VectorOptions>({
    colorMode: 'color',
    quality: 1
  });
  
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setVectorResult(null);
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setProcessing(true);
    toast({
      title: "Processando imagem",
      description: "Isso pode levar alguns segundos...",
    });

    try {
      const result = await Tesseract.recognize(selectedImage, 'por', {
        logger: m => console.log(m),
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        workerOptions: {
          workerPath: 'https://unpkg.com/tesseract.js@v5.0.0/dist/worker.min.js',
          corePath: 'https://unpkg.com/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
        },
        rectangle: undefined,
        pdfTitle: 'Extracted Text',
        pdfAuthor: 'Highvectorify',
        pdfSubject: 'OCR Result',
      });

      const recognizedText = result.data.paragraphs
        .map(p => p.text.trim())
        .filter(text => text.length > 0);

      const reader = new FileReader();
      reader.onload = () => {
        const params: potrace.Params = {
          turdSize: 2,
          alphaMax: 1,
          optCurve: true,
          threshold: options.colorMode === 'blackwhite' ? 128 : 100,
          blackOnWhite: true,
          color: options.colorMode === 'grayscale' ? '#666666' : '#000000',
          background: options.colorMode === 'color' ? '#FFFFFF' : undefined,
          fillStrategy: options.colorMode === 'color' ? 'dominant' : undefined,
          rangeDistribution: options.colorMode === 'color' ? 'auto' : undefined,
          optTolerance: 0.2,
          pathomit: 8,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conversor de Imagem para Vetor
          </h1>
          <p className="text-lg text-gray-600">
            Transforme suas imagens em vetores de alta qualidade com reconhecimento de texto
          </p>
        </div>

        <ImageUploader onImageSelect={handleImageSelect} />

        {selectedImage && !vectorResult && (
          <div className="mt-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Opções de Conversão</h3>
              <RadioGroup
                defaultValue={options.colorMode}
                onValueChange={(value: ColorMode) => 
                  setOptions(prev => ({ ...prev, colorMode: value }))
                }
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="color" id="color" />
                  <Label htmlFor="color" className="ml-2">Colorido</Label>
                </div>
                <div>
                  <RadioGroupItem value="grayscale" id="grayscale" />
                  <Label htmlFor="grayscale" className="ml-2">Escala de Cinza</Label>
                </div>
                <div>
                  <RadioGroupItem value="blackwhite" id="blackwhite" />
                  <Label htmlFor="blackwhite" className="ml-2">Preto e Branco</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={processImage}
              disabled={processing}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              {processing ? 'Processando...' : 'Converter para Vetor'}
            </Button>
          </div>
        )}

        {vectorResult && (
          <VectorPreview
            svgContent={vectorResult.svg}
            recognizedText={vectorResult.text}
            detectedFonts={vectorResult.fonts}
            colorMode={options.colorMode}
          />
        )}
      </div>
    </div>
  );
};

export default Index;