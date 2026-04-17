#!/bin/sh
set -e

mkdir -p /app/db

# ── classes_imo.db: banco de dados público ────────────────────────────────────
if [ ! -f /app/db/classes_imo.db ]; then
  echo "[init] classes_imo.db não encontrado — copiando seed..."
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] classes_imo.db inicializado."
fi

# ── auth.db: banco de autenticação (nunca servido publicamente) ───────────────
echo "[init] Verificando auth.db..."
node - <<'EOF'
try {
  const Database = require('better-sqlite3');
  const db = new Database('/app/db/auth.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      nome     TEXT DEFAULT ""
    )
  `);

  const SEED = [
    ['jafagundes', 'Jorge Fagundes'],
    ['jmartinez',  'Jorge Martinez'],
    ['pnishiyama', 'Patrick Nishiyama'],
    ['gmfranco',   'Gildásio Macedo'],
    ['dfilho',     'Dival S Filho'],
  ];

  const crypto  = require('crypto');
  const SENHA   = process.env.SENHA_INICIAL || 'SabespS42026';
  const hash    = crypto.createHash('sha256').update(SENHA, 'utf8').digest('hex');

  const insert  = db.prepare('INSERT OR IGNORE INTO users (username, password, nome) VALUES (?, ?, ?)');
  const seedAll = db.transaction((rows) => {
    for (const [u, n] of rows) insert.run(u, hash, n);
  });
  seedAll(SEED);

  const total = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  db.close();
  console.log(`[init] auth.db pronto: ${total} usuário(s).`);
} catch (e) {
  console.error('[init] AVISO: falha ao inicializar auth.db —', e.message);
}
EOF

exec node server.js
