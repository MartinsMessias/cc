# 05 — Ferramentas (Tools)

## Papel das tools

Tools são as capacidades executáveis que o modelo pode invocar durante um turno (filesystem, shell, web, MCP, tarefas etc.). O registro principal fica em `tools.ts`.

## Grupos principais

### Arquivos

- `FileReadTool`
- `FileEditTool`
- `FileWriteTool`
- `GlobTool`
- `GrepTool`
- `NotebookEditTool`

### Execução local

- `BashTool`
- `PowerShellTool`

### Web e busca

- `WebFetchTool`
- `WebSearchTool`

### MCP e ecossistema externo

- `MCPTool`
- `McpAuthTool`
- `ListMcpResourcesTool`
- `ReadMcpResourceTool`

### Planejamento e controle de fluxo

- `EnterPlanModeTool`
- `ExitPlanModeTool`
- `TodoWriteTool`
- `ToolSearchTool`

### Tarefas e colaboração

- `TaskCreateTool`, `TaskGetTool`, `TaskUpdateTool`, `TaskListTool`, `TaskStopTool`, `TaskOutputTool`
- `AgentTool`, `SkillTool`, `TeamCreateTool`, `TeamDeleteTool`, `SendMessageTool`

## Observações técnicas

- Várias tools são ativadas por flags de feature/env.
- Há carregamento lazy para quebrar dependências circulares e otimizar bootstrap.

