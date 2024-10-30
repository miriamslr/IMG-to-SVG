import { ColorMode } from '@/types/vector';
import * as Potrace from 'potrace';

export const processVector = async (
  imageUrl: string, 
  options: {
    turdSize: number;
    alphaMax: number;
    threshold: number;
    optTolerance: number;
    pathomit: number;
  },
  colorMode: ColorMode
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      Potrace.trace(imageUrl, {
        turdSize: options.turdSize,
        alphaMax: options.alphaMax,
        threshold: options.threshold,
        optTolerance: options.optTolerance,
        pathomit: options.pathomit,
      }, (err: Error | null, svg: string) => {
        if (err) reject(err);
        
        let processedSvg = svg;
        
        switch (colorMode) {
          case 'color':
            processedSvg = svg.replace(/fill="[^"]*"/g, '');
            break;
          case 'grayscale':
            processedSvg = svg.replace(/fill="[^"]*"/g, 'fill="#666666"');
            break;
          case 'blackwhite':
            processedSvg = svg.replace(/fill="[^"]*"/g, 'fill="#000000"');
            break;
        }
        
        resolve(processedSvg);
      });
    } catch (error) {
      reject(new Error('Error processing vector: ' + (error as Error).message));
    }
  });
};