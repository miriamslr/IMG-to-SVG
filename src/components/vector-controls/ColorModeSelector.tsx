import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode } from '@/types/vector';
import { HelpCircle, Palette, PaintBucket, Contrast } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorModeSelectorProps {
  value: ColorMode;
  onChange: (value: ColorMode) => void;
}

const ColorModeSelector = ({ value, onChange }: ColorModeSelectorProps) => {
  return (
    <div className="mt-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 mb-4">
              <Label className="text-sm font-medium text-muted-foreground">Modo de Cor</Label>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Escolha como as cores serão tratadas no resultado final</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <RadioGroup
        value={value}
        onValueChange={(value: ColorMode) => onChange(value)}
        className="grid grid-cols-3 gap-4"
      >
        <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <Palette className="w-5 h-5" />
          <RadioGroupItem value="color" id="color" className="sr-only" />
          <Label htmlFor="color" className="text-sm cursor-pointer">Colorido</Label>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <Contrast className="w-5 h-5" />
          <RadioGroupItem value="grayscale" id="grayscale" className="sr-only" />
          <Label htmlFor="grayscale" className="text-sm cursor-pointer">Escala de Cinza</Label>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <PaintBucket className="w-5 h-5" />
          <RadioGroupItem value="blackwhite" id="blackwhite" className="sr-only" />
          <Label htmlFor="blackwhite" className="text-sm cursor-pointer">Preto e Branco</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ColorModeSelector;