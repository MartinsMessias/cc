# 08 — Inventário do Repositório

## Estatísticas rápidas (arquivos de código)

Contagem aproximada por diretório de topo:

- `utils`: 564
- `components`: 389
- `commands`: 207
- `tools`: 184
- `services`: 130
- `hooks`: 104
- `ink`: 96
- `bridge`: 31
- `constants`: 21
- `skills`: 20
- `cli`: 19
- `tasks`: 12
- `types`: 11

Total mapeado: **~1902 arquivos** de código.

## Diretórios com maior impacto arquitetural

1. `entrypoints/` — boot e dispatch de modo de execução.
2. `setup.ts` + `query.ts` — núcleo de execução de sessão e loop de inferência.
3. `commands.ts` + `tools.ts` + `tasks.ts` — catálogo de capacidades.
4. `services/` + `utils/` — integração e infraestrutura transversal.
5. `components/` + `state/` + `hooks/` — camada de experiência interativa.

## Mapa de leitura recomendado para onboarding

1. `entrypoints/cli.tsx`
2. `entrypoints/init.ts`
3. `setup.ts`
4. `query.ts`
5. `commands.ts`
6. `tools.ts`
7. `tasks.ts`
8. pastas específicas da feature em foco (`bridge/`, `services/mcp/`, `components/`, etc.)

