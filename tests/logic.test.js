// Importa o módulo de lógica
const logic = require('../js/logic.js');

// Dados de teste mínimos
const UAR_SAMPLE = [
  { code: '0100001', desc: 'TERRENO' },
  { code: '0200007', desc: 'BACIA DISSIPAÇÃO' },
  { code: '1000001', desc: 'ESTAÇÃO DE TRATAMENTO' },
];

const DEPARA_SAMPLE = [
  { legado: '13010101', atual: '13010101', tipologiaCC: '-', descTipologia: '-', up: 1, descUP: 'Terrenos', tipoContrato: 'Imobilizado', formaControle: 'Individual', tipoBem: 'Imóvel', unidMedida: 'M2' },
  { legado: '13010104', atual: '13010104', tipologiaCC: '-', descTipologia: '-', up: 2, descUP: 'Estruturas de Saneamento', tipoContrato: 'Imobilizado', formaControle: 'Individual', tipoBem: 'Imóvel', unidMedida: 'un' },
  { legado: 'AC140101', atual: 'AU140101', tipologiaCC: 'D', descTipologia: 'Adm. da Operação', up: 1, descUP: 'Terrenos', tipoContrato: 'URAE', formaControle: 'Individual', tipoBem: 'Imóvel', unidMedida: 'M2' },
];

describe('Critério 1 – UAR', () => {
  test('formatUAR: padeia com zeros à esquerda para 7 dígitos', () => {
    expect(logic.formatUAR(100001)).toBe('0100001');
    expect(logic.formatUAR('100001')).toBe('0100001');
    expect(logic.formatUAR('9100300')).toBe('9100300');
    expect(logic.formatUAR(200007)).toBe('0200007');
  });

  test('getUP: retorna os 2 primeiros caracteres da UAR formatada', () => {
    expect(logic.getUP('0100001')).toBe('01');
    expect(logic.getUP('1000001')).toBe('10');
    expect(logic.getUP('9100300')).toBe('91');
  });

  test('getDescUAR: retorna descrição da UAR da lista de dados', () => {
    expect(logic.getDescUAR('0100001', UAR_SAMPLE)).toBe('TERRENO');
    expect(logic.getDescUAR('0200007', UAR_SAMPLE)).toBe('BACIA DISSIPAÇÃO');
    expect(logic.getDescUAR('9999999', UAR_SAMPLE)).toBe('');
  });

  test('getDescUPFromDepara: retorna DescUP pela UP numérica', () => {
    expect(logic.getDescUPFromDepara(1, DEPARA_SAMPLE)).toBe('Terrenos');
    expect(logic.getDescUPFromDepara(2, DEPARA_SAMPLE)).toBe('Estruturas de Saneamento');
    expect(logic.getDescUPFromDepara(99, DEPARA_SAMPLE)).toBe('');
  });

  test('getSpecialUAR: retorna CA e DescUP para UARs especiais', () => {
    expect(logic.getSpecialUAR('9100300')).toEqual({ ca: 'F1402000', descUP: 'DIREITO DE USO – CPC06' });
    expect(logic.getSpecialUAR('9100950')).toEqual({ ca: 'F1404000', descUP: 'EXTERNALIDADE' });
    expect(logic.getSpecialUAR('9100900')).toEqual({ ca: 'F1406000', descUP: 'DIREITO DE USO – SOFTWARE' });
    expect(logic.getSpecialUAR('9100800')).toEqual({ ca: 'F1407000', descUP: 'INFRA ESTRUTURA PARA ENERGIZAÇÃO ELÉTRICA' });
    expect(logic.getSpecialUAR('0100001')).toBeNull();
  });
});
