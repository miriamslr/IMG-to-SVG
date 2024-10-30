import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    vectorPrecision: 75,
    pathSimplification: 50,
    autoOptimize: false,
    colorMode: 'preserve',
    smoothEdges: false,
    noiseReduction: false,
    effectIntensity: 30
  });

  const handleAdjustmentChange = (key: keyof ImageAdjustments, value: any) => {
    const newAdjustments = { ...adjustments, [key]: value };
    setAdjustments(newAdjustments);
    onAdjustmentsChange?.(newAdjustments);
  };

  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-accent rounded-lg">
          <span className="font-semibold">Opções Avançadas de Personalização</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="image">Imagem</TabsTrigger>
              <TabsTrigger value="vector">Vetor</TabsTrigger>
              <TabsTrigger value="effects">Efeitos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Ajustes de Imagem</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Brilho</Label>
                    <Slider 
                      value={[adjustments.brightness]} 
                      onValueChange={([value]) => handleAdjustmentChange('brightness', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraste</Label>
                    <Slider 
                      value={[adjustments.contrast]} 
                      onValueChange={([value]) => handleAdjustmentChange('contrast', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Saturação</Label>
                    <Slider 
                      value={[adjustments.saturation]} 
                      onValueChange={([value]) => handleAdjustmentChange('saturation', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="vector" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Configurações do Vetor</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Otimização Automática</Label>
                    <Switch 
                      checked={adjustments.autoOptimize}
                      onCheckedChange={(checked) => handleAdjustmentChange('autoOptimize', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precisão das Curvas</Label>
                    <Slider 
                      value={[adjustments.vectorPrecision]} 
                      onValueChange={([value]) => handleAdjustmentChange('vectorPrecision', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Simplificação de Caminhos</Label>
                    <Slider 
                      value={[adjustments.pathSimplification]} 
                      onValueChange={([value]) => handleAdjustmentChange('pathSimplification', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modo de Cor</Label>
                    <RadioGroup 
                      value={adjustments.colorMode}
                      onValueChange={(value: 'preserve' | 'optimize' | 'monochrome') => 
                        handleAdjustmentChange('colorMode', value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="preserve" id="preserve" />
                        <Label htmlFor="preserve">Preservar Cores</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="optimize" id="optimize" />
                        <Label htmlFor="optimize">Otimizar Paleta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monochrome" id="monochrome" />
                        <Label htmlFor="monochrome">Monocromático</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="effects" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Efeitos Especiais</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Suavização de Bordas</Label>
                    <Switch 
                      checked={adjustments.smoothEdges}
                      onCheckedChange={(checked) => handleAdjustmentChange('smoothEdges', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Remoção de Ruído</Label>
                    <Switch 
                      checked={adjustments.noiseReduction}
                      onCheckedChange={(checked) => handleAdjustmentChange('noiseReduction', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Intensidade do Efeito</Label>
                    <Slider 
                      value={[adjustments.effectIntensity]} 
                      onValueChange={([value]) => handleAdjustmentChange('effectIntensity', value)}
                      max={100} 
                      step={1} 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

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
    </div>
  );
};

export default RecognitionResults;