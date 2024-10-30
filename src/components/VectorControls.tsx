import React from 'react';
import { Card } from '@/components/ui/card';
import VectorSlider from './vector-controls/VectorSlider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import DownloadButtons from './vector-controls/DownloadButtons';

interface VectorOptions {
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
  isProcessing: boolean;
  vectorSvg?: string;
}

const VectorControls = ({ options, onOptionsChange, isProcessing, vectorSvg }: VectorControlsProps) => {
  return (
    <Card className="p-4 shadow-lg border-2 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <h3 className="text-xl font-semibold mb-4 text-center px-2">Opções de Conversão</h3>
      
      {vectorSvg && (
        <>
          <div className="px-2">
            <DownloadButtons vectorSvg={vectorSvg} />
          </div>
          <Separator className="my-4" />
        </>
      )}

      <ScrollArea className="flex-1 w-full pr-4">
        <div className="space-y-6 px-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Ajustes Básicos</h4>
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
              label="Contraste"
              tip="Define o limite entre preto e branco"
              value={options.threshold}
              onChange={(value) => onOptionsChange({ threshold: value })}
              min={0}
              max={255}
              step={1}
            />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Ajustes de Traçado</h4>
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
              label="Simplificação"
              tip="Controla a simplificação do traçado"
              value={options.pathomit}
              onChange={(value) => onOptionsChange({ pathomit: value })}
              min={0}
              max={20}
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
          </div>

          <Separator />

          <div className="pb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Ajustes Avançados</h4>
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
              label="Otimização"
              tip="Nível de otimização dos caminhos"
              value={options.optimizePaths}
              onChange={(value) => onOptionsChange({ optimizePaths: value })}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default VectorControls;