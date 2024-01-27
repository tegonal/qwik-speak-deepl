#!/usr/bin/env node
import { qwikSpeakDeepL } from '../qwik-speak-deepl';
import { program } from 'commander';

program
  .requiredOption('-a, --apiKey <key>', 'DeepL API key')
  .option(
    '-c, --contextFile <path>',
    'A text file with context for better quality translations',
    'qwik-speak-deepl.context.txt',
  )
  .option('-nc, --noCache', "Don't use the existing cache", false)
  .option(
    '-f --formality <level>',
    "Formality level to use. Available options are 'less' or 'more'",
    'less',
  )
  .description('An application for translating text using DeepL')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ qwik-speak-deepl --help');
  });

program.parse(process.argv);

const options = program.opts();

export type QwikSpeakDeeplArgs = typeof options;
await qwikSpeakDeepL(options);
