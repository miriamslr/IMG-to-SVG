import React from 'react';
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

interface RecognitionResultsProps {
  recognizedText: string[];
  detectedFonts: string[];
}

const RecognitionResults = ({ recognizedText, detectedFonts }: RecognitionResultsProps) => {
  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-accent rounded-lg">
          <span className="font-semibold">Opções Avançadas de Personalização</span>
          <Badge variant="secondary" className="ml-2">Pro</Badge>
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
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraste</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Saturação</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
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
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Precisão das Curvas</Label>
                    <Slider defaultValue={[75]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Simplificação de Caminhos</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Modo de Cor</Label>
                    <RadioGroup defaultValue="preserve">
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
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Remoção de Ruído</Label>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Intensidade do Efeito</Label>
                    <Slider defaultValue={[30]} max={100} step={1} />
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