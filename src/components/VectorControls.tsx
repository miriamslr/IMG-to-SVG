import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode, VectorOptions } from '@/types/vector';
import { Card } from '@/components/ui/card';

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

const VectorControls = ({ options, onOptionsChange }: VectorControlsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Opções de Conversão</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">Tamanho Mínimo dos Objetos</Label>
          <Slider
            value={[options.turdSize]}
            onValueChange={([value]) => 
              onOptionsChange({ turdSize: value })
            }
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="mb-2 block">Suavidade das Curvas</Label>
          <Slider
            value={[options.alphaMax]}
            onValueChange={([value]) => 
              onOptionsChange({ alphaMax: value })
            }
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="mb-2 block">Limiar de Detecção</Label>
          <Slider
            value={[options.threshold]}
            onValueChange={([value]) => 
              onOptionsChange({ threshold: value })
            }
            min={0}
            max={255}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="mb-2 block">Simplificação do Caminho</Label>
          <Slider
            value={[options.pathomit]}
            onValueChange={([value]) => 
              onOptionsChange({ pathomit: value })
            }
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="mb-2 block">Limiar de Linhas</Label>
          <Slider
            value={[options.lineThreshold]}
            onValueChange={([value]) => 
              onOptionsChange({ lineThreshold: value })
            }
            min={0}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>
        <div>
          <Label className="mb-2 block">Detecção de Cantos</Label>
          <Slider
            value={[options.cornerThreshold]}
            onValueChange={([value]) => 
              onOptionsChange({ cornerThreshold: value })
            }
            min={0}
            max={180}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label className="mb-2 block">Modo de Cor</Label>
        <RadioGroup
          value={options.colorMode}
          onValueChange={(value: ColorMode) => 
            onOptionsChange({ colorMode: value })
          }
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