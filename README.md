# A translator for qwik-speak language files using the DeepL API (free/pro)

## Features

- Translate qwik-speak extracted JSON files using the DeepL API
- Detects source and target languages automatically based on qwikSpeakInline() vite plugin configuration
- Matches the source/target language to the DeepL API language codes as best as possible and tells you if there is no match available
- Preserves dynamic placeholders like `{{name}}` and `{{count}}` withour relying on `preserverFormatting`
- Caches each translated string in a local file to avoid unnecessary API calls
- Backups previous translations before writing the new string set
- Shows differences between the previous and the new string set
- Supports DeepL context by using the content of a text file and all aggregated source language strings

## Installation

```bash
npm add -D @tegonal/qwik-speak-deepl
yaml add -D @tegonal/qwik-speak-deepl
```

## Usage

Run the translator with the following command from the root of your qwik project:

```bash
npx qwik-speak-deepl -a <deeplApiKey>
```

## Options

```bash
Usage: qwik-speak-deepl <command> [options]

Options:
  -a, --apiKey <key>        DeepL API key
  -c, --contextFile <path>  A text file with context for better quality translations (default:
                            "qwik-speak-deepl.context.txt")
  -nc, --noCache            Don't use the existing cache (default: false)
  -f --formality <level>    Formality level to use. Available options are 'less' or 'more' (default:
                            "less")
  -h, --help                display help for command

Example call:
  $ qwik-speak-deepl --help
```
