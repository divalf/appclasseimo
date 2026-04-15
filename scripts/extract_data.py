import openpyxl
import json
import os

EXCEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'CLASSES_IMO_tmp.xlsx')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'js', 'data.js')

wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True, data_only=True)

# === ABA UAR ===
ws_uar = wb['UAR']
uar_rows = list(ws_uar.rows)
uar_data = []
for row in uar_rows[1:]:  # pula header
    code_raw = row[0].value
    desc = row[1].value
    if code_raw is None:
        continue
    code = str(int(code_raw)).zfill(7)
    uar_data.append({'code': code, 'desc': str(desc) if desc else ''})

# === ABA CENTROS DE CUSTO ===
ws_cc = wb['Centros de Custo']
cc_rows = list(ws_cc.rows)
cc_data = []
for row in cc_rows[2:]:  # header na linha 2, dados a partir da linha 3
    cc_val = row[0].value
    if cc_val is None:
        continue
    def safe(v):
        return str(v).strip() if v is not None else ''
    cc_data.append({
        'cc': safe(cc_val),
        'responsavel': safe(row[2].value),
        'tipoContrato': safe(row[4].value),
        'tipoCentroCusto': safe(row[5].value),
        'centroLucro': safe(row[16].value),
        'descCC': safe(row[20].value),
        'usuarioResponsavel': safe(row[29].value) if len(row) > 29 else '',
    })

# === ABA DEPARA ===
ws_dep = wb['DEPARA']
dep_rows = list(ws_dep.rows)
dep_data = []
for row in dep_rows[1:]:  # pula header
    legado = row[0].value
    if legado is None:
        continue
    def safe(v):
        return str(v).strip() if v is not None else ''
    up_raw = row[4].value
    # UP pode ser int (1,2,...30,91) ou string "IeA - ..."
    up_val = int(up_raw) if isinstance(up_raw, (int, float)) else safe(up_raw)
    dep_data.append({
        'legado': safe(legado),
        'atual': safe(row[1].value),
        'tipologiaCC': safe(row[2].value),
        'descTipologia': safe(row[3].value),
        'up': up_val,
        'descUP': safe(row[5].value),
        'tipoContrato': safe(row[6].value),
        'formaControle': safe(row[7].value),
        'tipoBem': safe(row[8].value),
        'unidMedida': safe(row[9].value),
    })

# === GERAR data.js ===
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    f.write('// Gerado automaticamente por scripts/extract_data.py — NÃO EDITAR\n')
    f.write('const UAR_DATA = ')
    f.write(json.dumps(uar_data, ensure_ascii=False, indent=2))
    f.write(';\n\n')
    f.write('const CC_DATA = ')
    f.write(json.dumps(cc_data, ensure_ascii=False, indent=2))
    f.write(';\n\n')
    f.write('const DEPARA_DATA = ')
    f.write(json.dumps(dep_data, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f'data.js gerado com {len(uar_data)} UARs, {len(cc_data)} CCs, {len(dep_data)} DEPARA rows.')
