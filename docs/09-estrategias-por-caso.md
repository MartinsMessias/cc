# 09 — Estratégias por Caso de Uso

Este guia mapeia **estratégias práticas** para os casos mais comuns de uso da CLI, conectando objetivo -> abordagem -> comandos -> tools -> cuidados.

## Matriz resumida

| Caso | Estratégia principal | Comandos úteis | Tools chave |
|---|---|---|---|
| Entender base legada | Mapear arquitetura e pontos de entrada antes de alterar código | `/help`, `/files`, `/context`, `/summary` | `FileReadTool`, `GlobTool`, `GrepTool` |
| Corrigir bug | Reproduzir -> isolar -> corrigir -> validar | `/doctor`, `/diff`, `/review` | `BashTool`, `FileEditTool`, `FileReadTool` |
| Refatorar com segurança | Mudanças incrementais + checkpoints + revisão de diffs | `/diff`, `/compact`, `/review` | `FileEditTool`, `TaskListTool`, `TodoWriteTool` |
| Investigar performance | Instrumentar, medir, comparar antes/depois | `/doctor`, `/stats`, `/perf-issue` | `BashTool`, `GrepTool`, `FileReadTool` |
| Integrar serviço externo (MCP) | Validar auth/política e começar por fluxo mínimo | `/mcp`, `/config`, `/permissions` | `MCPTool`, `ListMcpResourcesTool`, `ReadMcpResourceTool` |
| Conectar modelo próprio (BYOM) | Usar gateway compatível com API Anthropic + rollout progressivo | `/status`, `/doctor`, `/model` | `WebSearchTool` (opcional), `BashTool` |
| Operar em ambiente remoto | Verificar bridge/limites e executar com rastreabilidade | `/session`, `/remote-env`, `/status` | `RemoteTriggerTool`, `TaskOutputTool`, `SendMessageTool` |
| Organizar trabalho longo | Quebrar em plano e tarefas monitoráveis | `/plan`, `/tasks`, `/memory` | `EnterPlanModeTool`, `TaskCreateTool`, `TaskUpdateTool` |
| Produzir documentação técnica | Coletar fatos por módulo e sintetizar por domínio | `/files`, `/summary`, `/export` | `FileReadTool`, `GlobTool`, `TodoWriteTool` |

---

## Estratégias detalhadas por caso

## 1) Entendimento inicial de codebase

**Objetivo:** reduzir risco de interpretação errada.

**Estratégia recomendada:**
1. Ler entrypoints e arquivos de orquestração (`entrypoints/`, `setup.ts`, `query.ts`).
2. Criar mapa de módulos por responsabilidade (`commands/`, `tools/`, `services/`).
3. Só então aprofundar no domínio específico da tarefa.

**Antipadrão comum:** começar editando arquivo isolado sem entender o fluxo end-to-end.

## 2) Correção de bug

**Objetivo:** corrigir sem regressão.

**Estratégia recomendada:**
1. Capturar o cenário de falha (logs/comando/reprodução mínima).
2. Localizar o subsistema responsável (`rg` + leitura orientada por stack trace).
3. Aplicar correção mínima e explícita.
4. Validar com comando objetivo (teste/lint/script reproduzível).
5. Revisar diff com foco em efeitos colaterais.

**Checklist:** causa raiz identificada? teste de regressão existe? impacto documentado?

## 3) Refatoração

**Objetivo:** melhorar estrutura sem mudar comportamento.

**Estratégia recomendada:**
1. Definir fronteira da refatoração (o que fica de fora).
2. Fazer mudanças pequenas por etapa (renomeio, extração, simplificação).
3. Rodar validação em cada etapa.
4. Preservar semântica e contratos públicos.

**Sinal de alerta:** PR grande sem checkpoints intermediários.

## 4) Performance

**Objetivo:** melhorar latência/custo sem suposições.

