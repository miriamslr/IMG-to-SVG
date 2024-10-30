import React from 'react';
import { Card } from '@/components/ui/card';
import { ColorMode } from '@/types/vector';
import VectorSlider from './vector-controls/VectorSlider';
import ColorModeSelector from './vector-controls/ColorModeSelector';

interface VectorOptions {
  colorMode: ColorMode;
  quality: number;
  turdSize: number;
  alphaMax: number;
  threshold: number;
  optTolerance: number;
  pathomit: number;
  lineThreshold: number;
  cornerThreshold: number;
  smoothing: number;
  optimizePaths: number;
}

interface VectorControlsProps {
  options: VectorOptions;
  onOptionsChange: (newOptions: Partial<VectorOptions>) => void;
}

const VectorControls = ({ options, onOptionsChange }: VectorControlsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Opções de Conversão</h3>
      
      <VectorSlider
        label="Tamanho Mínimo"
        tip="Define o tamanho mínimo dos objetos que serão detectados"
        value={options.turdSize}
        onChange={(value) => onOptionsChange({ turdSize: value })}
        min={1}
        max={10}
        step={1}
      />

      <VectorSlider
        label="Suavidade"
        tip="Controla a suavidade das curvas"
        value={options.alphaMax}
        onChange={(value) => onOptionsChange({ alphaMax: value })}
        min={0}
        max={1}
        step={0.1}
      />

      <VectorSlider
        label="Contraste"
        tip="Define o limite entre preto e branco"
        value={options.threshold}
        onChange={(value) => onOptionsChange({ threshold: value })}
        min={0}
        max={255}
        step={1}
      />

      <VectorSlider
        label="Simplificação"
        tip="Controla a simplificação do traçado"
        value={options.pathomit}
        onChange={(value) => onOptionsChange({ pathomit: value })}
        min={0}
        max={20}
        step={1}
      />

      <VectorSlider
        label="Qualidade"
        tip="Ajusta a qualidade geral da vetorização"
        value={options.quality}
        onChange={(value) => onOptionsChange({ quality: value })}
        min={0}
        max={1}
        step={0.1}
      />

      <VectorSlider
        label="Tolerância"
        tip="Tolerância na otimização de curvas"
        value={options.optTolerance}
        onChange={(value) => onOptionsChange({ optTolerance: value })}
        min={0}
        max={1}
        step={0.1}
      />

      <VectorSlider
        label="Limiar de Linha"
        tip="Ajusta a detecção de linhas retas"
        value={options.lineThreshold}
        onChange={(value) => onOptionsChange({ lineThreshold: value })}
        min={0}
        max={5}
        step={0.1}
      />

      <VectorSlider
        label="Limiar de Canto"
        tip="Ajusta a detecção de cantos"
        value={options.cornerThreshold}
        onChange={(value) => onOptionsChange({ cornerThreshold: value })}
        min={0}
        max={180}
        step={1}
      />

      <VectorSlider
        label="Suavização"
        tip="Nível de suavização das curvas"
        value={options.smoothing}
        onChange={(value) => onOptionsChange({ smoothing: value })}
        min={0}
        max={2}
        step={0.1}
      />

      <VectorSlider
        label="Otimização"
        tip="Nível de otimização dos caminhos"
        value={options.optimizePaths}
        onChange={(value) => onOptionsChange({ optimizePaths: value })}
        min={0}
        max={2}
        step={0.1}
      />

      <ColorModeSelector
        value={options.colorMode}
        onChange={(value) => onOptionsChange({ colorMode: value })}
      />
    </Card>
  );
};

export default VectorControls;