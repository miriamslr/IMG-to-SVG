import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { debounce } from 'lodash';
import { ImageAdjustments } from '@/utils/imageAdjustments';

interface EffectsPanelProps {
  onAdjustmentsChange?: (adjustments: Partial<ImageAdjustments>) => void;
}

const EffectsPanel = ({ onAdjustmentsChange }: EffectsPanelProps) => {
  const handleChange = useCallback(
    debounce((key: keyof ImageAdjustments, value: any) => {
      onAdjustmentsChange?.({ [key]: value });
    }, 100),
    [onAdjustmentsChange]
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Efeitos Especiais</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Suavização de Bordas</Label>
          <Switch 
            defaultChecked={false}
            onCheckedChange={(checked) => handleChange('smoothEdges', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Remoção de Ruído</Label>
          <Switch 
            defaultChecked={false}
            onCheckedChange={(checked) => handleChange('noiseReduction', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label>Intensidade do Efeito</Label>
          <Slider 
            defaultValue={[30]} 
            onValueChange={([value]) => handleChange('effectIntensity', value)}
            max={100} 
            step={1} 
          />
        </div>
      </div>
    </Card>
  );
};

export default EffectsPanel;