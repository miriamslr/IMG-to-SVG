import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VectorSliderProps {
  label: string;
  tip: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const VectorSlider = ({ label, tip, value, onChange, min, max, step }: VectorSliderProps) => {
  return (
    <div className="mb-6 group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium cursor-help">{label}</Label>
              <HelpCircle className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{tip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={([value]) => onChange(value)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">
          {value.toFixed(step >= 1 ? 0 : 1)}
        </span>
      </div>
    </div>
  );
};

export default VectorSlider;