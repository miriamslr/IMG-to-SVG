import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ImageAdjustmentsPanel from './recognition-results/ImageAdjustmentsPanel';
import VectorAdjustmentsPanel from './recognition-results/VectorAdjustmentsPanel';
import EffectsPanel from './recognition-results/EffectsPanel';
import RecognitionPanel from './recognition-results/RecognitionPanel';
import { ImageAdjustments } from '@/utils/imageAdjustments';

interface RecognitionResultsProps {
  recognizedText: string[];
  detectedFonts: string[];
  onAdjustmentsChange?: (adjustments: ImageAdjustments) => void;
}

const RecognitionResults = ({ 
  recognizedText, 
  detectedFonts,
  onAdjustmentsChange 
}: RecognitionResultsProps) => {
  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-accent rounded-lg">
          <span className="font-semibold">Opções Avançadas de Personalização</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ajuste os parâmetros para otimizar o resultado da vetorização
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <ImageAdjustmentsPanel onAdjustmentsChange={onAdjustmentsChange} />
            <VectorAdjustmentsPanel onAdjustmentsChange={onAdjustmentsChange} />
            <EffectsPanel onAdjustmentsChange={onAdjustmentsChange} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <RecognitionPanel 
        recognizedText={recognizedText}
        detectedFonts={detectedFonts}
      />
    </div>
  );
};

export default RecognitionResults;