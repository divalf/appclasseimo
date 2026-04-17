#!/bin/sh
set -e

if [ ! -f /app/db/classes_imo.db ]; then
  echo "[init] Inicializando banco de dados no volume..."
  mkdir -p /app/db
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] Banco copiado com sucesso."
fi

exec node server.js
