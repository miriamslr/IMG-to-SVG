interface RGB {
  r: number;
  g: number;
  b: number;
}

// Converte cor RGB para HSL para melhor análise
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Extrai cores dominantes de uma imagem
export const extractDominantColors = async (imageUrl: string, numColors: number = 5): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels: RGB[] = [];

      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] > 128) { // Considera apenas pixels não transparentes
          pixels.push({
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2]
          });
        }
      }

      // Implementa o algoritmo K-means para clustering de cores
      const kMeans = (pixels: RGB[], k: number): RGB[] => {
        // Inicializa centroides aleatórios
        let centroids: RGB[] = Array.from({ length: k }, () => ({
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256)
        }));

        const maxIterations = 20;
        let iteration = 0;
        let oldCentroids: RGB[] = [];

        while (iteration < maxIterations) {
          // Agrupa pixels por centroide mais próximo
          const clusters: RGB[][] = Array.from({ length: k }, () => []);
          
          pixels.forEach(pixel => {
            let minDist = Infinity;
            let closestCentroid = 0;

            centroids.forEach((centroid, i) => {
              const dist = Math.sqrt(
                Math.pow(pixel.r - centroid.r, 2) +
                Math.pow(pixel.g - centroid.g, 2) +
                Math.pow(pixel.b - centroid.b, 2)
              );
              if (dist < minDist) {
                minDist = dist;
                closestCentroid = i;
              }
            });

            clusters[closestCentroid].push(pixel);
          });

          // Atualiza centroides
          oldCentroids = [...centroids];
          clusters.forEach((cluster, i) => {
            if (cluster.length > 0) {
              const avgColor = cluster.reduce(
                (acc, pixel) => ({
                  r: acc.r + pixel.r / cluster.length,
                  g: acc.g + pixel.g / cluster.length,
                  b: acc.b + pixel.b / cluster.length
                }),
                { r: 0, g: 0, b: 0 }
              );
              centroids[i] = avgColor;
            }
          });

          // Verifica convergência
          const centroidsMoved = centroids.some((centroid, i) => 
            Math.abs(centroid.r - oldCentroids[i].r) > 1 ||
            Math.abs(centroid.g - oldCentroids[i].g) > 1 ||
            Math.abs(centroid.b - oldCentroids[i].b) > 1
          );

          if (!centroidsMoved) break;
          iteration++;
        }

        return centroids;
      };

      // Obtém as cores dominantes
      const dominantColors = kMeans(pixels, numColors);

      // Converte cores RGB para formato hexadecimal
      const colorHexes = dominantColors.map(color => {
        const r = Math.round(color.r).toString(16).padStart(2, '0');
        const g = Math.round(color.g).toString(16).padStart(2, '0');
        const b = Math.round(color.b).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      });

      resolve(colorHexes);
    };

    img.src = imageUrl;
  });
};

// Mapeia cores para os paths do SVG baseado em luminosidade
export const mapColorsToSvgPaths = (svg: string, colors: string[]): string => {
  if (colors.length === 0) return svg;

  // Ordena cores por luminosidade
  const sortedColors = [...colors].sort((a, b) => {
    const [, , l1] = rgbToHsl(
      parseInt(a.slice(1, 3), 16),
      parseInt(a.slice(3, 5), 16),
      parseInt(a.slice(5, 7), 16)
    );
    const [, , l2] = rgbToHsl(
      parseInt(b.slice(1, 3), 16),
      parseInt(b.slice(3, 5), 16),
      parseInt(b.slice(5, 7), 16)
    );
    return l1 - l2;
  });

  // Substitui cores nos paths do SVG
  let pathIndex = 0;
  return svg.replace(/<path([^>]*)>/g, (match, attrs) => {
    const color = sortedColors[pathIndex % sortedColors.length];
    pathIndex++;
    return `<path${attrs} fill="${color}">`;
  });
};