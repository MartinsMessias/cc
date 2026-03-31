# 02 — Fluxo de Execução

## 1) Entrada da aplicação

O fluxo começa em `entrypoints/cli.tsx`, que:

- faz bootstrap rápido de argumentos (`--version`, caminhos fast-path);
- ativa caminhos especiais (daemon, bridge, MCP server local, sessões bg);
- adia imports pesados para melhorar tempo de startup;
- encaminha para a execução principal quando necessário.

## 2) Inicialização global

A camada `entrypoints/init.ts` prepara o runtime:

- habilita e valida configurações;
- aplica variáveis de ambiente seguras e certificados;
- configura rede/proxy/mTLS;
- inicializa telemetria, limites de política e ajustes remotos;
- registra limpezas e shutdown graceful.

## 3) Setup de sessão

O arquivo `setup.ts` prepara o contexto da sessão:

- valida runtime mínimo;
- define cwd/projeto/sessão;
- inicializa watchers/hooks;
- resolve worktree/tmux quando habilitado;
- carrega comandos e integrações associadas.

## 4) Loop principal de consulta

O módulo `query.ts` orquestra o loop de mensagens:

- normaliza mensagens e contexto de sistema/usuário;
- gerencia compactação automática e limites de token;
- executa ferramentas solicitadas pelo assistente;
- aplica transições de continuidade do turno;
- trata recuperação de erros e fallback de modelo.

## 5) Registro de comandos e ferramentas

- `commands.ts`: agrega comandos builtin + dinâmicos (skills/plugins/features).
- `tools.ts`: agrega ferramentas e aplica gating por feature flag/env.
- `tasks.ts`: define tipos de tarefas assíncronas disponíveis.

## Resumo do pipeline

`CLI args -> init -> setup -> estado/UI -> query loop -> tools/tasks/services`.

