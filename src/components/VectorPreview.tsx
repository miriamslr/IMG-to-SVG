import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ColorMode } from '@/types/vector';

interface VectorPreviewProps {
  svgContent: string;
  recognizedText: string[];
  detectedFonts: string[];
  colorMode: ColorMode;
}

const VectorPreview = ({ svgContent, recognizedText, detectedFonts, colorMode }: VectorPreviewProps) => {
  const handleDownload = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vector-${colorMode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Resultado Vetorial ({colorMode})</h3>
          <div className="border rounded-lg p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>

        {recognizedText.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Texto Reconhecido</h3>
            <div className="space-y-2">
              {recognizedText.map((text, index) => (
                <p key={index} className="text-gray-700">{text}</p>
              ))}
            </div>
          </div>
        )}

        {detectedFonts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Fontes Detectadas</h3>
            <div className="flex flex-wrap gap-2">
              {detectedFonts.map((font, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {font}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleDownload} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download SVG
        </Button>
      </div>
    </div>
  );
};

export default VectorPreview;