import * as fs from 'fs';
import { ansiGray, ansiGreen, ansiYellow } from './log';

export function diffJson(
  sourceLang: fs.PathOrFileDescriptor,
  targetLangCurrent: fs.PathOrFileDescriptor,
  targetLangPrevious: fs.PathOrFileDescriptor,
) {
  const source = JSON.parse(fs.readFileSync(sourceLang, 'utf8'));
  const current = JSON.parse(fs.readFileSync(targetLangCurrent, 'utf8'));
  const previous = JSON.parse(fs.readFileSync(targetLangPrevious, 'utf8'));

  let stringsChanged = 0;
  let stringsAdded = 0;

  console.log(
    `\n\nDifferences between ${targetLangCurrent} and ${targetLangPrevious} (based on ${sourceLang}):`,
  );

  for (const key in current) {
    if (current[key] !== previous[key]) {
      console.log(ansiGray(`${key}: ${source[key]} (changed)`));
      console.log(`${ansiYellow(previous[key])} => ${ansiGreen(current[key])}`);
      stringsChanged++;
    }
  }

  for (const key in previous) {
    if (!(key in current)) {
      console.log(ansiGray(`${key}: ${source[key]} (new)`));
      console.log(ansiGreen(`${current[key]}`));
      stringsAdded++;
    }
  }
  return { stringsChanged, stringsAdded };
}
