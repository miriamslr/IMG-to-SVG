import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorControls from '@/components/VectorControls';
import ImageComparison from '@/components/ImageComparison';
import RecognitionResults from '@/components/RecognitionResults';
import { AlertCircle, Undo2, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { processVectorImage, VectorResult } from '@/utils/imageProcessing';

interface HistoryState {
  options: any;
  vectorResult: VectorResult | null;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [vectorResult, setVectorResult] = useState<VectorResult | null>(null);
  
  const [options, setOptions] = useState({
    quality: 1,
    turdSize: 0.5,
    alphaMax: 0.3,
    threshold: 128,
    optTolerance: 0.05,
    pathomit: 2,
    lineThreshold: 0.3,
    cornerThreshold: 45,
    smoothing: 0.65,
    optimizePaths: 0.9,
    antiAlias: true
  });

  const [history, setHistory] = useState<HistoryState[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

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
      if (vectorResult) {
        setHistory(prev => [...prev, { options: { ...options }, vectorResult }]);
      }

      await processVectorImage(file, options, (result) => {
        setVectorResult(result);
      });
    } finally {
      setProcessing(false);
    }
  };

  const updateOptionsAndProcess = (newOptions: Partial<typeof options>) => {
    if (vectorResult) {
      setHistory(prev => [...prev, { options: { ...options }, vectorResult }]);
    }
    setOptions(prev => ({ ...prev, ...newOptions }));
    processImage();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setOptions(lastState.options);
      setVectorResult(lastState.vectorResult);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleNewImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setVectorResult(null);
    setHistory([]);
    setOptions({
      quality: 1,
      turdSize: 0.5,
      alphaMax: 0.3,
      threshold: 128,
      optTolerance: 0.05,
      pathomit: 2,
      lineThreshold: 0.3,
      cornerThreshold: 45,
      smoothing: 0.65,
      optimizePaths: 0.9,
      antiAlias: true
    });
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
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleUndo}
                disabled={history.length === 0}
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Desfazer
              </Button>
              <Button
                variant="outline"
                onClick={handleNewImage}
              >
                <Upload className="w-4 h-4 mr-2" />
                Nova Imagem
              </Button>
            </div>
            
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;