import type { Command } from '../../commands.js'

export default {
  type: 'local',
  name: 'byom',
  description:
    'Configure a custom model gateway (non-Anthropic model via adapter/proxy)',
  argumentHint:
    'show | clear | set model=<id> base=<url> [token=<secret>|apikey=<secret>]',
  isSensitive: true,
  supportsNonInteractive: true,
  load: () => import('./byom.js'),
} satisfies Command
