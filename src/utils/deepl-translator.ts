import type { SourceLanguageCode, TargetLanguageCode, TranslateTextOptions } from 'deepl-node';
import * as deepl from 'deepl-node';
import * as fs from 'fs';
import { debounce } from 'lodash-es';
import { hashString } from './hash-string';
import path from 'path';
import { pickLocale } from 'locale-matcher';
import { deepLAvailableTargetLangs } from './deepl-available-langs';

export class DeeplTranslator {
  private readonly translator: deepl.Translator;
  private cache: Map<string, string>;
  private readonly cacheFile: string;
  private readonly saveCache: typeof DeeplTranslator.prototype.saveCacheImpl;
  private stats: { deeplCacheHits: number; deeplCacheMisses: number } = {
    deeplCacheHits: 0,
    deeplCacheMisses: 0,
  };

  constructor(apiKey: string, cacheFile: string, noCache: boolean) {
    this.cacheFile = cacheFile;
    this.translator = new deepl.Translator(apiKey);
    this.cache = noCache ? new Map() : this.loadCache(this.cacheFile);
    this.saveCache = noCache ? () => {} : debounce(this.saveCacheImpl, 1000, { trailing: true }); // Debounce saveCache with a delay of 1000ms
  }

  private loadCache(cacheFilePath: string): Map<string, string> {
    if (fs.existsSync(cacheFilePath)) {
      const data = fs.readFileSync(cacheFilePath, 'utf-8');
      console.log(`Cache file ${cacheFilePath} exists, loading cache`);
      return new Map(Object.entries(JSON.parse(data)));
    }
    console.log(`Cache file ${cacheFilePath} does not exist, creating new cache`);
    // Ensure the directory exists
    const dir = path.dirname(cacheFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return new Map();
  }

  private saveCacheImpl(cacheFilePath: string): void {
    const data = JSON.stringify(Object.fromEntries(this.cache.entries()));
    fs.writeFileSync(cacheFilePath, data);
  }

  public translate = async (
    sourceLang: string,
    targetLang: string,
    formality: 'more' | 'less',
    text: string,
    context?: string,
  ): Promise<string> => {
    if (!text) {
      return '';
    }

    // Replace placeholders with their occurrence numbers
    const { newText, placeholders } = this.replacePlaceholders(text);

    const cacheKey = hashString(`${targetLang}:${newText}`);
    if (this.cache.has(cacheKey)) {
      this.stats.deeplCacheHits++;
      return this.cache.get(cacheKey) as string;
    }

    const matchedTargetLang = pickLocale(targetLang, deepLAvailableTargetLangs);
    if (!matchedTargetLang) {
      throw new Error(`Could not find a DeepL target language for ${targetLang}`);
    }

    const matchedSourceLang = pickLocale(sourceLang, deepLAvailableTargetLangs);
    if (!matchedSourceLang) {
      throw new Error(`Could not find a DeepL source language for ${sourceLang}`);
    }

    const languageOptions: TranslateTextOptions = {
      formality: formality === 'more' ? 'prefer_more' : 'prefer_less',
      preserveFormatting: true,
      context,
    };

    const translation = await this.translator.translateText(
      newText,
      matchedSourceLang as SourceLanguageCode,
      matchedTargetLang as TargetLanguageCode,
      languageOptions,
    );

    const result = this.restorePlaceholders(translation.text.replace('ß', 'ss'), placeholders);

    this.cache.set(cacheKey, result);
    this.saveCache(this.cacheFile);
    this.stats.deeplCacheMisses++;

    return result;
  };

  private replacePlaceholders(text: string): {
    newText: string;
    placeholders: Map<string, string>;
  } {
    const placeholders = new Map<string, string>();
    let newText = text;
    let match;
    const regex = /{{\s*([^}\s]+)\s*}}/g;

    while ((match = regex.exec(text)) !== null) {
      const placeholder = match[0];
      const value = match[1];
      if (!placeholders.has(value)) {
        placeholders.set(value, `{{${placeholders.size + 1}}}`);
      }
      newText = newText.replace(placeholder, placeholders.get(value) as string);
    }

    return { newText, placeholders };
  }

  private restorePlaceholders(text: string, placeholders: Map<string, string>): string {
    let restoredText = text;

    placeholders.forEach((newPlaceholder, originalValue) => {
      const escapedPlaceholder = newPlaceholder.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // escapes special characters
      restoredText = restoredText.replace(
        new RegExp(escapedPlaceholder, 'g'),
        `{{${originalValue}}}`,
      );
    });

    return restoredText;
  }

  public getStats() {
    return { ...this.stats, deeplCacheSize: this.cache.size };
  }
}
