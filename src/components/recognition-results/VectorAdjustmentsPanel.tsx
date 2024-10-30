import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { debounce } from 'lodash';
import { ImageAdjustments } from '@/utils/imageAdjustments';

interface VectorAdjustmentsPanelProps {
  onAdjustmentsChange?: (adjustments: Partial<ImageAdjustments>) => void;
}

const VectorAdjustmentsPanel = ({ onAdjustmentsChange }: VectorAdjustmentsPanelProps) => {
  const handleChange = useCallback(
    debounce((key: keyof ImageAdjustments, value: any) => {
      onAdjustmentsChange?.({ [key]: value });
    }, 100),
    [onAdjustmentsChange]
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Configurações do Vetor</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Otimização Automática</Label>
          <Switch 
            defaultChecked={false}
            onCheckedChange={(checked) => handleChange('autoOptimize', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label>Precisão das Curvas</Label>
          <Slider 
            defaultValue={[75]} 
            onValueChange={([value]) => handleChange('vectorPrecision', value)}
            max={100} 
            step={1} 
          />
        </div>
        <div className="space-y-2">
          <Label>Simplificação de Caminhos</Label>
          <Slider 
            defaultValue={[50]} 
            onValueChange={([value]) => handleChange('pathSimplification', value)}
            max={100} 
            step={1} 
          />
        </div>
        <div className="space-y-2">
          <Label>Modo de Cor</Label>
          <RadioGroup 
            defaultValue="preserve"
            onValueChange={(value: 'preserve' | 'optimize' | 'monochrome') => 
              handleChange('colorMode', value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preserve" id="preserve" />
              <Label htmlFor="preserve">Preservar Cores</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="optimize" id="optimize" />
              <Label htmlFor="optimize">Otimizar Paleta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monochrome" id="monochrome" />
              <Label htmlFor="monochrome">Monocromático</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
};

export default VectorAdjustmentsPanel;