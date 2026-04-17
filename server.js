'use strict';
const express  = require('express');
const path     = require('path');
const crypto   = require('crypto');
const Database = require('better-sqlite3');

const app          = express();
const PORT         = process.env.PORT || 3000;
const DB_PATH      = path.join(__dirname, 'db', 'classes_imo.db');
const AUTH_DB_PATH = path.join(__dirname, 'db', 'auth.db');

app.use(express.json());

// Serve apenas classes_imo.db — auth.db nunca é exposto
app.get('/db/classes_imo.db', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(DB_PATH);
});

app.use(express.static(__dirname, { index: 'index.html' }));

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function openAuth() {
  return new Database(AUTH_DB_PATH);
}

// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios.' });
  }

  let db;
  try {
    db = openAuth();
    const row = db.prepare(
      'SELECT nome FROM users WHERE username = ? AND password = ?'
    ).get(username.trim().toLowerCase(), sha256(password));

    if (!row) return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    res.json({ ok: true, nome: row.nome });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

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
    db = openAuth();

    const row = db.prepare(
      'SELECT username FROM users WHERE username = ? AND password = ?'
    ).get(username, sha256(currentPassword));

    if (!row) return res.status(401).json({ error: 'Senha atual incorreta.' });

    db.prepare('UPDATE users SET password = ? WHERE username = ?')
      .run(sha256(newPassword), username);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

// POST /api/reset-users — requer header X-Reset-Token (variável de ambiente)
const RESET_TOKEN   = process.env.RESET_TOKEN || '';
const SENHA_INICIAL = process.env.SENHA_INICIAL || 'SabespS42026';
const USUARIOS_SEED = [
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
    db = openAuth();
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        nome     TEXT DEFAULT ""
      )
    `);
    const stmt    = db.prepare('INSERT OR REPLACE INTO users (username, password, nome) VALUES (?, ?, ?)');
    const resetAll = db.transaction((rows) => {
      for (const [u, n] of rows) stmt.run(u, hash, n);
    });
    resetAll(USUARIOS_SEED);
    res.json({ ok: true, usuarios: USUARIOS_SEED.length });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

app.listen(PORT, () => console.log(`APP Classe IMO — porta ${PORT}`));
