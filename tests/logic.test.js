// Importa o módulo de lógica
const logic = require('../js/logic.js');

describe('lógica carregada', () => {
  test('módulo importa sem erros', () => {
    expect(logic).toBeDefined();
  });
});
