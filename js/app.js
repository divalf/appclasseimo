// app.js — DOM e eventos
document.addEventListener('DOMContentLoaded', function () {

  const uarInput   = document.getElementById('uar-input');
  const uarList    = document.getElementById('uar-list');
  const uarDesc    = document.getElementById('uar-desc');
  const ccInput    = document.getElementById('cc-input');
  const ccList     = document.getElementById('cc-list');
  const ccDescEl   = document.getElementById('cc-desc');
  const btnCalc    = document.getElementById('btn-calcular');
  const resultSec  = document.getElementById('result-section');
  const resIncomp  = document.getElementById('result-incompativel');

  // --- Popula datalists ---
  // UAR: mostra "código – descrição"
  UAR_DATA.forEach(function (u) {
    const opt = document.createElement('option');
    opt.value = u.code;
    opt.label = u.code + ' \u2013 ' + u.desc;
    uarList.appendChild(opt);
  });

  // CC: mostra "código – descrição"
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
    resultSec.style.display = 'block';
    resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const incomp = r.ca === 'Incompatível';
    resIncomp.style.display = incomp ? 'block' : 'none';

    setText('res-ca',        r.ca,        incomp);
    setText('res-descup',    r.descUP);
    setText('res-uar',       r.uar);
    setText('res-descuar',   r.descUAR);
    setText('res-up',        r.up);
    setText('res-cc',        r.cc);
    setText('res-desccc',    r.descCC);
    setText('res-cl',        r.cl + (r.descCL ? ' \u2013 ' + r.descCL : ''));
    setText('res-tc',        r.tc + (r.descTC ? ' \u2013 ' + r.descTC : ''));
    setText('res-fc',        r.fc  || (incomp ? '\u2014' : ''));
    setText('res-gb',        r.gb  || (incomp ? '\u2014' : ''));
    setText('res-um',        r.um  || (incomp ? '\u2014' : ''));
    setText('res-nomeaprov', r.nomeAprov || (incomp ? '\u2014' : ''));
    setText('res-mat',       r.mat || (incomp ? '\u2014' : ''));

    // Destaque no card de CA
    const caItem = document.getElementById('res-ca');
    if (caItem) {
      caItem.parentElement.classList.toggle('highlight', !incomp);
      caItem.classList.toggle('incompativel', incomp);
    }
  }

  function setText(id, value, isError) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value || '\u2014';
      el.classList.toggle('incompativel', !!isError);
    }
  }
});
