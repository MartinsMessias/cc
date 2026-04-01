import { isEnvDefinedFalsy } from '../../utils/envUtils.js'

export type SyntaxTheme = unknown
export type ColorModuleUnavailableReason = 'env' | 'missing'

type ColorDiffModule = {
  ColorDiff: unknown
  ColorFile: unknown
  getSyntaxTheme: (themeName: string) => SyntaxTheme | null
}

let cachedModule: ColorDiffModule | null | undefined

function loadColorDiffModule(): ColorDiffModule | null {
  if (cachedModule !== undefined) return cachedModule
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('color-diff-napi') as ColorDiffModule
  } catch {
    cachedModule = null
  }
  return cachedModule
}

/**
 * Returns a static reason why the color-diff module is unavailable, or null if available.
 * 'env' = disabled via CLAUDE_CODE_SYNTAX_HIGHLIGHT
 *
 * The TS port of color-diff works in all build modes, so the only way to
 * disable it is via the env var.
 */
export function getColorModuleUnavailableReason(): ColorModuleUnavailableReason | null {
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) {
    return 'env'
  }
  if (!loadColorDiffModule()) {
    return 'missing'
  }
  return null
}

export function expectColorDiff(): ColorDiffModule['ColorDiff'] | null {
  return getColorModuleUnavailableReason() === null
    ? loadColorDiffModule()?.ColorDiff ?? null
    : null
}

export function expectColorFile(): ColorDiffModule['ColorFile'] | null {
  return getColorModuleUnavailableReason() === null
    ? loadColorDiffModule()?.ColorFile ?? null
    : null
}

export function getSyntaxTheme(themeName: string): SyntaxTheme | null {
  return getColorModuleUnavailableReason() === null
    ? loadColorDiffModule()?.getSyntaxTheme(themeName) ?? null
    : null
}
