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
    <div className="mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 mb-2">
              <Label>{label}</Label>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Slider
        value={[value]}
        onValueChange={([value]) => onChange(value)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

export default VectorSlider;