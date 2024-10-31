import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls = ({
  zoom,
  onZoomChange,
  onZoomIn,
  onZoomOut
}: ZoomControlsProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Arraste para mover</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomOut}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-32">
            <Slider
              value={[zoom]}
              onValueChange={([value]) => onZoomChange(value)}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomIn}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[3rem]">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};