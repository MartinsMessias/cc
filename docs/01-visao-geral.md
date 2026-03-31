# 01 — Visão Geral

## O que é este projeto

Este repositório implementa uma CLI avançada para interação com LLMs em fluxo de desenvolvimento, com foco em:

- loop conversacional interativo no terminal;
- execução de ferramentas (filesystem, shell, web, MCP);
- comandos internos (`/help`, `/review`, `/mcp`, etc.);
- modos especiais (bridge/remote, daemon, background sessions);
- extensibilidade por plugins, skills e serviços.

## Blocos arquiteturais principais

- **Entrypoints e bootstrap**: inicialização de ambiente, config, telemetria e sessão.
- **Core de query**: orquestra mensagens, streaming, compactação e execução de tools.
- **Comandos**: camada de comando slash e ações do usuário.
- **Tools**: primitives de execução (bash, leitura/edição de arquivo, MCP, web etc.).
- **UI/State**: componentes React/Ink, hooks e estado global da aplicação.
- **Services**: integrações externas e capacidades transversais (API, analytics, OAuth, LSP, políticas).

## Objetivo da documentação

A ideia desta documentação é acelerar onboarding técnico e facilitar manutenção, oferecendo:

- mapa mental do sistema;
- localização de responsabilidades por diretório;
- fluxo de execução de ponta a ponta;
- inventário navegável das áreas mais importantes.

