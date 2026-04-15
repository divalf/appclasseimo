// logic.js — funções puras de negócio
// Compatível com Node.js (Jest) e browser

/**
 * Formata o código da UAR para 7 dígitos com zeros à esquerda.
 * @param {string|number} raw
 * @returns {string}
 */
function formatUAR(raw) {
  return String(parseInt(raw, 10)).padStart(7, '0');
}

/**
 * Extrai os 2 primeiros caracteres da UAR formatada (Família/UP).
 * @param {string} uar7 - UAR já formatada com 7 dígitos
 * @returns {string} ex: '01', '10', '91'
 */
function getUP(uar7) {
  return uar7.substring(0, 2);
}

/**
 * Retorna a descrição (DescUAR) para uma UAR formatada.
 * @param {string} uar7
 * @param {Array} uarData - array de { code, desc }
 * @returns {string}
 */
function getDescUAR(uar7, uarData) {
  const found = uarData.find(r => r.code === uar7);
  return found ? found.desc : '';
}

/**
 * Retorna a DescUP a partir do DEPARA pelo número da UP (inteiro).
 * @param {number} upNumber - ex: 1, 2, 10, 91
 * @param {Array} deparaData
 * @returns {string}
 */
function getDescUPFromDepara(upNumber, deparaData) {
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
  const SPECIAL = {
    '9100300': { ca: 'F1402000', descUP: 'DIREITO DE USO – CPC06' },
    '9100950': { ca: 'F1404000', descUP: 'EXTERNALIDADE' },
    '9100900': { ca: 'F1406000', descUP: 'DIREITO DE USO – SOFTWARE' },
    '9100800': { ca: 'F1407000', descUP: 'INFRA ESTRUTURA PARA ENERGIZAÇÃO ELÉTRICA' },
  };
  return SPECIAL[uar7] || null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatUAR, getUP, getDescUAR, getDescUPFromDepara, getSpecialUAR };
}
