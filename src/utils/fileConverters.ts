import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { prepareSvgForDownload } from './svgUtils';

export const convertSvgToPdf = (svgContent: string): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a temporary SVG element
      const container = document.createElement('div');
      container.innerHTML = prepareSvgForDownload(svgContent);
      const svg = container.firstElementChild as SVGElement;
      
      // Get SVG dimensions
      const svgWidth = svg.getAttribute('width') || '100';
      const svgHeight = svg.getAttribute('height') || '100';
      const width = parseFloat(svgWidth);
      const height = parseFloat(svgHeight);
      
      // Create PDF with appropriate dimensions
      const doc = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate scaling to fit the page while maintaining aspect ratio
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const scale = Math.min(
        pageWidth / width,
        pageHeight / height
      ) * 0.9; // 90% of max size for margins
      
      // Center the SVG on the page
      const x = (pageWidth - (width * scale)) / 2;
      const y = (pageHeight - (height * scale)) / 2;
      
      // Convert SVG to PDF
      await svg2pdf(svg, doc, {
        x,
        y,
        width: width * scale,
        height: height * scale
      });
      
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      reject(error);
    }
  });
};

export const convertSvgToImage = (svgContent: string, format: 'png' | 'jpeg'): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const container = document.createElement('div');
      container.innerHTML = svgContent;
      const svg = container.firstChild as SVGElement;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (format === 'png') {
          // For PNG, keep transparent background
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          // For JPEG, add white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, `image/${format}`, 1.0);
      };

      img.onerror = () => {
        reject(new Error('Failed to load SVG image'));
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      reject(error);
    }
  });
};
