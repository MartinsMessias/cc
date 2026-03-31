# CLAUDE.md

## PMT boot obrigatório (Project Memory Tree)

Ao iniciar qualquer sessão, leia obrigatoriamente:
- `.claude/pmt/root.md`
- `.claude/pmt/state/current.md`

Se a tarefa envolver arquitetura, leia também:
- `.claude/pmt/arch/summary.md`

Se envolver decisão técnica passada, leia também:
- `.claude/pmt/decisions/summary.md`

Regra de economia de contexto:
- Não ler todos os arquivos da árvore de uma vez.
- Navegar de forma lazy (somente os galhos necessários para a tarefa).

## Encerramento de sessão (PMT)

No fim de uma sessão com mudanças relevantes:
1. Atualize `.claude/pmt/state/current.md`
2. Registre decisões novas em `.claude/pmt/decisions/`
3. Atualize arquivos de arquitetura que mudaram em `.claude/pmt/arch/`
4. Atualize `summary.md` dos galhos tocados
5. Re-gere `.claude/pmt/root.md` com base nos summaries

Em caso de conflito entre sessões paralelas, trate PMT como código versionado e faça merge explícito em git.
