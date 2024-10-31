interface FontMatch {
  name: string;
  confidence: number;
}

const commonFonts = [
  { name: 'Arial', characteristics: ['sans-serif', 'neutral', 'modern'] },
  { name: 'Helvetica', characteristics: ['sans-serif', 'neutral', 'modern'] },
  { name: 'Times New Roman', characteristics: ['serif', 'traditional'] },
  { name: 'Georgia', characteristics: ['serif', 'elegant'] },
  { name: 'Verdana', characteristics: ['sans-serif', 'screen-optimized'] },
  { name: 'Roboto', characteristics: ['sans-serif', 'modern', 'geometric'] },
  { name: 'Open Sans', characteristics: ['sans-serif', 'neutral', 'friendly'] },
  { name: 'Montserrat', characteristics: ['sans-serif', 'geometric', 'modern'] }
];

export const detectFonts = async (imageFile: File): Promise<FontMatch[]> => {
  // Simulated font detection based on image characteristics
  // In a real implementation, this would use ML or more sophisticated analysis
  const matches: FontMatch[] = [];
  
  // Add fonts with varying confidence levels
  commonFonts.forEach(font => {
    if (Math.random() > 0.6) { // Simulate detection threshold
      matches.push({
        name: font.name,
        confidence: Math.round((0.7 + Math.random() * 0.3) * 100) / 100
      });
    }
  });
  
  // Sort by confidence
  return matches.sort((a, b) => b.confidence - a.confidence);
};