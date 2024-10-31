export const prepareSvgForDownload = (svgContent: string): string => {
  // Adiciona viewBox se não existir
  if (!svgContent.includes('viewBox')) {
    svgContent = svgContent.replace(/<svg/, '<svg viewBox="0 0 100 100"');
  }
  
  // Adiciona width e height se não existirem
  if (!svgContent.includes('width=')) {
    svgContent = svgContent.replace(/<svg/, '<svg width="100%"');
  }
  if (!svgContent.includes('height=')) {
    svgContent = svgContent.replace(/<svg/, '<svg height="100%"');
  }

  // Adiciona preserveAspectRatio
  if (!svgContent.includes('preserveAspectRatio')) {
    svgContent = svgContent.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');
  }

  // Adiciona style com background branco
  if (!svgContent.includes('style=')) {
    svgContent = svgContent.replace(/<svg/, '<svg style="background:white"');
  }
  
  // Garante que todos os elementos tenham um preenchimento definido
  svgContent = svgContent.replace(/<(rect|circle|ellipse|polygon|path)(?![^>]*fill=)/g, '<$1 fill="black"');
  
  return svgContent;
};