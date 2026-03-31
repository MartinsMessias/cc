import type { LocalCommandCall } from '../../types/command.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'

type ParsedArgs = {
  model?: string
  base?: string
  token?: string
}

function parseSetArgs(args: string): ParsedArgs {
  const parsed: ParsedArgs = {}
  const regex = /(\w+)=(".*?"|'.*?'|\S+)/g
  for (const match of args.matchAll(regex)) {
    const key = match[1]?.toLowerCase()
    const rawValue = match[2] ?? ''
    const value = rawValue.replace(/^['"]|['"]$/g, '').trim()
    if (!value) continue
    if (key === 'model') parsed.model = value
    if (key === 'base' || key === 'baseurl') parsed.base = value
    if (key === 'token' || key === 'apikey') parsed.token = value
  }
  return parsed
}

function persistEnv(changes: Record<string, string | undefined>): void {
  saveGlobalConfig(current => {
    const nextEnv = { ...(current.env ?? {}) }
    for (const [key, value] of Object.entries(changes)) {
      if (!value) {
        delete nextEnv[key]
      } else {
        nextEnv[key] = value
      }
    }
    return {
      ...current,
      env: nextEnv,
    }
  })
}

function applyRuntimeEnv(changes: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(changes)) {
    if (!value) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

function buildShowText(): string {
  const model = process.env.MODEL_GATEWAY_MODEL ?? '(not set)'
  const base = process.env.MODEL_GATEWAY_BASE_URL ?? '(not set)'
  const hasToken = !!(
    process.env.MODEL_GATEWAY_AUTH_TOKEN || process.env.MODEL_GATEWAY_API_KEY
  )
  return [
    'BYOM gateway config:',
    `- model: ${model}`,
    `- base: ${base}`,
    `- token: ${hasToken ? '[configured]' : '[not configured]'}`,
    '',
    'Use: /byom set model=<id> base=<url> token=<secret>',
  ].join('\n')
}

export const call: LocalCommandCall = async args => {
  const trimmed = args.trim()
  if (!trimmed || trimmed === 'show') {
    return { type: 'text', value: buildShowText() }
  }

  if (trimmed === 'clear') {
    const clearKeys = {
      MODEL_GATEWAY_MODEL: undefined,
      MODEL_GATEWAY_BASE_URL: undefined,
      MODEL_GATEWAY_AUTH_TOKEN: undefined,
      MODEL_GATEWAY_API_KEY: undefined,
    }
    persistEnv(clearKeys)
    applyRuntimeEnv(clearKeys)
    return {
      type: 'text',
      value: 'BYOM gateway config cleared.',
    }
  }

  if (trimmed.startsWith('set ')) {
    const parsed = parseSetArgs(trimmed.slice(4))
    if (!parsed.model || !parsed.base) {
      return {
        type: 'text',
        value:
          'Missing required fields. Use: /byom set model=<id> base=<url> [token=<secret>]',
      }
    }

    try {
      new URL(parsed.base)
    } catch {
      return {
        type: 'text',
        value: `Invalid base URL: ${parsed.base}`,
      }
    }

    const changes: Record<string, string | undefined> = {
      MODEL_GATEWAY_MODEL: parsed.model,
      MODEL_GATEWAY_BASE_URL: parsed.base,
      ...(parsed.token ? { MODEL_GATEWAY_AUTH_TOKEN: parsed.token } : {}),
    }

    persistEnv(changes)
    applyRuntimeEnv(changes)

    return {
      type: 'text',
      value: `BYOM configurado para '${parsed.model}'. Base: ${parsed.base}`,
    }
  }

  return {
    type: 'text',
    value:
      'Uso: /byom show | /byom clear | /byom set model=<id> base=<url> [token=<secret>]',
  }
}
