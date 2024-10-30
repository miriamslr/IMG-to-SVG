import React from 'react';

interface PreviewPanelProps {
  title: string;
  children: React.ReactNode;
}

const PreviewPanel = ({ title, children }: PreviewPanelProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="border rounded-lg p-4 bg-gray-50 h-[400px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PreviewPanel;