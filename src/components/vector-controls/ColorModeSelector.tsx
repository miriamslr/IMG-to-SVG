import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorMode } from '@/types/vector';
import { HelpCircle, Palette, PaintBucket, Contrast, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorModeSelectorProps {
  value: ColorMode;
  onChange: (value: ColorMode) => void;
  isProcessing?: boolean;
}

const ColorModeSelector = ({ value, onChange, isProcessing = false }: ColorModeSelectorProps) => {
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
        <div 
          className={`relative flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors cursor-pointer
            ${value === 'color' 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'hover:bg-accent border-input'
            }`}
        >
          {isProcessing && value === 'color' && (
            <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
          <Palette className="w-5 h-5" />
          <RadioGroupItem value="color" id="color" className="sr-only" />
          <Label htmlFor="color" className="text-sm cursor-pointer">Colorido</Label>
        </div>

        <div 
          className={`relative flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors cursor-pointer
            ${value === 'grayscale' 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'hover:bg-accent border-input'
            }`}
        >
          {isProcessing && value === 'grayscale' && (
            <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
          <Contrast className="w-5 h-5" />
          <RadioGroupItem value="grayscale" id="grayscale" className="sr-only" />
          <Label htmlFor="grayscale" className="text-sm cursor-pointer">Escala de Cinza</Label>
        </div>

        <div 
          className={`relative flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors cursor-pointer
            ${value === 'blackwhite' 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'hover:bg-accent border-input'
            }`}
        >
          {isProcessing && value === 'blackwhite' && (
            <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
          <PaintBucket className="w-5 h-5" />
          <RadioGroupItem value="blackwhite" id="blackwhite" className="sr-only" />
          <Label htmlFor="blackwhite" className="text-sm cursor-pointer">Preto e Branco</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ColorModeSelector;