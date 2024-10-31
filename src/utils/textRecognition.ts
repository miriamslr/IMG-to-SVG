import { createWorker, PSM, OEM } from 'tesseract.js';

export interface RecognitionResult {
  text: string[];
  confidence: number;
}

export const recognizeText = async (file: File): Promise<RecognitionResult> => {
  const worker = await createWorker('eng+por');
  
  try {
    await worker.loadLanguage();
    await worker.reinitialize();
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
      preserve_interword_spaces: '1',
    });

    const result = await worker.recognize(file);
    
    const paragraphs = result.data.paragraphs
      .map(p => p.text.trim())
      .filter(text => text.length > 0);

    return {
      text: paragraphs,
      confidence: result.data.confidence
    };
  } finally {
    await worker.terminate();
  }
};