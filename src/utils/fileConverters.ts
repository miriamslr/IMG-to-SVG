import { jsPDF } from 'jspdf';

export const convertSvgToPdf = (svgContent: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Cria um elemento temporário para renderizar o SVG
    const container = document.createElement('div');
    container.innerHTML = svgContent;
    const svg = container.firstChild as SVGElement;
    
    // Converte SVG para canvas e depois para PDF
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage({
        imageData: imgData,
        format: 'PNG',
        x: 10,
        y: 10
      });
      const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
      resolve(pdfBlob);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  });
};

export const convertToAi = (svgContent: string): string => {
  // Simulação de conversão para AI
  return `%!PS-Adobe-3.0
%%Creator: Adobe Illustrator
${svgContent}
%%EOF`;
};

export const convertToCdr = (svgContent: string): string => {
  // Simulação de conversão para CDR
  return `@CorelDRAW
${svgContent}
@END`;
};