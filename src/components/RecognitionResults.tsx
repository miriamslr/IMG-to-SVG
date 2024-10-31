import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface RecognitionResultsProps {
  recognizedText: string[];
  detectedFonts: string[];
}

const RecognitionResults = ({ recognizedText, detectedFonts }: RecognitionResultsProps) => {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-accent rounded-lg">
        <span className="font-semibold">Reconhecimento de Texto e Fontes</span>
        <Badge variant="secondary" className="ml-2">Beta</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta funcionalidade está em desenvolvimento. Os resultados podem não ser precisos.
          </AlertDescription>
        </Alert>
        
        {recognizedText.length > 0 && (
          <Card className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Texto Reconhecido</h3>
            <div className="space-y-2">
              {recognizedText.map((text, index) => (
                <p key={index} className="text-gray-700">{text}</p>
              ))}
            </div>
          </Card>
        )}

        {detectedFonts.length > 0 && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Fontes Detectadas</h3>
            <div className="flex flex-wrap gap-2">
              {detectedFonts.map((font, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {font}
                </span>
              ))}
            </div>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RecognitionResults;