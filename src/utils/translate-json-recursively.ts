import type { DeeplTranslator } from './deepl-translator';
import { ansiGreen, ansiYellow } from './log';

export async function translateJsonRecursively(
  obj: Record<string, any>,
  sourceLanguage: string,
  targetLanguage: string,
  formality: 'more' | 'less',
  deepl: DeeplTranslator,
  context?: string,
) {
  const output: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      await translateJsonRecursively(
        value,
        sourceLanguage,
        targetLanguage,
        formality,
        deepl,
        context,
      );
      continue;
    }
    console.log(ansiYellow(`${sourceLanguage} > `), value);
    try {
      output[key] = await deepl.translate(
        sourceLanguage,
        targetLanguage,
        formality,
        value,
        context,
      );
    } catch (e) {
      console.error(`Error translating "${value}" to ${targetLanguage}`);
      throw e;
    }
    console.log(ansiGreen(`${targetLanguage} < `), output[key]);
  }
  return output;
}
