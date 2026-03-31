import type { LocalCommandCall } from '../../types/command.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'

type ParsedArgs = {
  model?: string
  base?: string
  authToken?: string
  apiKey?: string
  headers?: string
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
    if (key === 'token') parsed.authToken = value
    if (key === 'apikey') parsed.apiKey = value
    if (key === 'headers') parsed.headers = value
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
  const config = getGlobalConfig()
  const savedEnv = config.env ?? {}
  const model =
    process.env.MODEL_GATEWAY_MODEL ??
    savedEnv.MODEL_GATEWAY_MODEL ??
    '(not set)'
  const base =
    process.env.MODEL_GATEWAY_BASE_URL ??
    savedEnv.MODEL_GATEWAY_BASE_URL ??
    '(not set)'
  const hasToken = !!(
    process.env.MODEL_GATEWAY_AUTH_TOKEN ||
    process.env.MODEL_GATEWAY_API_KEY ||
    savedEnv.MODEL_GATEWAY_AUTH_TOKEN ||
    savedEnv.MODEL_GATEWAY_API_KEY
  )
  return [
    'BYOM gateway config:',
    `- model: ${model}`,
    `- base: ${base}`,
    `- token: ${hasToken ? '[configured]' : '[not configured]'}`,
    '',
    'Use: /byom set model=<id> base=<url> [token=<secret>|apikey=<secret>] [headers="Name: Value"]',
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
      MODEL_GATEWAY_CUSTOM_HEADERS: undefined,
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
    const config = getGlobalConfig()
    const savedEnv = config.env ?? {}
    const nextModel =
      parsed.model ??
      process.env.MODEL_GATEWAY_MODEL ??
      savedEnv.MODEL_GATEWAY_MODEL
    const nextBase =
      parsed.base ??
      process.env.MODEL_GATEWAY_BASE_URL ??
      savedEnv.MODEL_GATEWAY_BASE_URL

    if (!nextModel || !nextBase) {
      return {
        type: 'text',
        value:
          'Missing required fields. Use: /byom set model=<id> base=<url> [token=<secret>|apikey=<secret>]',
      }
    }

    try {
      new URL(nextBase)
    } catch {
      return {
        type: 'text',
        value: `Invalid base URL: ${nextBase}`,
      }
    }

    const changes: Record<string, string | undefined> = {
      MODEL_GATEWAY_MODEL: nextModel,
      MODEL_GATEWAY_BASE_URL: nextBase,
      ...(parsed.authToken
        ? {
            MODEL_GATEWAY_AUTH_TOKEN: parsed.authToken,
            MODEL_GATEWAY_API_KEY: undefined,
          }
        : {}),
      ...(parsed.apiKey
        ? {
            MODEL_GATEWAY_API_KEY: parsed.apiKey,
            MODEL_GATEWAY_AUTH_TOKEN: undefined,
          }
        : {}),
      ...(parsed.headers !== undefined
        ? { MODEL_GATEWAY_CUSTOM_HEADERS: parsed.headers }
        : {}),
    }

    persistEnv(changes)
    applyRuntimeEnv(changes)

    return {
      type: 'text',
      value: `BYOM configurado para '${nextModel}'. Base: ${nextBase}`,
    }
  }

  return {
    type: 'text',
    value:
      'Uso: /byom show | /byom clear | /byom set model=<id> base=<url> [token=<secret>|apikey=<secret>] [headers="Name: Value"]',
  }
}
