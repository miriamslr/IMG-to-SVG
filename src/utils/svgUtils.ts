export const prepareSvgForDownload = (svgContent: string): string => {
  let processedSvg = svgContent;
  
  // Define dimensões padrão se não existirem
  if (!processedSvg.includes('width=')) {
    processedSvg = processedSvg.replace(/<svg/, '<svg width="100%"');
  }
  if (!processedSvg.includes('height=')) {
    processedSvg = processedSvg.replace(/<svg/, '<svg height="100%"');
  }
  
  // Adiciona viewBox se não existir
  if (!processedSvg.includes('viewBox')) {
    processedSvg = processedSvg.replace(/<svg/, '<svg viewBox="0 0 100 100"');
  }
  
  // Garante que o SVG tenha fundo branco
  if (!processedSvg.includes('style=')) {
    processedSvg = processedSvg.replace(/<svg/, '<svg style="background:white"');
  } else {
    processedSvg = processedSvg.replace(/style="([^"]*)"/, (match, style) => 
      `style="${style};background:white"`
    );
  }
  
  // Garante que todos os elementos tenham preenchimento preto por padrão
  processedSvg = processedSvg.replace(/<(rect|circle|ellipse|polygon|path)(?![^>]*fill=)/g, '<$1 fill="black"');
  
  return processedSvg;
};