# A translator for qwik-speak language files using the DeepL API (free/pro)

## Features

- Translate qwik-speak extracted JSON files using the DeepL API
- Detects source and target languages automatically based on qwikSpeakInline() vite plugin configuration
- Matches the source/target language to the DeepL API language codes as good as possible and tells you if there is no match available
- Preserves dynamic placeholders like `{{name}}` and `{{count}}` without relying on `preserveFormatting`
- Caches each translated string in a local file to avoid unnecessary API calls
- Backups previous translations before writing the new string set
- Shows differences between the previous and the new string set
- Supports DeepL context by using the content of a text file and all aggregated source language strings

## Installation

```bash
npm add -D @tegonal/qwik-speak-deepl
yarn add -D @tegonal/qwik-speak-deepl
```

## Usage

Run the translator with the following command from the root of your qwik project:

```bash
# Runs with default options. This will determine the default language
# from your vite config and translate the source files to all available languages.
npx qwik-speak-deepl -a <deeplApiKey>
```

## A word on context

Single word strings are notoriously difficult to translate correctly without context.

For better translation quality, you can create a text file that is used to provide context for the translator in the root of your qwik project named `qwik-speak-deepl.context.txt` (or any other name, see command arguments). The contents of this file will be sent alongside each translation request. Additionally, all strings of the source language are added to context as well for good measure, to provide DeepL with the best possible starting point to find translations for single word strings.

The context file could contain a general summary of the kind of app you are building or its functionality. You can try different approaches and see what works best for you. For e-commerce, it could contain a list of brand or product names.

## Options

```bash
Usage: qwik-speak-deepl <command> [options]

Options:
  -a, --apiKey <key>        DeepL API key
  -c, --contextFile <path>  A text file with context for better quality translations (default:
                            "qwik-speak-deepl.context.txt")
  -nc, --noCache            Don't use the existing cache (default: false)
  -f, --formality <level>    Formality level to use. Available options are 'less' or 'more' (default:
                            "less")
  -h, --help                display help for command

Example call:
  $ qwik-speak-deepl --help
```
