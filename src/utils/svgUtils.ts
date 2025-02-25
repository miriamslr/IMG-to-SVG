export const prepareSvgForDownload = (svgContent: string, antiAlias: boolean = true): string => {
  let processedSvg = svgContent;
  
  // Adiciona viewBox se não existir
  if (!processedSvg.includes('viewBox')) {
    processedSvg = processedSvg.replace(/<svg/, '<svg viewBox="0 0 100 100"');
  }
  
  // Adiciona um fundo branco como primeiro elemento
  processedSvg = processedSvg.replace(/<svg([^>]*)>/, '<svg$1><rect width="100%" height="100%" fill="white"/>');
  
  // Remove qualquer fill="currentColor" e adiciona fill preto
  processedSvg = processedSvg.replace(/fill="currentColor"/g, 'fill="black"');
  
  // Remove qualquer fill="transparent" ou fill="none" e substitui por branco
  processedSvg = processedSvg.replace(/fill="(?:transparent|none)"/g, 'fill="white"');
  
  // Adiciona fill="black" em paths que não têm fill definido
  processedSvg = processedSvg.replace(/<path(?![^>]*fill=)/g, '<path fill="black"');
  
  // Garante que todos os elementos tenham um preenchimento definido
  processedSvg = processedSvg.replace(/<(rect|circle|ellipse|polygon|path)(?![^>]*fill=)/g, '<$1 fill="black"');
  
  // Adiciona shape-rendering para controlar o anti-aliasing
  if (antiAlias) {
    // Remove qualquer shape-rendering existente
    processedSvg = processedSvg.replace(/shape-rendering="[^"]*"/g, '');
    // Adiciona shape-rendering para suavização
    processedSvg = processedSvg.replace(/<svg/, '<svg shape-rendering="geometricPrecision"');
    // Adiciona atributos para melhor suavização
    processedSvg = processedSvg.replace(/<path/g, '<path vector-effect="non-scaling-stroke"');
  } else {
    // Remove qualquer shape-rendering existente
    processedSvg = processedSvg.replace(/shape-rendering="[^"]*"/g, '');
    // Adiciona shape-rendering para pixels nítidos
    processedSvg = processedSvg.replace(/<svg/, '<svg shape-rendering="crispEdges"');
  }
  
  return processedSvg;
};