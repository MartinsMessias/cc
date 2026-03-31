# 07 — Serviços e Integrações

## Serviços transversais (`services/`)

Principais grupos de serviço:

- `api/`: camada de comunicação com modelos e retries.
- `analytics/`: eventos, telemetria e growthbook.
- `oauth/`: autenticação e sincronização de credenciais.
- `mcp/`: integração de servidores MCP e autorização.
- `lsp/`: gerenciamento de integração com Language Server.
- `compact/`: compactação de contexto e estratégias de continuidade.
- `policyLimits/` + `remoteManagedSettings/`: governança e controles remotos.

## Bridge e remoto

A pasta `bridge/` implementa o modo de controle remoto e sessão bridge, incluindo:

- inicialização da bridge;
- transporte/mensageria;
- gestão de sessão e permissões;
- configuração e utilitários de compatibilidade.

## Utilitários e infraestrutura

`utils/` centraliza infraestrutura que apoia todo o sistema:

- config/env/auth;
- git e filesystem;
- permissões/sandbox;
- manipulação de mensagens/contexto;
- telemetry, plugins, skills e suporte a subprocessos.

