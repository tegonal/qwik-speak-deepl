import { existsSync, readFileSync } from 'fs';

interface QwikSpeakProperties {
  supportedLangs?: string[];
  defaultLang?: string;
  assetsPath?: string;

  [key: string]: string | string[] | undefined;
}

function extractQwikSpeakConfig(viteConfig: string) {
  const qwikSpeakRegex = /qwikSpeakInline\(([\s\S]*?)\)/;
  const qwikSpeakMatch = viteConfig.match(qwikSpeakRegex);

  let contentWithinBrackets;

  if (qwikSpeakMatch) {
    contentWithinBrackets = qwikSpeakMatch[1];
  }

  if (!contentWithinBrackets) {
    throw new Error('Could not find qwikSpeakInline() in your vite config');
  }

  const propertiesRegex = /(supportedLangs|defaultLang|assetsPath):\s*(\[[^\]]+\]|'[^']+')/g;
  const properties: QwikSpeakProperties = {};
  let match;

  while ((match = propertiesRegex.exec(contentWithinBrackets)) !== null) {
    const key = match[1];
    let value: string | string[] = match[2];

    if (key === 'supportedLangs') {
      value = value
        .slice(1, -1)
        .split(',')
        .map((lang) => lang.trim().replace(/'/g, ''));
    } else {
      value = value.slice(1, -1);
    }

    properties[key] = value;
  }

  if (!properties.supportedLangs || !properties.defaultLang) {
    throw new Error('Could not find supportedLangs or defaultLang in your vite config');
  }

  return {
    assetsPath: properties.assetsPath || 'i18n',
    supportedLangs: properties.supportedLangs,
    defaultLang: properties.defaultLang,
  };
}

export function getQwikSpeakConfigFromViteConfig(filename: string) {
  if (!existsSync(filename)) {
    throw new Error(`Could not find ${filename}`);
  }

  const viteConfig = readFileSync(filename, 'utf8');
  const qwikSpeakConfig = extractQwikSpeakConfig(viteConfig);

  return {
    assetsPath: qwikSpeakConfig.assetsPath,
    source: qwikSpeakConfig.defaultLang,
    targets: qwikSpeakConfig.supportedLangs.filter(
      (lang: string) => lang !== qwikSpeakConfig.defaultLang,
    ),
  };
}
