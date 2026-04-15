// app-v2.js — DOM e eventos (versão 2)
document.addEventListener('DOMContentLoaded', function () {

  const uarInput  = document.getElementById('uar-input');
  const uarList   = document.getElementById('uar-list');
  const uarDesc   = document.getElementById('uar-desc');
  const ccInput   = document.getElementById('cc-input');
  const ccList    = document.getElementById('cc-list');
  const ccDescEl  = document.getElementById('cc-desc');
  const btnCalc   = document.getElementById('btn-calcular');
  const resIncomp = document.getElementById('result-incompativel');

  // --- Popula datalists ---
  UAR_DATA.forEach(function (u) {
    const opt = document.createElement('option');
    opt.value = u.code;
    opt.label = u.code + ' \u2013 ' + u.desc;
    uarList.appendChild(opt);
  });

  CC_DATA.forEach(function (c) {
    const opt = document.createElement('option');
    opt.value = c.cc;
    opt.label = c.cc + ' \u2013 ' + c.descCC;
    ccList.appendChild(opt);
  });

  // --- Hints ao digitar ---
  uarInput.addEventListener('input', function () {
    const val = uarInput.value.trim();
    if (!val) { uarDesc.textContent = ''; return; }
    const formatted = formatUAR(val);
    const found = UAR_DATA.find(function (u) { return u.code === formatted; });
    uarDesc.textContent = found ? found.desc : 'UAR não encontrada';
  });

  ccInput.addEventListener('input', function () {
    const val = ccInput.value.trim();
    if (!val) { ccDescEl.textContent = ''; return; }
    const found = CC_DATA.find(function (c) { return c.cc === val; });
    ccDescEl.textContent = found ? found.descCC : 'CC não encontrado';
  });

  // --- Botão Calcular ---
  btnCalc.addEventListener('click', function () {
    const uarVal = uarInput.value.trim();
    const ccVal  = ccInput.value.trim();

    if (!uarVal || !ccVal) {
      alert('Preencha a UAR e o Centro de Custo antes de continuar.');
      return;
    }

    const result = calcularClasse(uarVal, ccVal, UAR_DATA, CC_DATA, DEPARA_DATA);
    exibirResultado(result);
  });

  function exibirResultado(r) {
    const incomp = r.ca === 'Incompatível';

    // Alerta de incompatibilidade
    resIncomp.style.display = incomp ? 'block' : 'none';

    // Inputs: atualiza desc pós-cálculo
    uarDesc.textContent  = r.descUAR || '';
    ccDescEl.textContent = r.descCC  || '';

    // Entradas derivadas — exibe código e descrição separadamente
    setText('res-tc',      r.tc);
    setText('res-desctc',  r.descTC);
    setText('res-tcc',     r.tcc);
    setText('res-desctcc', '');          // TCC não tem descrição própria na spec
    setText('res-cl',      r.cl);
    setText('res-desccl',  r.descCL);

    // FC / Grupo de Bens / UM
    setText('res-fc', r.fc  || (incomp ? '\u2014' : ''));
    setText('res-gb', r.gb  || (incomp ? '\u2014' : ''));
    setText('res-um', r.um  || (incomp ? '\u2014' : ''));

    // Classe do Ativo + Descrição
    const caBox = document.getElementById('res-ca');
    if (caBox) {
      caBox.textContent = r.ca || '\u2014';
      caBox.classList.toggle('incompativel', incomp);
    }
    setText('res-descup', r.descUP);

    // Matrícula / Nome Aprovador
    setText('res-mat',       r.mat       || (incomp ? '\u2014' : ''));
    setText('res-nomeaprov', r.nomeAprov || (incomp ? '\u2014' : ''));
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '\u2014';
  }
});
