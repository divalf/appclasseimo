'use strict';
const express  = require('express');
const path     = require('path');
const crypto   = require('crypto');
const Database = require('better-sqlite3');

const app     = express();
const PORT    = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db', 'classes_imo.db');

app.use(express.json());

// Banco de dados: sem cache — garante que o browser sempre busque a versão atual
app.use('/db', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
}, express.static(path.join(__dirname, 'db')));

app.use(express.static(__dirname, { index: 'index.html' }));

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// POST /api/change-password
app.post('/api/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body ?? {};

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Campos obrigatórios.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
  }

  let db;
  try {
    db = new Database(DB_PATH);

    const row = db.prepare(
      'SELECT username FROM users WHERE username = ? AND password = ?'
    ).get(username, sha256(currentPassword));

    if (!row) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    db.prepare('UPDATE users SET password = ? WHERE username = ?')
      .run(sha256(newPassword), username);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

// POST /api/reset-users  — restaura todas as senhas para o valor inicial
// Requer header  X-Reset-Token: <RESET_TOKEN>  (variável de ambiente)
const RESET_TOKEN    = process.env.RESET_TOKEN || '';
const SENHA_INICIAL  = 'SabespS42026';
const USUARIOS_SEED  = [
  ['jafagundes', 'Jorge Fagundes'],
  ['jmartinez',  'Jorge Martinez'],
  ['pnishiyama', 'Patrick Nishiyama'],
  ['gmfranco',   'Gildásio Macedo'],
  ['dfilho',     'Dival S Filho'],
];

app.post('/api/reset-users', (req, res) => {
  const token = req.headers['x-reset-token'] ?? '';

  if (!RESET_TOKEN) {
    return res.status(503).json({ error: 'Reset não configurado (RESET_TOKEN ausente).' });
  }
  if (token !== RESET_TOKEN) {
    return res.status(403).json({ error: 'Token inválido.' });
  }

  const hash = sha256(SENHA_INICIAL);
  let db;
  try {
    db = new Database(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        nome     TEXT DEFAULT ""
      )
    `);
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO users (username, password, nome) VALUES (?, ?, ?)'
    );
    const resetAll = db.transaction((rows) => {
      for (const [u, n] of rows) stmt.run(u, hash, n);
    });
    resetAll(USUARIOS_SEED);
    res.json({ ok: true, usuarios: USUARIOS_SEED.length, senhaInicial: SENHA_INICIAL });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

app.listen(PORT, () => console.log(`APP Classe IMO — porta ${PORT}`));
