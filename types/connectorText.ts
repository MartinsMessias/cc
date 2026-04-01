import type { ContentBlock, ContentBlockParam } from '@anthropic-ai/sdk/resources/index.mjs'

export type ConnectorTextBlock = ContentBlockParam & {
  type: 'connector_text'
  text?: string
}

export function isConnectorTextBlock(
  block: ContentBlock | ContentBlockParam | null | undefined,
): block is ConnectorTextBlock {
  return !!block && typeof block === 'object' && block.type === 'connector_text'
}
