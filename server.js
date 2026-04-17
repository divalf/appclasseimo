'use strict';
const express  = require('express');
const path     = require('path');
const crypto   = require('crypto');
const Database = require('better-sqlite3');

const app     = express();
const PORT    = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db', 'classes_imo.db');

app.use(express.json());
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

app.listen(PORT, () => console.log(`APP Classe IMO — porta ${PORT}`));
