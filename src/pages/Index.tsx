import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorPreview from '@/components/VectorPreview';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Tesseract from 'tesseract.js';
import * as potrace from 'potrace';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [vectorResult, setVectorResult] = useState<{
    svg: string;
    text: string[];
    fonts: string[];
  } | null>(null);
  
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
      // OCR Processing
      const result = await Tesseract.recognize(selectedImage, 'por');
      const recognizedText = result.data.paragraphs.map(p => p.text).filter(Boolean);

      // Vector Processing (simplified for demo)
      const reader = new FileReader();
      reader.onload = () => {
        potrace.trace(reader.result as string, (err: Error | null, svg: string) => {
          if (err) throw err;
          
          setVectorResult({
            svg,
            text: recognizedText,
            fonts: ['Arial', 'Helvetica', 'Times New Roman'] // Simplified font detection
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
          <div className="mt-8 text-center">
            <Button
              onClick={processImage}
              disabled={processing}
              size="lg"
              className="bg-primary hover:bg-primary/90"
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
          />
        )}
      </div>
    </div>
  );
};

export default Index;