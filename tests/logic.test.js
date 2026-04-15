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

  test('formatUAR: retorna vazio para inputs inválidos', () => {
    expect(logic.formatUAR(null)).toBe('');
    expect(logic.formatUAR(undefined)).toBe('');
    expect(logic.formatUAR('abc')).toBe('');
    expect(logic.formatUAR(-1)).toBe('');
  });

  test('getUP: retorna vazio para input inválido', () => {
    expect(logic.getUP('')).toBe('');
    expect(logic.getUP(null)).toBe('');
    expect(logic.getUP('123')).toBe('');
  });

  test('getDescUAR: retorna vazio para array inválido', () => {
    expect(logic.getDescUAR('0100001', null)).toBe('');
    expect(logic.getDescUAR('0100001', undefined)).toBe('');
  });

  test('getDescUPFromDepara: retorna vazio para array inválido', () => {
    expect(logic.getDescUPFromDepara(1, null)).toBe('');
    expect(logic.getDescUPFromDepara(1, undefined)).toBe('');
  });
});

const CC_SAMPLE = [
  { cc: '1000000000', responsavel: 'CARLOS AUGUSTO', tipoContrato: 'O', tipoCentroCusto: 'N', centroLucro: '1000000000', descCC: 'PRESIDÊNCIA', usuarioResponsavel: '131749' },
  { cc: '5100300100', responsavel: 'JOSE SILVA',     tipoContrato: 'U', tipoCentroCusto: 'L', centroLucro: '510000A100', descCC: 'PPP ALTO TIETÊ', usuarioResponsavel: '45678' },
  { cc: '5121001100', responsavel: 'MARIA COSTA',    tipoContrato: 'U', tipoCentroCusto: 'E', centroLucro: '510000A100', descCC: 'ETA ALTO COTIA', usuarioResponsavel: '12345' },
];

describe('Critério 2 – Centro de Custo', () => {
  test('getCL: extrai o 7º caractere do Centro de Lucro', () => {
    expect(logic.getCL('1000000000', CC_SAMPLE)).toBe('0');
    expect(logic.getCL('5100300100', CC_SAMPLE)).toBe('A');
    expect(logic.getCL('9999999999', CC_SAMPLE)).toBe('');
  });

  test('getDescCL: mapeia CL para descrição', () => {
    expect(logic.getDescCL('A')).toBe('Água');
    expect(logic.getDescCL('E')).toBe('Esgoto');
    expect(logic.getDescCL('G')).toBe('Geral');
    expect(logic.getDescCL('0')).toBe('Imobilizado');
    expect(logic.getDescCL('X')).toBe('');
  });

  test('getTC: retorna Tipo de Contrato do CC', () => {
    expect(logic.getTC('1000000000', CC_SAMPLE)).toBe('O');
    expect(logic.getTC('5100300100', CC_SAMPLE)).toBe('U');
    expect(logic.getTC('9999999999', CC_SAMPLE)).toBe('');
  });

  test('getDescTC: mapeia TC para descrição', () => {
    expect(logic.getDescTC('U')).toBe('URAE');
    expect(logic.getDescTC('O')).toBe('Outros');
    expect(logic.getDescTC('X')).toBe('');
  });

  test('getDescCC: retorna descrição do CC', () => {
    expect(logic.getDescCC('1000000000', CC_SAMPLE)).toBe('PRESIDÊNCIA');
    expect(logic.getDescCC('5100300100', CC_SAMPLE)).toBe('PPP ALTO TIETÊ');
    expect(logic.getDescCC('9999999999', CC_SAMPLE)).toBe('');
  });

  test('getCL: retorna vazio para centroLucro curto ou ausente', () => {
    const badCC = [{ cc: '1111111111', centroLucro: 'ABC' }];
    expect(logic.getCL('1111111111', badCC)).toBe('');
    expect(logic.getCL('1111111111', null)).toBe('');
  });
});
