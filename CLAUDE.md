# CLAUDE.md

## PMT boot

Ao iniciar qualquer sessão, leia obrigatoriamente:
- `.claude/pmt/root.md`
- `.claude/pmt/state/current.md`

Se a tarefa envolver arquitetura, leia também:
- `.claude/pmt/arch/summary.md`

Se envolver decisão técnica passada, leia também:
- `.claude/pmt/decisions/summary.md`

Regra: leitura lazy. Só abra o galho necessário.

## PMT close

No fim da sessão:
1. Atualize `.claude/pmt/state/current.md`
2. Registre decisões novas em `.claude/pmt/decisions/`
3. Atualize arquivos de arquitetura que mudaram em `.claude/pmt/arch/`
4. Atualize `summary.md` dos galhos tocados
5. Re-gere `.claude/pmt/root.md` com base nos summaries

Se houver conflito paralelo, faça merge em git.
