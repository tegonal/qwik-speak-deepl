import { getQwikSpeakConfigFromViteConfig } from './utils/get-qwik-speak-config-from-vite-config';
import * as fs from 'fs';
import { DeeplTranslator } from './utils/deepl-translator';
import type { QwikSpeakDeeplArgs } from './bin/qwik-speak-deepl';
import { translateJsonRecursively } from './utils/translate-json-recursively';
import { ansiCyan } from './utils/log';
import path from 'path';
import { diffJson } from './utils/compare';

const VITE_CONFIG_TS = 'vite.config.ts';

const stats: Record<string, number> = {
  strings: 0,
  stringsTranslated: 0,
  stringsChanged: 0,
  stringsNew: 0,
};

function countKeys(json: Record<string, any>): number {
  let count = 0;

  for (const key in json) {
    count++;

    if (typeof json[key] === 'object' && json[key] !== null) {
      count += countKeys(json[key]);
    }
  }

  return count;
}

export async function qwikSpeakDeepL(args: QwikSpeakDeeplArgs) {
  if (args.apiKey === undefined) {
    throw new Error('Please provide a DeepL API key');
  }

  const qwikSpeakConfig = getQwikSpeakConfigFromViteConfig(VITE_CONFIG_TS);

  const sourceLanguage = qwikSpeakConfig.source;
  const assetsPath = qwikSpeakConfig.assetsPath;

  //   check if folder exists
  if (!fs.existsSync(assetsPath)) {
    throw new Error(`Could not find directory ${assetsPath}`);
  }
  //   check if language directories exist
  if (!fs.existsSync(`${assetsPath}/${sourceLanguage}`)) {
    throw new Error(`Could not find directory ${sourceLanguage}`);
  }
  for (const lang of qwikSpeakConfig.targets) {
    if (!fs.existsSync(`${assetsPath}/${lang}`)) {
      throw new Error(`Could not find directory ${lang}`);
    }
  }

  // load context file if available
  let context;
  if (fs.existsSync(args.contextFile)) {
    try {
      context = fs.readFileSync(args.contextFile, 'utf8');
    } catch (e) {
      console.error(`Error reading context file ${args.contextFile}`);
      throw e;
    }
  }

  const deepl = new DeeplTranslator(
    args.apiKey,
    path.join(assetsPath, `.cache/deepl-cache.json`),
    args.noCache,
  );

  let extendedContext = context;

  const sourceFiles = fs.readdirSync(`${assetsPath}/${sourceLanguage}`);
  for (const sourceFileName of sourceFiles) {
    const sourceFile = `${assetsPath}/${sourceLanguage}/${sourceFileName}`;

    console.log(ansiCyan('📄'), `Processing ${sourceFile}`);

    const sourceJson = fs.readFileSync(sourceFile, 'utf8');
    const sourceObj = JSON.parse(sourceJson);
    extendedContext += Array.from(new Set(Object.values(sourceObj))).join(' ') + '\n' || '';
    stats.strings += countKeys(sourceObj);

    for (const targetLanguage of qwikSpeakConfig.targets) {
      const targetFile = `${assetsPath}/${targetLanguage}/${sourceFileName}`;
      const filenameWithoutExtension = path.basename(targetFile, path.extname(targetFile));

      const targetFileBackup = `${path.dirname(targetFile)}/${filenameWithoutExtension}-${new Date().getTime()}.json`;
      if (fs.existsSync(targetFile)) {
        fs.copyFileSync(targetFile, targetFileBackup);
      }

      console.log(ansiCyan('🌐'), `Translating ${sourceFile} to ${targetLanguage}`);

      const target = await translateJsonRecursively(
        sourceObj,
        sourceLanguage,
        targetLanguage,
        args.formality,
        deepl,
        extendedContext,
      );

      stats.stringsTranslated += countKeys(target);

      fs.writeFileSync(targetFile, JSON.stringify(target, null, 2));
      const diffedStats = diffJson(sourceFile, targetFile, targetFileBackup);
      stats.stringsChanged += diffedStats.stringsChanged;
      stats.stringsNew += diffedStats.stringsAdded;
    }
  }

  console.log(`\n\nSource language: ${qwikSpeakConfig.source}`);
  console.log(`Target language(s): ${qwikSpeakConfig.targets.join(', ')}`);
  console.log(`Files processed: ${sourceFiles.length}`);
  console.log('Formality:', args.formality);

  console.log(`\n\n📊 Statistics:`);
  console.log(`Strings: ${stats.strings}`);
  console.log(`Strings translated: ${stats.stringsTranslated}`);
  console.log(`Strings changed: ${stats.stringsChanged}`);
  console.log(`Strings added: ${stats.stringsNew}`);
  console.log(`Total context length: ${extendedContext?.length || 0}`);
}
