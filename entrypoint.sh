#!/bin/sh
set -e

mkdir -p /app/db

# ── classes_imo.db: banco de dados público ────────────────────────────────────
# O seed da imagem é sempre a verdade: este banco é dado público gerado do xlsx
# (uar/cc/depara) e ninguém o escreve em runtime — server.js só faz sendFile.
# Sem o ramo de atualização abaixo, o arquivo do volume venceria para sempre e
# toda regeneração do banco pareceria "não ter subido" em produção.
# O auth.db não é tocado aqui: é criado adiante e vive só no volume.
if [ ! -f /app/db/classes_imo.db ]; then
  echo "[init] classes_imo.db não encontrado — copiando seed..."
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] classes_imo.db inicializado."
# O teste de `cmp` é condicional de propósito: se o binário não existir na imagem,
# cai no ramo de cópia em vez de abortar por `set -e`. Copiar é sempre seguro.
elif command -v cmp >/dev/null 2>&1 && cmp -s /db-seed/classes_imo.db /app/db/classes_imo.db; then
  echo "[init] classes_imo.db já corresponde ao seed desta imagem."
else
  echo "[init] atualizando classes_imo.db a partir do seed..."
  cp /db-seed/classes_imo.db /app/db/classes_imo.db
  echo "[init] classes_imo.db atualizado."
fi

# ── auth.db: banco de autenticação (nunca servido publicamente) ───────────────
# Falha fechado: sem SENHA_INICIAL o container não sobe. Um padrão embutido aqui
# vira senha pública no primeiro push — o fallback que existia neste arquivo ficou
# legível no repositório e era a senha válida em produção.
if [ -z "$SENHA_INICIAL" ]; then
  echo "[init] ERRO: SENHA_INICIAL não definida — configure a variável no painel." >&2
  exit 1
fi

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
  const SENHA   = process.env.SENHA_INICIAL;
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
