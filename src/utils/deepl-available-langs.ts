// https://www.deepl.com/docs-api/translate-text/translate-text
// This is a copy/paste of the available langs from the deepl docs
// Last update: 2024-01-25
import { compact } from 'lodash-es';

const avaliableTargetLangs = `
BG - Bulgarian
CS - Czech
DA - Danish
DE - German
EL - Greek
EN-GB - English (British)
EN-US - English (American)
ES - Spanish
ET - Estonian
FI - Finnish
FR - French
HU - Hungarian
ID - Indonesian
IT - Italian
JA - Japanese
KO - Korean
LT - Lithuanian
LV - Latvian
NB - Norwegian (Bokmål)
NL - Dutch
PL - Polish
PT - Portuguese (unspecified variant for backward compatibility; please select PT-BR or PT-PT instead)
PT-BR - Portuguese (Brazilian)
PT-PT - Portuguese (all Portuguese varieties excluding Brazilian Portuguese)
RO - Romanian
RU - Russian
SK - Slovak
SL - Slovenian
SV - Swedish
TR - Turkish
UK - Ukrainian
ZH - Chinese (simplified)
`;

const availableSourceLangs = `
BG - Bulgarian
CS - Czech
DA - Danish
DE - German
EL - Greek
EN - English
ES - Spanish
ET - Estonian
FI - Finnish
FR - French
HU - Hungarian
ID - Indonesian
IT - Italian
JA - Japanese
KO - Korean
LT - Lithuanian
LV - Latvian
NB - Norwegian (Bokmål)
NL - Dutch
PL - Polish
PT - Portuguese (all Portuguese varieties mixed)
RO - Romanian
RU - Russian
SK - Slovak
SL - Slovenian
SV - Swedish
TR - Turkish
UK - Ukrainian
ZH - Chinese (simplified)`;

export const deepLAvailableTargetLangs = compact(
  avaliableTargetLangs.split('\n').map((line) => line.split(' - ')[0].toLowerCase()),
);
export const deepLAvailableSourceLangs = compact(
  availableSourceLangs.split('\n').map((line) => line.split(' - ')[0].toLowerCase()),
);
