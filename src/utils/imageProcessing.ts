import { SVG, cleanupSVG, runSVGO, parseColors } from '@iconify/tools';
import { svg2png } from 'svg-png-converter';
import * as potrace from 'potrace';
import { ColorMode } from '@/types/vector';

export const optimizeSVG = async (svgString: string): Promise<string> => {
  const svg = new SVG(svgString);
  await cleanupSVG(svg);
  await runSVGO(svg);
  await parseColors(svg);
  return svg.toString();
};

export const convertSVGtoPNG = async (svgString: string): Promise<Buffer> => {
  const result = await svg2png({
    input: svgString,
    encoding: 'buffer',
    format: 'png',
  });
  return result as Buffer;
};

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
    potrace.trace(imageUrl, options, async (err: Error | null, svg: string) => {
      if (err) reject(err);
      
      try {
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
        
        // Otimiza o SVG usando @iconify/tools
        const optimizedSvg = await optimizeSVG(processedSvg);
        resolve(optimizedSvg);
      } catch (error) {
        reject(error);
      }
    });
  });
};