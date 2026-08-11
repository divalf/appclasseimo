#!/usr/bin/env python3
"""
seed_auth_db.py
Cria/popula db/auth.db (banco de autenticação) para rodar o sistema LOCALMENTE.

Em produção (Docker) esse papel é do entrypoint.sh. Este script existe para o
ambiente local, onde o entrypoint não roda e o server.js apenas ABRE o auth.db
(não o cria).

Uso (a partir da raiz do projeto):
    python scripts/seed_auth_db.py

Observações:
  - auth.db NUNCA é servido via HTTP e NUNCA vai para o git (.gitignore).
  - Usuários já existentes não são sobrescritos (INSERT OR IGNORE), então
    rodar de novo não reseta senhas já alteradas.
  - A senha inicial pode ser passada pela variável de ambiente SENHA_INICIAL.
"""

import hashlib
import os
import sqlite3
import sys

USUARIOS = [
    ('jafagundes', 'Jorge Fagundes'),
    ('jmartinez',  'Jorge Martinez'),
    ('pnishiyama', 'Patrick Nishiyama'),
    ('gmfranco',   'Gildásio Macedo'),
    ('dfilho',     'Dival S Filho'),
]

BASE          = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR        = os.path.join(BASE, 'db')
AUTH_DB_PATH  = os.path.join(DB_DIR, 'auth.db')
# Falha fechado: sem a variável o script para. Um padrão embutido aqui vira
# senha pública assim que o arquivo for commitado.
SENHA_INICIAL = os.environ.get('SENHA_INICIAL')
if not SENHA_INICIAL:
    sys.exit('ERRO: defina SENHA_INICIAL no ambiente antes de rodar este script.')
SENHA_HASH    = hashlib.sha256(SENHA_INICIAL.encode('utf-8')).hexdigest()

os.makedirs(DB_DIR, exist_ok=True)

con = sqlite3.connect(AUTH_DB_PATH)
cur = con.cursor()
cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        nome     TEXT DEFAULT ""
    )
''')
cur.executemany(
    'INSERT OR IGNORE INTO users (username, password, nome) VALUES (?,?,?)',
    [(u, SENHA_HASH, n) for u, n in USUARIOS]
)
con.commit()

total = cur.execute('SELECT COUNT(*) FROM users').fetchone()[0]
con.close()

print(f'OK auth.db pronto: {AUTH_DB_PATH}')
print(f'   {total} usuário(s) cadastrado(s).')
