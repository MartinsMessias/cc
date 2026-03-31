# 11 — Operação, Desenvolvimento e Contribuição

Este arquivo cobre o que normalmente falta em documentação técnica: **como operar no dia a dia**, **como validar mudanças** e **como contribuir com segurança**.

## 1) Checklist rápido de início

1. Leia `02-fluxo-execucao.md` para entender o pipeline.
2. Leia `03-arquitetura-pastas.md` para localizar responsabilidades.
3. Use `10-guia-replicacao.md` se você precisa reconstruir/portar o projeto.
4. Use `09-estrategias-por-caso.md` para escolher estratégia por tipo de demanda.

## 2) Workflow recomendado de desenvolvimento

## 2.1 Antes de codar

- Defina escopo e risco da mudança (bugfix, refactor, feature, docs).
- Identifique módulos impactados.
- Liste validações mínimas necessárias.

## 2.2 Durante implementação

- Faça mudanças pequenas e revisáveis.
- Evite misturar refatoração e mudança funcional no mesmo commit.
- Mantenha mensagens de commit explícitas por intenção.

## 2.3 Antes de abrir PR

- Execute validações locais relevantes (lint/typecheck/test/smoke).
- Revise o diff com foco em regressão e segurança.
- Atualize documentação quando houver mudança de comportamento.

---

## 3) Matriz de validações por tipo de mudança

| Tipo de mudança | Validação mínima |
|---|---|
| Documentação | links internos + revisão ortográfica/técnica |
| Bugfix | reprodução do bug + teste de regressão |
| Refatoração | typecheck + testes existentes + revisão de comportamento |
| Integração externa (MCP/remote) | teste de auth/permissão + logs observáveis |
| Performance | baseline antes/depois + evidência de ganho |

---

## 4) Runbook de troubleshooting (rápido)

## 4.1 CLI não inicia

- Verificar versão do runtime (`node -v`).
- Validar configuração básica e variáveis de ambiente.
- Iniciar com configuração mínima para isolar problema.

## 4.2 Tool falhando

- Confirmar schema de entrada esperado.
- Validar permissões/sandbox.
- Reexecutar com payload mínimo para depuração.

## 4.3 Integração externa falhando

- Verificar autenticação/token.
- Verificar políticas organizacionais/limites.
- Confirmar conectividade e endpoint.

---

## 5) Padrão de PR recomendado

Use este template mínimo:

- **Motivação:** por que a mudança é necessária.
- **Escopo:** o que foi alterado e o que ficou de fora.
- **Risco:** impacto potencial e mitigação.
- **Validação:** comandos executados e resultados.
- **Rollback:** como desfazer em caso de problema.

---

## 6) Definição de qualidade da documentação

Uma documentação é considerada suficiente quando:

- ajuda um novo maintainer a achar o módulo certo rápido;
- descreve não apenas “o que existe”, mas “como decidir”; 
- inclui estratégias operacionais para os principais cenários;
- tem links funcionais entre index e tópicos;
- acompanha mudanças de comportamento do sistema.

