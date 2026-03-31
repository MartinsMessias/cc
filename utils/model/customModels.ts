export type ConfiguredCustomModel = {
  value: string
  label: string
  description: string
}

function parseCustomModelOptionsEnv(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

/**
 * Returns configured custom model options from environment variables.
 *
 * Supported env vars:
 * - ANTHROPIC_CUSTOM_MODEL_OPTION (legacy single option)
 * - ANTHROPIC_CUSTOM_MODEL_OPTIONS (comma/newline separated options)
 * - MODEL_GATEWAY_MODEL (single option, provider-agnostic)
 * - MODEL_GATEWAY_MODELS (comma/newline separated, provider-agnostic)
 */
export function getConfiguredCustomModels(): ConfiguredCustomModel[] {
  const models: ConfiguredCustomModel[] = []
  const seen = new Set<string>()

  const addModel = (
    value: string,
    label: string = value,
    description: string = `Custom model (${value})`,
  ): void => {
    const normalized = value.trim()
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    models.push({
      value: normalized,
      label,
      description,
    })
  }

  const legacyModel = process.env.ANTHROPIC_CUSTOM_MODEL_OPTION
  if (legacyModel) {
    addModel(
      legacyModel,
      process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_NAME ?? legacyModel,
      process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION ??
        `Custom model (${legacyModel})`,
    )
  }

  for (const model of parseCustomModelOptionsEnv(
    process.env.ANTHROPIC_CUSTOM_MODEL_OPTIONS,
  )) {
    addModel(model)
  }

  const gatewayModel = process.env.MODEL_GATEWAY_MODEL
  if (gatewayModel) {
    addModel(
      gatewayModel,
      process.env.MODEL_GATEWAY_MODEL_NAME ?? gatewayModel,
      process.env.MODEL_GATEWAY_MODEL_DESCRIPTION ??
        `Gateway model (${gatewayModel})`,
    )
  }

  for (const model of parseCustomModelOptionsEnv(
    process.env.MODEL_GATEWAY_MODELS,
  )) {
    addModel(model)
  }

  return models
}

export function isConfiguredCustomModel(model: string): boolean {
  const normalized = model.trim()
  if (!normalized) return false
  return getConfiguredCustomModels().some(
    configured => configured.value === normalized,
  )
}
