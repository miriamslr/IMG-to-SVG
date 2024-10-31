export const prepareSvgForDownload = (svgContent: string): string => {
  // Remove qualquer fill="currentColor" e adiciona fill preto
  let processedSvg = svgContent.replace(/fill="currentColor"/g, 'fill="black"');
  
  // Remove qualquer fill="transparent" ou fill="none"
  processedSvg = processedSvg.replace(/fill="(?:transparent|none)"/g, 'fill="white"');
  
  // Adiciona fill="black" em paths que não têm fill definido
  processedSvg = processedSvg.replace(/<path(?![^>]*fill=)/g, '<path fill="black"');
  
  return processedSvg;
};