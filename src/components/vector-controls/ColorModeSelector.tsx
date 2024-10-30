import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode } from '@/types/vector';
import { HelpCircle } from 'lucide-react';
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
            <div className="flex items-center gap-2 mb-2">
              <Label>Modo de Cor</Label>
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
  );
};

export default ColorModeSelector;