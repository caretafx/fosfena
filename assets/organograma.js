/* Fosfena · organograma de módulo, no jeito de um node graph do Nuke.
   Organograma.render(el, plano, {admin, status, counts, onOpen})
   - backdrops = fases, nodes = aulas/etapas, pipes ligando tudo de cima para baixo.
   - o primeiro node com status 'agora' (ou o primeiro que não está feito) ganha o selo "Você está aqui". */
(function(){
  const LABEL = { feito: 'Feito', agora: 'Fazendo agora', proximo: 'Próximo', depois: 'Depois' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function flat(plano){ return plano.fases.flatMap(f => f.nodes.map(n => Object.assign({ fase: f }, n))); }

  function render(el, plano, o){
    o = o || {};
    const st = id => (o.status && o.status[id]) || null;
    const all = flat(plano).map(n => Object.assign(n, { status: st(n.id) || n.status }));
    const here = all.find(n => n.status === 'agora') || all.find(n => n.status !== 'feito');
    const done = all.filter(n => n.status === 'feito').length;
    const pct = Math.round(done / all.length * 100);

    let html = `<div class="og">
      <div class="og-top">
        <div><span class="og-code">${esc(plano.code)}</span><h2>${esc(plano.titulo)}</h2></div>
        <div class="og-prog" title="${done} de ${all.length} etapas feitas"><b>${done}/${all.length}</b><span>etapas feitas</span><i><em style="width:${pct}%"></em></i></div>
      </div>
      <div class="og-legend">${['feito','agora','proximo','depois'].map(k=>`<span class="og-l s-${k}"><i></i>${LABEL[k]}</span>`).join('')}</div>`;

    plano.fases.forEach((f, fi) => {
      if (fi) html += `<div class="og-pipe" aria-hidden="true"><i></i></div>`;
      html += `<section class="og-bd c-${esc(f.cor||'giz')}" aria-label="${esc(f.titulo)}">
        <header><span class="og-n">Fase ${fi+1}</span><h3>${esc(f.titulo)}</h3>${f.sub?`<p>${esc(f.sub)}</p>`:''}</header>
        <div class="og-row">`;
      f.nodes.forEach((n0, ni) => {
        const n = all.find(x => x.id === n0.id);
        const cnt = o.counts && o.counts[n.id] || 0;
        const isHere = here && here.id === n.id;
        if (ni) html += `<span class="og-link" aria-hidden="true"></span>`;
        html += `<${o.admin?'button type="button"':'div'} class="og-node s-${n.status}${isHere?' here':''}${n.pendente?' pend':''}" data-id="${esc(n.id)}">
          ${isHere?'<span class="og-here">Você está aqui</span>':''}
          <span class="og-band"></span>
          <span class="og-h"><span class="og-num">${n.n?('Aula '+String(n.n).padStart(2,'0')):'Etapa'}</span>${n.dur?`<span class="og-dur">${esc(n.dur)}</span>`:''}</span>
          <b class="og-t">${esc(n.titulo)}</b>
          ${n.topicos&&n.topicos.length?`<ul>${n.topicos.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}
          ${n.pendente?`<span class="og-pend">Conteúdo detalhado vem do .nknc</span>`:''}
          <span class="og-f"><span class="og-st">${LABEL[n.status]||''}</span>${o.admin?`<span class="og-files">${cnt?cnt+(cnt>1?' arquivos':' arquivo'):'Enviar arquivos'}</span>`:''}</span>
        </${o.admin?'button':'div'}>`;
      });
      html += `</div></section>`;
    });
    html += `</div>`;
    el.innerHTML = html;
    if (o.admin && o.onOpen) el.querySelectorAll('.og-node').forEach(b => b.addEventListener('click', () => o.onOpen(b.dataset.id)));
    return { here, all };
  }

  window.Organograma = { render, flat, LABEL };
})();
