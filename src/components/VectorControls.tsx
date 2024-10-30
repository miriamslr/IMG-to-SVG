import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode, VectorOptions } from '@/types/vector';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

type ExtendedVectorOptions = VectorOptions & {
  turdSize: number;
  alphaMax: number;
  threshold: number;
  pathomit: number;
  lineThreshold: number;
  cornerThreshold: number;
  smoothing: number;
  optimizePaths: number;
};

interface VectorControlsProps {
  options: ExtendedVectorOptions;
  onOptionsChange: (newOptions: Partial<ExtendedVectorOptions>) => void;
}

const ControlTooltip = ({ tip, children }: { tip: string; children: React.ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center gap-2">
        {children}
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tip}</p>
    </TooltipContent>
  </Tooltip>
);

const VectorControls = ({ options, onOptionsChange }: VectorControlsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Opções de Conversão</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <ControlTooltip tip="Define o tamanho mínimo dos objetos que serão detectados. Valores maiores removem detalhes pequenos.">
            <Label className="mb-2 block">Tamanho Mínimo</Label>
          </ControlTooltip>
          <Slider
            value={[options.turdSize]}
            onValueChange={([value]) => onOptionsChange({ turdSize: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <ControlTooltip tip="Controla a suavidade das curvas. Valores maiores geram curvas mais suaves.">
            <Label className="mb-2 block">Suavidade</Label>
          </ControlTooltip>
          <Slider
            value={[options.alphaMax]}
            onValueChange={([value]) => onOptionsChange({ alphaMax: value })}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <ControlTooltip tip="Define o limite entre preto e branco. Ajuste para melhorar a detecção de bordas.">
            <Label className="mb-2 block">Contraste</Label>
          </ControlTooltip>
          <Slider
            value={[options.threshold]}
            onValueChange={([value]) => onOptionsChange({ threshold: value })}
            min={0}
            max={255}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <ControlTooltip tip="Controla a simplificação do traçado. Valores maiores geram vetores mais simples.">
            <Label className="mb-2 block">Simplificação</Label>
          </ControlTooltip>
          <Slider
            value={[options.pathomit]}
            onValueChange={([value]) => onOptionsChange({ pathomit: value })}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <ControlTooltip tip="Escolha como as cores serão tratadas no resultado final">
          <Label className="mb-2 block">Modo de Cor</Label>
        </ControlTooltip>
        <RadioGroup
          value={options.colorMode}
          onValueChange={(value: ColorMode) => onOptionsChange({ colorMode: value })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="color" id="color" />
            <Label htmlFor="color">Colorido</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grayscale" id="grayscale" />
            <Label htmlFor="grayscale">Escala de Cinza</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blackwhite" id="blackwhite" />
            <Label htmlFor="blackwhite">Preto e Branco</Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};

export default VectorControls;