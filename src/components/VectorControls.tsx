import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode, VectorOptions } from '@/types/vector';

type ExtendedVectorOptions = VectorOptions & {
  turdSize: number;
  alphaMax: number;
  threshold: number;
  pathomit: number;
};

interface VectorControlsProps {
  options: ExtendedVectorOptions;
  onOptionsChange: (newOptions: Partial<ExtendedVectorOptions>) => void;
}

const VectorControls = ({ options, onOptionsChange }: VectorControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
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
      </div>

      <div className="grid grid-cols-2 gap-6">
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
      </div>

      <RadioGroup
        value={options.colorMode}
        onValueChange={(value: ColorMode) => 
          onOptionsChange({ colorMode: value })
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
  );
};

export default VectorControls;