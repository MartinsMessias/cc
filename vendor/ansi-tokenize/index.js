export function tokenize(input) {
  return input
    .split(/(\x1b\[[0-9;]*m)/g)
    .filter(Boolean)
    .map(part =>
      /^\x1b\[[0-9;]*m$/.test(part)
        ? { type: 'ansi', code: part, value: '', fullWidth: false, endCode: part }
        : { type: 'text', value: part, fullWidth: false },
    )
}

export function ansiCodesToString(codes) {
  return (codes || []).map(c => c.code).join('')
}

export function reduceAnsiCodes(codes) {
  return codes || []
}

export function undoAnsiCodes() {
  return []
}

export function diffAnsiCodes(fromCodes, toCodes) {
  if (!fromCodes || !toCodes) return toCodes || []
  if (fromCodes.length === toCodes.length && fromCodes.every((c, i) => c.code === toCodes[i]?.code)) {
    return []
  }
  return toCodes
}

export function styledCharsFromTokens(tokens) {
  const out = []
  for (const token of tokens || []) {
    if (token.type === 'text') {
      for (const ch of [...token.value]) {
        out.push({
          value: ch,
          fullWidth: false,
          style: [],
          hyperlink: undefined,
        })
      }
    }
  }
  return out
}
