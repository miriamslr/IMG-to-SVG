import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface ImageComparisonProps {
  originalImage: string | null;
  vectorImage: string;
}

const ImageComparison = ({ originalImage, vectorImage }: ImageComparisonProps) => {
  if (!originalImage) return null;

  return (
    <div className="relative w-full aspect-[4/3] border rounded-lg overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50}>
          <div className="h-full">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
              BEFORE
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="h-full" dangerouslySetInnerHTML={{ __html: vectorImage }} />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 text-sm rounded">
            AFTER
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageComparison;