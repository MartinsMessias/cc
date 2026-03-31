# 06 — Estado, UI e Hooks

## Estado da aplicação

A camada de estado concentra-se em `state/`, incluindo:

- tipos/shape do app state;
- store e seletores;
- callback de reação a mudanças (`onChangeAppState`).

## UI interativa

A pasta `components/` contém a UI de terminal (React/Ink), incluindo:

- árvore principal de renderização (`components/App.tsx`);
- caixas de entrada, listas de mensagens, status line;
- diálogos de permissões/configurações e componentes de fluxo.

## Hooks

A pasta `hooks/` concentra hooks de comportamento, por exemplo:

- gerenciamento de entrada e keybindings;
- integração com IDE/voice/chrome;
- sincronização de sessões remotas e tasks;
- polling/efeitos para notificações, sugestões e permissões.

## Resultado prático

A combinação `state + hooks + components` separa:

- regras de estado e side effects;
- rendering e composição visual;
- integrações com ambiente local/remoto.

