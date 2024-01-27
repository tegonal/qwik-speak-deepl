export function ansiGreen(text: string) {
  return `\x1b[32m${text}\x1b[0m`;
}

export function ansiYellow(text: string) {
  return `\x1b[33m${text}\x1b[0m`;
}

export function ansiRed(text: string) {
  return `\x1b[31m${text}\x1b[0m`;
}

export function ansiCyan(text: string) {
  return `\x1b[36m${text}\x1b[0m`;
}

export function ansiBlue(text: string) {
  return `\x1b[34m${text}\x1b[0m`;
}

export function ansiGray(text: string) {
  return `\x1b[90m${text}\x1b[0m`;
}
