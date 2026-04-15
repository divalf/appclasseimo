// logic.js — funções puras de negócio
// Compatível com Node.js (Jest) e browser

// UARs com classes fixas, independente do Centro de Custo
const SPECIAL_UARS = {
  '9100300': { ca: 'F1402000', descUP: 'DIREITO DE USO – CPC06' },
  '9100950': { ca: 'F1404000', descUP: 'EXTERNALIDADE' },
  '9100900': { ca: 'F1406000', descUP: 'DIREITO DE USO – SOFTWARE' },
  '9100800': { ca: 'F1407000', descUP: 'INFRA ESTRUTURA PARA ENERGIZAÇÃO ELÉTRICA' },
};

/**
 * Formata o código da UAR para 7 dígitos com zeros à esquerda.
 * Retorna '' para inputs inválidos (null, undefined, não-numérico).
 * @param {string|number} raw
 * @returns {string}
 */
function formatUAR(raw) {
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed) || parsed < 0) return '';
  return String(parsed).padStart(7, '0');
}

/**
 * Extrai os 2 primeiros caracteres da UAR formatada (Família/UP).
 * Retorna '' se o input não for uma string de 7 caracteres.
 * @param {string} uar7
 * @returns {string} ex: '01', '10', '91'
 */
function getUP(uar7) {
  if (!uar7 || typeof uar7 !== 'string' || uar7.length !== 7) return '';
  return uar7.substring(0, 2);
}

/**
 * Retorna a descrição (DescUAR) para uma UAR formatada.
 * @param {string} uar7
 * @param {Array} uarData
 * @returns {string}
 */
function getDescUAR(uar7, uarData) {
  if (!Array.isArray(uarData)) return '';
  const found = uarData.find(r => r.code === uar7);
  return found ? found.desc : '';
}

/**
 * Retorna a DescUP a partir do DEPARA pelo número da UP (inteiro).
 * @param {number} upNumber
 * @param {Array} deparaData
 * @returns {string}
 */
function getDescUPFromDepara(upNumber, deparaData) {
  if (!Array.isArray(deparaData)) return '';
  const found = deparaData.find(r => r.up === upNumber);
  return found ? found.descUP : '';
}

/**
 * Verifica se a UAR é especial (9100300, 9100950, 9100900, 9100800).
 * Retorna { ca, descUP } ou null.
 * @param {string} uar7
 * @returns {{ ca: string, descUP: string } | null}
 */
function getSpecialUAR(uar7) {
  return SPECIAL_UARS[uar7] || null;
}

/**
 * Extrai CL: 7º caractere do Centro de Lucro do CC.
 * @param {string} cc
 * @param {Array} ccData
 * @returns {string} 'A', 'E', 'G', '0', ou ''
 */
function getCL(cc, ccData) {
  if (!Array.isArray(ccData)) return '';
  const row = ccData.find(r => r.cc === cc);
  if (!row) return '';
  const cl = String(row.centroLucro);
  return cl.length >= 7 ? cl[6] : '';
}

/**
 * Mapeia CL para sua descrição.
 * @param {string} cl
 * @returns {string}
 */
function getDescCL(cl) {
  const map = { 'A': 'Água', 'E': 'Esgoto', 'G': 'Geral', '0': 'Imobilizado' };
  return map[cl] || '';
}

/**
 * Retorna o Tipo de Contrato (TC) do CC.
 * @param {string} cc
 * @param {Array} ccData
 * @returns {string} 'U', 'O', ou ''
 */
function getTC(cc, ccData) {
  if (!Array.isArray(ccData)) return '';
  const row = ccData.find(r => r.cc === cc);
  return row ? row.tipoContrato : '';
}

/**
 * Mapeia TC para sua descrição.
 * @param {string} tc
 * @returns {string} 'URAE', 'Outros', ou ''
 */
function getDescTC(tc) {
  const map = { 'U': 'URAE', 'O': 'Outros' };
  return map[tc] || '';
}

/**
 * Retorna a descrição do CC (DescCC).
 * @param {string} cc
 * @param {Array} ccData
 * @returns {string}
 */
function getDescCC(cc, ccData) {
  if (!Array.isArray(ccData)) return '';
  const row = ccData.find(r => r.cc === cc);
  return row ? row.descCC : '';
}

/**
 * Retorna o Tipo de Centro de Custo (TCC) do CC.
 * @param {string} cc
 * @param {Array} ccData
 * @returns {string}
 */
function getTCC(cc, ccData) {
  if (!Array.isArray(ccData)) return '';
  const row = ccData.find(r => r.cc === cc);
  return row ? row.tipoCentroCusto : '';
}

/**
 * Determina a Classe do Ativo (CA) conforme o Critério 4.
 * Retorna { ca, descUP, fc, gb, um } ou null se não encontrar.
 *
 * Regras especiais (antes do lookup no DEPARA):
 * - CL=A/E/G + TCC='-' + UP=1 → CA='PI129500'
 * - CL=A/E/G + TCC='-' + UP=2 → CA='PI129501'
 *
 * Para CL=A/E/G: filtra DEPARA por up===upNum, tipoContrato===DescTC, tipologiaCC===tcc
 * Para CL=0:     filtra DEPARA por up===upNum, tipoContrato==='Imobilizado'
 *
 * @param {string} cl    - 'A','E','G','0'
 * @param {string} tc    - 'U','O'
 * @param {string} tcc   - tipologia CC
 * @param {number} upNum - UP como número inteiro
 * @param {Array}  deparaData
 * @returns {{ ca: string, descUP: string, fc: string, gb: string, um: string } | null}
 */
function getCA(cl, tc, tcc, upNum, deparaData) {
  if (!Array.isArray(deparaData)) return null;

  if (cl === 'A' || cl === 'E' || cl === 'G') {
    // Casos especiais: TCC='-' com UP=01 ou UP=02
    if (tcc === '-' && upNum === 1) {
      return { ca: 'PI129500', descUP: '', fc: '', gb: '', um: '' };
    }
    if (tcc === '-' && upNum === 2) {
      return { ca: 'PI129501', descUP: '', fc: '', gb: '', um: '' };
    }
    const descTC = getDescTC(tc); // 'URAE' ou 'Outros'
    const row = deparaData.find(r =>
      r.up === upNum &&
      r.tipoContrato === descTC &&
      r.tipologiaCC === tcc
    );
    if (!row) return null;
    return { ca: row.atual, descUP: row.descUP, fc: row.formaControle, gb: row.tipoBem, um: row.unidMedida };
  }

  if (cl === '0') {
    const row = deparaData.find(r =>
      r.up === upNum &&
      r.tipoContrato === 'Imobilizado'
    );
    if (!row) return null;
    return { ca: row.atual, descUP: row.descUP, fc: row.formaControle, gb: row.tipoBem, um: row.unidMedida };
  }

  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatUAR, getUP, getDescUAR, getDescUPFromDepara, getSpecialUAR,
    getCL, getDescCL, getTC, getDescTC, getDescCC,
    getTCC, getCA,
  };
}
