import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DownloadButtonsProps {
  onDownload: (format: 'svg' | 'pdf' | 'ai' | 'cdr') => void;
}

const DownloadButtons = ({ onDownload }: DownloadButtonsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Button onClick={() => onDownload('svg')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        SVG
      </Button>
      <Button onClick={() => onDownload('pdf')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
      <Button onClick={() => onDownload('ai')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        AI
      </Button>
      <Button onClick={() => onDownload('cdr')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        CDR
      </Button>
    </div>
  );
};

export default DownloadButtons;