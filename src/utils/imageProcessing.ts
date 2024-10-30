import { SVG, cleanupSVG, runSVGO, parseColors } from '@iconify/tools';
import { svg2png } from 'svg-png-converter';
import { ColorMode } from '@/types/vector';
import ImageTracer from 'imagetracerjs';

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
    try {
      const svg = ImageTracer.imageToSVG(imageUrl, {
        ltres: options.optTolerance,
        qtres: options.optTolerance,
        pathomit: options.pathomit,
        colorsampling: colorMode === 'color' ? 1 : 0,
        numberofcolors: colorMode === 'blackwhite' ? 2 : 16,
        mincolorratio: 0,
        colorquantcycles: 3,
      });

      let processedSvg = svg;
      
      switch (colorMode) {
        case 'grayscale':
          processedSvg = svg.replace(/fill="[^"]*"/g, 'fill="#666666"');
          break;
        case 'blackwhite':
          processedSvg = svg.replace(/fill="[^"]*"/g, 'fill="#000000"');
          break;
      }

      resolve(processedSvg);
    } catch (error) {
      reject(new Error('Error processing vector: ' + (error as Error).message));
    }
  });
};