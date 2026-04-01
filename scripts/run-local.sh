#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f "package.json" ]]; then
  echo "Erro: package.json não encontrado neste snapshot."
  echo "Use a instalação global (npm/bun) descrita no README."
  exit 1
fi

echo "Instalando dependências..."
bun install

echo "Iniciando projeto..."
bun run .
