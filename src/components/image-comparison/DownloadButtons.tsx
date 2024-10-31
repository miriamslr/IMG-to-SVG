import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { handleDownload } from '@/utils/downloadUtils';

interface DownloadButtonsProps {
  vectorContent: string;
}

export const DownloadButtons = ({ vectorContent }: DownloadButtonsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Button onClick={() => handleDownload(vectorContent, 'svg')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        SVG
      </Button>
      <Button onClick={() => handleDownload(vectorContent, 'pdf')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
      <Button onClick={() => handleDownload(vectorContent, 'ai')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        AI
      </Button>
      <Button onClick={() => handleDownload(vectorContent, 'cdr')} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        CDR
      </Button>
    </div>
  );
};