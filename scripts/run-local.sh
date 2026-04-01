#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "package.json" ]]; then
  echo "Erro: package.json não encontrado neste snapshot."
  echo "Use a instalação global (npm/bun) descrita no README."
  exit 1
fi

if rg -q "from 'bun:bundle'" .; then
  echo "Erro: este snapshot usa imports 'bun:bundle' (macro de build interna)."
  echo "Execução direta do código-fonte pode falhar fora do pipeline original."
  echo "Use o pacote publicado (@anthropic-ai/claude-code) para rodar localmente."
  exit 1
fi

echo "Instalando dependências..."
bun install

echo "Iniciando projeto..."
bun run setup.ts
