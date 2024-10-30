import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import VectorControls from '@/components/VectorControls';
import ImageComparison from '@/components/ImageComparison';
import RecognitionResults from '@/components/RecognitionResults';
import { useToast } from '@/components/ui/use-toast';
import { ColorMode } from '@/types/vector';
import { processVector } from '@/utils/imageProcessing';

const ImageTracerPage = () => {
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

  const processImage = async (file: File | null = selectedImage) => {
    if (!file) return;

    setProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        
        processVector(imageUrl, {
          turdSize: Math.floor(options.turdSize),
          alphaMax: options.alphaMax,
          threshold: Math.floor(options.threshold),
          optTolerance: options.optTolerance,
          pathomit: Math.floor(options.pathomit),
        }, options.colorMode)
          .then(svg => {
            setVectorResult({
              svg,
              text: [],
              fonts: []
            });
            setProcessing(false);
          })
          .catch(error => {
            toast({
              title: "Erro no processamento",
              description: error.message,
              variant: "destructive"
            });
            setProcessing(false);
          });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar sua imagem.",
        variant: "destructive"
      });
      setProcessing(false);
    }
  };

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      processImage(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ImageTracer - Conversor de Imagem para Vetor
          </h1>
          <p className="text-gray-600">
            Transforme suas imagens em vetores usando ImageTracer
          </p>
        </div>

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
                onOptionsChange={(newOptions) => {
                  setOptions(prev => ({ ...prev, ...newOptions }));
                  processImage();
                }}
                isProcessing={processing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTracerPage;