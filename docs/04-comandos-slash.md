# 04 — Comandos Slash

## Papel da camada de comandos

Comandos modelam as ações do usuário dentro da sessão (ex.: `/help`, `/diff`, `/review`, `/mcp`, `/tasks`). A agregação principal ocorre em `commands.ts`.

## Categorias de comandos

### Produtividade e fluxo

- `help`, `clear`, `compact`, `resume`, `session`, `status`, `summary`.

### Código e git

- `diff`, `review`, `branch`, `commit`, `files`, `rewrite/rewind` (quando disponível).

### Configuração e ambiente

- `config`, `model`, `theme`, `permissions`, `sandbox-toggle`, `env`, `remote-env`.

### Integrações

- `mcp`, `skills`, `plugin`, `ide`, `voice`, `chrome`, `teleport`.

### Operação interna e diagnóstico

- `doctor`, `debug-tool-call`, `heapdump`, `perf-issue`, `ant-trace`.

## Observações técnicas

- Há comandos condicionais por feature flags e tipo de build.
- Parte dos comandos é carregada dinamicamente para reduzir custo de startup.
- A camada também incorpora comandos de skill/plugins em runtime.