**Estratégia recomendada:**
1. Medir baseline (tempo, memória, throughput).
2. Identificar gargalo dominante.
3. Alterar 1 variável por vez.
4. Repetir medição nas mesmas condições.
5. Registrar ganho real e trade-offs.

## 5) Integração MCP

**Objetivo:** conectar capabilities externas com segurança.

**Estratégia recomendada:**
1. Validar autenticação e políticas permitidas.
2. Descobrir recursos (`ListMcpResourcesTool`).
3. Testar leitura mínima (`ReadMcpResourceTool`).
4. Só depois acoplar no fluxo de trabalho principal.

**Risco comum:** pular validações de política e quebrar execução em ambiente corporativo.

## 6) Sessão remota / bridge

**Objetivo:** operar remotamente com previsibilidade.

**Estratégia recomendada:**
1. Confirmar estado da conexão e versão mínima.
2. Garantir permissões da política da organização.
3. Executar tarefas com logging e saídas observáveis.
4. Definir rollback em caso de falha de conectividade.

## 7) Trabalho longo com plano e tarefas

**Objetivo:** manter rastreabilidade e progresso.

**Estratégia recomendada:**
1. Abrir plano com milestones pequenas.
2. Converter milestones em tasks observáveis.
3. Atualizar estado periodicamente (`pending`, `in_progress`, `completed`).
4. Finalizar com resumo executivo + resumo técnico.

## 8) Documentação técnica

**Objetivo:** tornar conhecimento reutilizável.

**Estratégia recomendada:**
1. Estruturar por tema (fluxo, arquitetura, operações).
2. Ligar conceitos a caminhos reais de código.
3. Incluir guias de decisão (quando usar cada abordagem).
4. Manter seção de inventário e trilha de onboarding.

## 9) Conectar modelo próprio (BYOM — Bring Your Own Model)

**Objetivo:** permitir uso de um modelo próprio sem quebrar ferramentas da CLI.

**Estratégia recomendada (menor risco):**
1. **Comece por um gateway/proxy compatível com Anthropic Messages API** em vez de integrar um provider novo no código da CLI.
2. Configure variáveis de ambiente para apontar o tráfego:
   - `ANTHROPIC_BASE_URL` para o endpoint do gateway;
   - `ANTHROPIC_AUTH_TOKEN` (Bearer) ou `ANTHROPIC_API_KEY` conforme o gateway;
   - `ANTHROPIC_CUSTOM_HEADERS` quando o gateway exigir cabeçalhos extras.
3. Faça **rollout em etapas**:
   - etapa 1: prompts simples sem tools;
   - etapa 2: ativar tools básicas de arquivo/bash;
   - etapa 3: validar recursos avançados (MCP, tool search, streaming longo).
4. Monitore com `/status` e `/doctor` antes de abrir para todo o time.
5. Só depois padronize em `.claude.json`/ambiente corporativo.

**Cuidados importantes:**
- Algumas features beta (ex.: `tool_reference`) podem não ser aceitas por gateways; se necessário, ajuste `ENABLE_TOOL_SEARCH`.
- Preserve compatibilidade de streaming SSE e códigos de erro para evitar falhas intermitentes.
- Defina timeout e retry no gateway para sessões longas.

**Quando escolher outra estratégia:**
- Se você precisa suporte oficial AWS/GCP/Azure, prefira os provedores já suportados (`Bedrock`, `Vertex`, `Foundry`) via variáveis dedicadas.
- Se você precisa modelo totalmente fora do formato Anthropic, considere um adaptador no gateway (tradução de schema/request/response) em vez de alterar o core da CLI.

---

## Estratégia de escolha rápida (heurística)

- **Mudança pequena e urgente:** estratégia de correção mínima + validação objetiva.
- **Mudança estrutural:** estratégia incremental com checkpoints.
- **Incerteza alta:** estratégia de observabilidade primeiro (medir antes de alterar).
- **Ambiente regulado/corporativo:** estratégia orientada por política/permissão.
