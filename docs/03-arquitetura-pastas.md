# 03 — Arquitetura de Pastas

## Pastas centrais

- `entrypoints/`: pontos de entrada (CLI, init, schemas SDK).
- `commands/`: implementação dos comandos do usuário (slash commands).
- `tools/`: ferramentas invocáveis pelo modelo.
- `services/`: integrações e lógica transversal (API, OAuth, LSP, analytics).
- `components/`: UI em React/Ink para terminal interativo.
- `hooks/` e `state/`: ciclo de estado da aplicação e hooks de comportamento.
- `utils/`: utilitários fundamentais (git, config, permissões, mensagens, telemetry).
- `bridge/`: infraestrutura de controle remoto/bridge mode.
- `tasks/`: execução de tarefas assíncronas e agentes locais/remotos.
- `skills/` e `plugins/`: extensão de capacidades por skills/plugins.

## Pastas de suporte

- `types/` e `schemas/`: contratos e tipos compartilhados.
- `cli/`: handlers auxiliares da camada CLI.
- `ink/`: infraestrutura de renderização e interação de terminal.
- `constants/`: constantes globais e prompts.
- `migrations/`, `memdir/`, `remote/`, `server/`: áreas de apoio por feature.

## Estratégia de organização

A base privilegia organização por domínio funcional e por feature flag:

- módulos grandes são carregados sob demanda (lazy import);
- recursos experimentais entram por gates de feature;
- áreas de produto (bridge, skills, mcp, bg sessions) são isoladas por diretórios.

