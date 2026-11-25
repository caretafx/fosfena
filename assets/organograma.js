/* Fosfena · organograma em árvore (de cima para baixo), como um organograma clássico:
   curso → módulo → fases (colunas) → aulas → tópicos, com linhas retas ligando pai e filhos.
   Organograma.render(el, plano, {admin, status, counts, onOpen})
   O primeiro node com status 'agora' (ou o primeiro que não está feito) ganha o selo "Você está aqui". */
(function(){
  const LABEL = { feito: 'Feito', agora: 'Fazendo agora', proximo: 'Próximo', depois: 'Depois' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function flat(plano){ return plano.fases.flatMap(f => f.nodes.map(n => Object.assign({ fase: f }, n))); }

  function render(el, plano, o){
    o = o || {};
    const all = flat(plano).map(n => Object.assign(n, { status: (o.status && o.status[n.id]) || n.status }));
    const here = all.find(n => n.status === 'agora') || all.find(n => n.status !== 'feito');
    const done = all.filter(n => n.status === 'feito').length;
    const pct = Math.round(done / all.length * 100);
    const tag = o.admin ? 'button type="button"' : 'div', end = o.admin ? 'button' : 'div';

    const lesson = n => {
      const cnt = o.counts && o.counts[n.id] || 0, isHere = here && here.id === n.id;
      return `<li><${tag} class="ob l3 s-${n.status}${isHere?' here':''}${n.pendente?' pend':''}" data-id="${esc(n.id)}">
          ${isHere?'<span class="ot-here">Você está aqui</span>':''}
          <span class="ob-k"><i></i>${n.n?'Aula '+String(n.n).padStart(2,'0'):'Etapa'}${n.dur?` · ${esc(n.dur)}`:''}</span>
          <b>${esc(n.titulo)}</b>
          <span class="ob-st">${LABEL[n.status]||''}${o.admin?` <em>${cnt?'· '+cnt+(cnt>1?' arquivos':' arquivo'):'· enviar arquivos'}</em>`:''}</span>
        </${end}>
        ${n.topicos&&n.topicos.length?`<ul class="ot-sp">${n.topicos.map(t=>`<li><div class="ob l4">${esc(t)}</div></li>`).join('')}</ul>`:''}
      </li>`;
    };

    el.innerHTML = `<div class="og">
      <div class="og-top">
        <div class="og-legend">${['feito','agora','proximo','depois'].map(k=>`<span class="og-l s-${k}"><i></i>${LABEL[k]}</span>`).join('')}</div>
        <div class="og-prog" title="${done} de ${all.length} etapas feitas"><b>${done}/${all.length}</b><span>etapas feitas</span><i><em style="width:${pct}%"></em></i></div>
      </div>
      <div class="ot-scroll"><div class="ot">
        <div class="ot-chain">
          <div class="ob l0">${esc(plano.curso||'Curso')}</div>
          <span class="ot-v"></span>
          <div class="ob l1"><small>${esc(plano.code)}</small>${esc(plano.titulo)}</div>
          <div class="ot-mid"><span class="ot-v"></span><div class="ot-side"><div class="ob side">Prova no fim de cada aula</div><span class="ot-dash"></span></div></div>
        </div>
        <ul class="ot-cols">${plano.fases.map((f,i)=>`<li>
          <div class="ob l2"><small>Fase ${i+1}</small>${esc(f.titulo)}${f.sub?`<span>${esc(f.sub)}</span>`:''}</div>
          <ul class="ot-sp">${f.nodes.map(n0=>lesson(all.find(x=>x.id===n0.id))).join('')}</ul>
        </li>`).join('')}</ul>
      </div></div>
    </div>`;
    if (o.admin && o.onOpen) el.querySelectorAll('button.l3').forEach(b => b.addEventListener('click', () => o.onOpen(b.dataset.id)));
    return { here, all };
  }
  window.Organograma = { render, flat, LABEL };
})();
