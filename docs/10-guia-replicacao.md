# 10 — Guia de Replicação do Projeto (Blueprint)


## 1) Escopo de replicação

Este guia descreve como replicar:

- estrutura de módulos;
- fluxo de inicialização da CLI;
- orquestração de mensagens e execução de tools;
- camada de comandos, tasks e integrações;
- UI terminal com estado e hooks;
- estratégia de rollout com validações.

Não é um dump de código-fonte: é um **blueprint executável de arquitetura**.

---

## 2) Pré-requisitos de ambiente

- Runtime JavaScript/TypeScript (Node.js 18+).
- Gerenciador de pacotes (`npm`, `pnpm` ou `bun`).
- Ferramentas de qualidade (`eslint`, `typescript`, opcionalmente `vitest/jest`).
- Git para versionamento e fluxo de branches.

Sugestão de baseline:

```bash
node -v
npm -v
```

---

## 3) Estrutura mínima de pastas (target)

Crie uma base com este esqueleto:

```text
entrypoints/
commands/
tools/
services/
components/
hooks/
state/
utils/
bridge/
tasks/
types/
constants/
```

### Responsabilidades obrigatórias

- `entrypoints/`: bootstrap e dispatch por modo de execução.
- `commands/`: catálogo de comandos da sessão.
- `tools/`: capacidades invocáveis pelo modelo.
- `services/`: API, auth, analytics, compactação, políticas.
- `components/` + `hooks/` + `state/`: UI terminal e ciclo de estado.
- `utils/`: infraestrutura transversal (config, env, logs, git, permissões).

---

## 4) Contratos centrais que você precisa implementar

## 4.1 Contrato de Comando

Campos mínimos:

- `name` (string)
- `description` (string)
- `type` (`prompt` ou `local-jsx`)
- handler assíncrono para execução

## 4.2 Contrato de Tool

Campos mínimos:

- `name`
- `description`
- `inputSchema` (JSON Schema)
- `execute(input, context)` retornando resultado serializável

## 4.3 Contrato de Task

Campos mínimos:

- `type`
- `start(payload)`
- `stop(id)`
- `status(id)`

## 4.4 Contrato de Estado da UI

- store global (`AppState`)
- selectors puros
- callback de mudança (`onChangeAppState`)

---

## 5) Ordem recomendada de implementação (para replicar de verdade)

1. **Entrypoints e init**
   - Parse de args.
   - Fast paths (ex.: `--version`).
   - Inicialização de config/env/logs.

2. **Setup de sessão**
   - Resolver diretório do projeto.
   - Inicializar sessão e contexto.
   - Registrar hooks/watchers essenciais.

3. **Loop de query**
   - Receber mensagens.
   - Chamar modelo.
   - Detectar tool calls.
   - Executar tools.
   - Reintegrar resultados no loop.

4. **Registro de comandos/tools/tasks**
   - Catálogo base estático.
   - Gating por feature flag.
   - Extensão dinâmica (plugins/skills).

5. **UI terminal**
   - Input, lista de mensagens, status line.
   - Navegação de histórico.
   - Sinais de estado de execução.

6. **Integrações externas**
   - MCP.
   - OAuth/Auth.
   - Políticas remotas.

7. **Camada de confiabilidade**
   - Telemetria.
   - Retry/backoff.
   - Compactação e limites de token.

---

## 6) Fluxo de execução de referência (sequência)

```text
CLI -> init -> setup -> carregar comandos/tools -> iniciar UI -> query loop
query loop -> modelo -> tool_use? -> executa tool -> tool_result -> modelo -> resposta final
```

### Regras operacionais importantes

- Preferir imports lazy para módulos pesados.
- Separar runtime interativo de runtime não interativo.
- Tratar limites (tokens/tempo/permissão) como primeira classe.

---

## 7) Matriz “caso de uso -> estratégia -> implementação”

| Caso | Estratégia | Implementação mínima |
|---|---|---|
| Bugfix | Reprodução mínima e correção focal | `commands/diff`, `tools/FileEditTool`, teste de regressão |
| Refatoração | Incremental + checkpoints | PRs menores, validação a cada etapa |
| Performance | Medir antes/depois | benchmark script + telemetria básica |
| MCP | Começar por leitura mínima | Listar recursos e ler um recurso antes de ações complexas |
| Sessão remota | Política e observabilidade primeiro | validação de auth/limites + logs estruturados |

---

## 8) Plano de validação para confirmar que a réplica está correta

## 8.1 Smoke checks

- CLI abre em modo interativo.
- `--version` responde instantaneamente.
- Um comando básico (`/help`) funciona.
- Uma tool de leitura de arquivo executa com sucesso.

## 8.2 Integração

- Fluxo completo com tool call (pergunta -> tool -> resposta).
- Registro de tasks (create/list/stop).
- Carregamento de configurações de projeto.

## 8.3 Resiliência

- Falha de API com retry controlado.
- Prompt longo com estratégia de compactação.
- Falha de permissão retornando erro explícito e rastreável.

---

## 9) Critérios de pronto (Definition of Done da réplica)

Considere a réplica pronta quando:

- o fluxo `init -> setup -> query -> tools` estiver funcional;
- os contratos de `Command`, `Tool` e `Task` estiverem estáveis;
- houver documentação operacional de runbook para bugfix/refatoração/performance;
- houver validações automáticas mínimas (lint + typecheck + smoke).

---

## 10) Leitura cruzada com os demais docs

- Arquitetura: `03-arquitetura-pastas.md`
- Execução: `02-fluxo-execucao.md`
- Comandos: `04-comandos-slash.md`
- Tools: `05-ferramentas-tools.md`
- Estratégias por cenário: `09-estrategias-por-caso.md`

