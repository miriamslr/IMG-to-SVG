import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { debounce } from 'lodash';
import { ImageAdjustments } from '@/utils/imageAdjustments';

interface ImageAdjustmentsPanelProps {
  onAdjustmentsChange?: (adjustments: Partial<ImageAdjustments>) => void;
}

const ImageAdjustmentsPanel = ({ onAdjustmentsChange }: ImageAdjustmentsPanelProps) => {
  const handleChange = useCallback(
    debounce((key: keyof ImageAdjustments, value: number) => {
      onAdjustmentsChange?.({ [key]: value });
    }, 100),
    [onAdjustmentsChange]
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Ajustes de Imagem</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Brilho</Label>
          <Slider 
            defaultValue={[50]} 
            onValueChange={([value]) => handleChange('brightness', value)}
            max={100} 
            step={1} 
          />
        </div>
        <div className="space-y-2">
          <Label>Contraste</Label>
          <Slider 
            defaultValue={[50]} 
            onValueChange={([value]) => handleChange('contrast', value)}
            max={100} 
            step={1} 
          />
        </div>
        <div className="space-y-2">
          <Label>Saturação</Label>
          <Slider 
            defaultValue={[50]} 
            onValueChange={([value]) => handleChange('saturation', value)}
            max={100} 
            step={1} 
          />
        </div>
      </div>
    </Card>
  );
};

export default ImageAdjustmentsPanel;