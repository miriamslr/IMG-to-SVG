import { Jimp } from 'jimp';

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  vectorPrecision: number;
  pathSimplification: number;
  autoOptimize: boolean;
  colorMode: 'preserve' | 'optimize' | 'monochrome';
  smoothEdges: boolean;
  noiseReduction: boolean;
  effectIntensity: number;
}

export const processImageAdjustments = async (
  imageUrl: string,
  adjustments: ImageAdjustments
): Promise<string> => {
  const image = await Jimp.read(imageUrl);

  // Normalize values from 0-100 to Jimp's ranges
  const brightness = (adjustments.brightness - 50) / 50;
  const contrast = (adjustments.contrast - 50) / 25;
  const saturation = (adjustments.saturation - 50) / 25;

  // Apply adjustments
  image
    .brightness(brightness)
    .contrast(contrast)
    .color([
      { apply: 'saturate', params: [saturation] }
    ]);

  // Apply noise reduction if enabled
  if (adjustments.noiseReduction) {
    image.blur(adjustments.effectIntensity / 50);
  }

  // Apply edge smoothing if enabled
  if (adjustments.smoothEdges) {
    image.gaussian(adjustments.effectIntensity / 50);
  }

  // Convert to monochrome if selected
  if (adjustments.colorMode === 'monochrome') {
    image.greyscale();
  }

  // Return as base64
  return await image.getBase64Async(Jimp.MIME_PNG);
};