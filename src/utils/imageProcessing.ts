import { toast } from "@/components/ui/use-toast";
import { recognizeText } from "./textRecognition";
import { detectFonts } from "./fontDetection";
import * as potrace from 'potrace';

export interface VectorResult {
  svg: string;
  text: string[];
  fonts: { name: string; confidence: number; }[];
}

export interface ProcessingOptions {
  turdSize: number;
  alphaMax: number;
  threshold: number;
  optTolerance: number;
  pathomit: number;
}

export const processVectorImage = async (
  file: File,
  options: ProcessingOptions,
  onResult: (result: VectorResult) => void
) => {
  try {
    const [textResult, fontMatches] = await Promise.all([
      recognizeText(file),
      detectFonts(file)
    ]);

    const reader = new FileReader();
    reader.onload = () => {
      const params: potrace.Params = {
        turdSize: options.turdSize,
        alphaMax: options.alphaMax,
        threshold: options.threshold,
        optCurve: true,
        optTolerance: options.optTolerance,
        pathomit: options.pathomit,
      };

      potrace.trace(reader.result as string, params, (err: Error | null, svg: string) => {
        if (err) throw err;

        const result = {
          svg,
          text: textResult.text,
          fonts: fontMatches
        };

        onResult(result);

        if (textResult.confidence > 90) {
          toast({
            title: "Texto reconhecido com alta confiança",
            description: `${textResult.text.length} elementos de texto identificados.`
          });
        }
      });
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error processing image:', error);
    toast({
      title: "Erro no processamento",
      description: "Ocorreu um erro ao processar a imagem.",
      variant: "destructive"
    });
  }
};