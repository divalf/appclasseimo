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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatUAR, getUP, getDescUAR, getDescUPFromDepara, getSpecialUAR };
}
