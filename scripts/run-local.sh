#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "package.json" ]]; then
  echo "Erro: package.json não encontrado neste snapshot."
  echo "Use a instalação global (npm/bun) descrita no README."
  exit 1
fi

if rg -q "from 'bun:bundle'" -g '*.ts' -g '*.tsx' .; then
  echo "Erro: este snapshot usa imports 'bun:bundle' (macro de build interna)."
  echo "Execução direta do código-fonte pode falhar fora do pipeline original."
  echo "Use o pacote publicado (@anthropic-ai/claude-code) para rodar localmente."
  exit 1
fi

if [[ ! -d "node_modules" ]]; then
  echo "Instalando dependências (primeira execução)..."
  bun install
fi

echo "Iniciando projeto..."
bun run setup.ts
