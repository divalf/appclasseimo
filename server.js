'use strict';
const express  = require('express');
const path     = require('path');
const crypto   = require('crypto');
const fs       = require('fs');
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

  console.log('[change-password] DB_PATH:', DB_PATH);
  console.log('[change-password] Arquivo existe:', fs.existsSync(DB_PATH));

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
      console.log('[change-password] Senha atual incorreta para usuário:', username);
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    const statBefore = fs.statSync(DB_PATH);
    console.log('[change-password] mtime ANTES:', statBefore.mtimeMs);

    db.prepare('UPDATE users SET password = ? WHERE username = ?')
      .run(sha256(newPassword), username);

    db.close();
    db = null;

    const statAfter = fs.statSync(DB_PATH);
    console.log('[change-password] mtime DEPOIS:', statAfter.mtimeMs);
    console.log('[change-password] Arquivo modificado:', statAfter.mtimeMs > statBefore.mtimeMs);

    res.json({ ok: true });
  } catch (err) {
    console.error('[change-password] ERRO:', err.message);
    res.status(500).json({ error: 'Erro interno: ' + err.message });
  } finally {
    db?.close();
  }
});

app.listen(PORT, () => console.log(`APP Classe IMO — porta ${PORT}`));
