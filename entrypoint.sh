#!/bin/sh
set -e

mkdir -p /app/db

if [ ! -f /app/db/classes_imo.db ]; then
  echo "[init] Banco não encontrado — copiando seed..."
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] Banco inicializado com sucesso."
else
  echo "[init] Banco existente detectado — aplicando merge de usuários..."
  node - <<'EOF'
const Database = require('better-sqlite3');
const src = new Database('/db-seed/classes_imo.db', { readonly: true });
const dst = new Database('/app/db/classes_imo.db');

// Garante que a tabela users existe no banco de destino
dst.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    nome     TEXT DEFAULT ""
  )
`);

const seedUsers = src.prepare('SELECT username, password, nome FROM users').all();
const insert    = dst.prepare(
  'INSERT OR IGNORE INTO users (username, password, nome) VALUES (?, ?, ?)'
);
const insertAll = dst.transaction((rows) => {
  for (const r of rows) insert.run(r.username, r.password, r.nome);
});
insertAll(seedUsers);

src.close();
dst.close();
console.log(`[init] Merge concluído: ${seedUsers.length} usuário(s) verificado(s).`);
EOF
fi

exec node server.js
