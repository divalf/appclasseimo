#!/usr/bin/env python3
"""
xlsx_to_sqlite.py
Converte CLASSES_IMO.xlsx → db/classes_imo.db (SQLite)

Uso (a partir da raiz do projeto):
    python scripts/xlsx_to_sqlite.py

Dependências (só openpyxl, built-in sqlite3):
    pip install openpyxl

Após rodar:
    git add db/classes_imo.db
    git commit -m "chore: atualiza banco de dados"
    git push
"""

import sqlite3
import openpyxl
import os
import sys

# ── Caminhos ──────────────────────────────────────────────────────────────────
BASE       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_PATH = os.path.join(BASE, 'CLASSES_IMO.xlsx')
DB_DIR     = os.path.join(BASE, 'db')
DB_PATH    = os.path.join(DB_DIR, 'classes_imo.db')

# ── Helpers ───────────────────────────────────────────────────────────────────
def safe(v):
    """Converte qualquer valor para string limpa."""
    return str(v).strip() if v is not None else ''

# ── Verifica se o xlsx existe ─────────────────────────────────────────────────
if not os.path.exists(EXCEL_PATH):
    print(f'ERRO: planilha não encontrada em:\n  {EXCEL_PATH}')
    sys.exit(1)

print(f'Lendo planilha: {EXCEL_PATH}')
wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True, data_only=True)

# ── Aba UAR ───────────────────────────────────────────────────────────────────
# Colunas: [0] Código UAR | [1] Descrição
ws_uar  = wb['UAR']
uar_data = []
for row in list(ws_uar.rows)[1:]:          # pula cabeçalho
    code_raw = row[0].value
    desc     = row[1].value
    if code_raw is None:
        continue
    code = str(int(code_raw)).zfill(7)
    uar_data.append((code, str(desc) if desc else ''))

print(f'  UAR ............. {len(uar_data):>5} registros')

# ── Aba Centros de Custo ──────────────────────────────────────────────────────
# Cabeçalho na linha 2; dados a partir da linha 3
# Colunas relevantes (0-indexed):
#   [0]  CC
#   [2]  Responsável
#   [4]  Tipo de Contrato
#   [5]  Tipo Centro de Custo
#   [16] Centro de Lucro
#   [20] Descrição CC
#   [29] Usuário Responsável (matrícula)
ws_cc  = wb['Centros de Custo']
cc_data = []
for row in list(ws_cc.rows)[2:]:           # pula as 2 linhas de cabeçalho
    cc_val = row[0].value
    if cc_val is None:
        continue
    cc_data.append((
        safe(cc_val),
        safe(row[2].value),
        safe(row[4].value),
        safe(row[5].value),
        safe(row[16].value),
        safe(row[20].value),
        safe(row[29].value) if len(row) > 29 else '',
    ))

print(f'  Centros de Custo  {len(cc_data):>5} registros')

# ── Aba DEPARA ────────────────────────────────────────────────────────────────
# Colunas: [0] Legado | [1] Atual | [2] Tipologia CC | [3] Desc Tipologia
#          [4] UP     | [5] DescUP | [6] Tipo Contrato | [7] Forma Controle
#          [8] Tipo Bem | [9] Unidade de Medida
ws_dep  = wb['DEPARA']
dep_data = []
for row in list(ws_dep.rows)[1:]:          # pula cabeçalho
    legado = row[0].value
    if legado is None:
        continue
    up_raw = row[4].value
    up_val = int(up_raw) if isinstance(up_raw, (int, float)) else 0
    dep_data.append((
        safe(legado),
        safe(row[1].value),
        safe(row[2].value),
        safe(row[3].value),
        up_val,
        safe(row[5].value),
        safe(row[6].value),
        safe(row[7].value),
        safe(row[8].value),
        safe(row[9].value),
    ))

print(f'  DEPARA .......... {len(dep_data):>5} registros')

wb.close()

# ── Cria banco SQLite ─────────────────────────────────────────────────────────
os.makedirs(DB_DIR, exist_ok=True)

if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
    print(f'\nBanco anterior removido.')

con = sqlite3.connect(DB_PATH)
cur = con.cursor()

cur.executescript('''
-- ── Tabela UAR ────────────────────────────────────────────
CREATE TABLE uar (
    code  TEXT PRIMARY KEY,
    desc  TEXT NOT NULL DEFAULT ""
);

-- ── Tabela CC ─────────────────────────────────────────────
CREATE TABLE cc (
    cc                   TEXT PRIMARY KEY,
    responsavel          TEXT DEFAULT "",
    tipo_contrato        TEXT DEFAULT "",
    tipo_centro_custo    TEXT DEFAULT "",
    centro_lucro         TEXT DEFAULT "",
    desc_cc              TEXT DEFAULT "",
    usuario_responsavel  TEXT DEFAULT ""
);

-- ── Tabela DEPARA ─────────────────────────────────────────
CREATE TABLE depara (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    legado          TEXT DEFAULT "",
    atual           TEXT DEFAULT "",
    tipologia_cc    TEXT DEFAULT "",
    desc_tipologia  TEXT DEFAULT "",
    up              INTEGER DEFAULT 0,
    desc_up         TEXT DEFAULT "",
    tipo_contrato   TEXT DEFAULT "",
    forma_controle  TEXT DEFAULT "",
    tipo_bem        TEXT DEFAULT "",
    unid_medida     TEXT DEFAULT ""
);

-- ── Índices para performance de busca ─────────────────────
CREATE INDEX idx_depara_up        ON depara(up);
CREATE INDEX idx_depara_tc        ON depara(tipo_contrato);
CREATE INDEX idx_depara_tipologia ON depara(tipologia_cc);
CREATE INDEX idx_depara_atual     ON depara(atual);
''')

cur.executemany('INSERT INTO uar VALUES (?,?)', uar_data)
cur.executemany('INSERT INTO cc VALUES (?,?,?,?,?,?,?)', cc_data)
cur.executemany(
    '''INSERT INTO depara
       (legado, atual, tipologia_cc, desc_tipologia, up, desc_up,
        tipo_contrato, forma_controle, tipo_bem, unid_medida)
       VALUES (?,?,?,?,?,?,?,?,?,?)''',
    dep_data
)

con.commit()
con.close()

# ── Relatório final ───────────────────────────────────────────────────────────
size_kb = os.path.getsize(DB_PATH) / 1024
print(f'\n✓ Banco gerado com sucesso!')
print(f'  Arquivo : {DB_PATH}')
print(f'  Tamanho : {size_kb:.0f} KB')
print(f'  uar     : {len(uar_data)} linhas')
print(f'  cc      : {len(cc_data)} linhas')
print(f'  depara  : {len(dep_data)} linhas')
print(f'\nPróximos passos:')
print(f'  git add db/classes_imo.db')
print(f'  git commit -m "chore: atualiza banco"')
print(f'  git push')
