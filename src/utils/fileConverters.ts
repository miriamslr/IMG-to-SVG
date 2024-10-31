import { jsPDF } from 'jspdf';
import SVGtoPDF from 'svg-to-pdfkit';
import PDFDocument from 'pdfkit';

export const convertSvgToPdf = (svgContent: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Cria um elemento temporário para obter as dimensões do SVG
    const container = document.createElement('div');
    container.innerHTML = svgContent;
    const svg = container.firstChild as SVGElement;
    
    // Obtém as dimensões do SVG
    const width = parseFloat(svg.getAttribute('width') || '100');
    const height = parseFloat(svg.getAttribute('height') || '100');
    
    // Calcula a escala para caber na página PDF (assumindo página A4)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const scale = Math.min(pageWidth / width, pageHeight / height) * 0.9; // 90% do tamanho da página
    
    // Calcula a posição centralizada
    const x = (pageWidth - (width * scale)) / 2;
    const y = (pageHeight - (height * scale)) / 2;
    
    // Adiciona o SVG diretamente ao PDF
    doc.svg(svgContent, {
      x,
      y,
      width: width * scale,
      height: height * scale
    });
    
    const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    resolve(pdfBlob);
  });
};

export const convertSvgToImage = (svgContent: string, format: 'png' | 'jpeg'): Promise<Blob> => {
  return new Promise((resolve) => {
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
        // Para PNG, mantemos o fundo transparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // Para JPEG, adicionamos fundo branco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, `image/${format}`, 1.0);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  });
};