import pdfkit from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';

export const convertSvgToPdf = (svgContent: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new pdfkit();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBlob = new Blob([Buffer.concat(chunks)], { type: 'application/pdf' });
        resolve(pdfBlob);
      });

      SVGtoPDF(doc, svgContent, 0, 0);
      doc.end();
    } catch (error) {
      reject(error);
    }
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