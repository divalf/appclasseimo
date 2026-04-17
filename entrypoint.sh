#!/bin/sh
set -e

# Na primeira execução, o volume /app/db está vazio.
# Copia o banco inicial da imagem para o volume.
if [ ! -f /app/db/classes_imo.db ]; then
  echo "[init] Inicializando banco de dados no volume..."
  mkdir -p /app/db
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] Banco copiado com sucesso."
fi

exec node server.js
