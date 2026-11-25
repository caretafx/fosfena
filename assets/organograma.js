/* Fosfena · organograma horizontal (mapa em leque, da esquerda para a direita):
   módulo → fases → aulas → tópicos, com linhas retas saindo de um ponto do pai para cada filho.
   Fases e aulas abrem e fecham com um clique; a aula aberta mostra seus tópicos e o roteiro (via onOpen).
   Organograma.render(el, plano, {admin, status, counts, onOpen, selected})  → devolve {here, all, redraw} */
(function(){
  const LABEL = { feito: 'Feito', agora: 'Fazendo agora', proximo: 'Próximo', depois: 'Depois', planejado: 'Planejado' };
  const RM = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const flat = plano => plano.fases.flatMap(f => f.nodes.map(n => Object.assign({ fase: f }, n)));
  const SVGNS = 'http://www.w3.org/2000/svg';

  function render(el, plano, o){
    o = o || {};
    const all = flat(plano).map(n => Object.assign(n, { status: (o.status && o.status[n.id]) || n.status }));
    const here = all.find(n => n.status === 'agora') || (plano.proposta ? null : all.find(n => n.status !== 'feito'));
    const done = all.filter(n => n.status === 'feito').length, pct = Math.round(done / all.length * 100);
    const open = el._open || (el._open = new Set(plano.fases.map(f => f.id).concat(here ? [here.id] : [])));
    let sel = o.selected || null;

    const fileTxt = id => { const c = o.counts && o.counts[id] || 0; return c ? c + (c > 1 ? ' arquivos' : ' arquivo') : ''; };
    const lessonBox = n => `<button type="button" class="mb lv2 s-${n.status}${here&&here.id===n.id?' here':''}${n.pendente?' pend':''}${sel===n.id?' sel':''}" data-id="${esc(n.id)}" data-kind="aula" aria-expanded="${open.has(n.id)}">
        ${here&&here.id===n.id?'<span class="m-here">Você está aqui</span>':''}
        <span class="m-k"><i></i>${n.n?'Aula '+String(n.n).padStart(2,'0'):'Etapa'}${n.dur?' · '+esc(n.dur):''}</span>
        <b>${esc(n.titulo)}</b>
        <span class="m-f"><span class="m-st">${LABEL[n.status]}</span><span class="m-r">${n.roteiro?'Roteiro':n.pendente?'Roteiro em breve':'Ver aula'}${o.admin&&fileTxt(n.id)?' · '+fileTxt(n.id):''}</span></span>
        <span class="m-car" aria-hidden="true"></span>
      </button>`;
    const node = (box, kids, id) => `<div class="mn"${id?` data-n="${esc(id)}"`:''}>${box}${kids&&kids.length?`<div class="mk">${kids.join('')}</div>`:''}</div>`;

    const tree = node(
      `<div class="mb lv0"><small>${esc(plano.curso||'Curso')}</small><span class="m-code">${esc(plano.code)}</span><b>${esc(plano.titulo)}</b></div>`,
      plano.fases.map((f, i) => {
        const ns = f.nodes.map(n0 => all.find(x => x.id === n0.id));
        const fd = ns.filter(n => n.status === 'feito').length;
        return node(
          `<button type="button" class="mb lv1" data-id="${esc(f.id)}" data-kind="fase" aria-expanded="${open.has(f.id)}"><small>Fase ${i+1} · ${fd}/${ns.length}</small><b>${esc(f.titulo)}</b>${f.sub?`<span>${esc(f.sub)}</span>`:''}<span class="m-car" aria-hidden="true"></span></button>`,
          open.has(f.id) ? ns.map(n => node(lessonBox(n), open.has(n.id) && n.topicos ? n.topicos.map((t, ti) => node(`<div class="mb lv3">${esc(t)}</div>`, null, n.id + ':t' + ti)) : null, n.id)) : null,
          f.id);
      }).concat([node(`<div class="mb lv1 side"><small>Em todas as aulas</small><b>Prova no fim da aula</b></div>`, null, plano.code + ':prova')])
    );

    el.innerHTML = `<div class="og">
      <div class="og-top">
        <div class="og-legend">${['feito','agora','proximo','depois'].concat(all.some(n=>n.status==='planejado')?['planejado']:[]).map(k=>`<span class="og-l s-${k}"><i></i>${LABEL[k]}</span>`).join('')}<span class="og-tip">Clique numa fase para abrir ou fechar. Clique numa aula para ver o roteiro.</span></div>
        <div class="og-prog" title="${done} de ${all.length} etapas feitas"><b>${done}/${all.length}</b><span>etapas feitas</span><i><em style="width:${pct}%"></em></i></div>
      </div>
      <div class="m-scroll"><div class="m-map"><svg class="m-wires" aria-hidden="true"></svg>${tree}</div></div>
    </div>`;

    const map = el.querySelector('.m-map'), svg = el.querySelector('.m-wires');
    /* Animação: o que acabou de aparecer entra crescendo a partir do pai; os galhos novos se desenham. */
    const prev = el._shown, shown = new Set(), fresh = new Set();
    map.querySelectorAll('.mn[data-n]').forEach(mn => { const id = mn.dataset.n; shown.add(id); if (!prev || !prev.has(id)) fresh.add(id); });
    el._shown = shown;
    const anim = !RM();
    if (anim) map.querySelectorAll('.mn[data-n]').forEach(mn => { if (!fresh.has(mn.dataset.n)) return;
      const i = Array.prototype.indexOf.call(mn.parentElement.children, mn);
      const box = mn.querySelector(':scope > .mb'); box.style.setProperty('--d', (prev ? 120 : depth(mn) * 160) + i * 45 + 'ms'); box.classList.add('m-in'); });
    function depth(mn){ let d = 0, p = mn.parentElement; while (p && p !== map) { if (p.classList.contains('mk')) d++; p = p.parentElement; } return d; }
    const grown = new Map();
    function redraw(){
      const R = map.getBoundingClientRect();
      svg.setAttribute('width', map.scrollWidth); svg.setAttribute('height', map.scrollHeight);
      svg.textContent = '';
      map.querySelectorAll('.mn').forEach(mn => {
        const kids = mn.querySelector(':scope > .mk'); if (!kids) return;
        const pb = mn.querySelector(':scope > .mb').getBoundingClientRect();
        const x1 = pb.right - R.left + 2, y1 = pb.top + pb.height/2 - R.top;
        const lvl = mn.querySelector(':scope > .mb').className.match(/lv(\d)/)[1];
        kids.querySelectorAll(':scope > .mn > .mb').forEach(cb => {
          const c = cb.getBoundingClientRect();
          /* galho levemente curvo: sai reto do pai e chega reto no filho */
          const l = document.createElementNS(SVGNS, 'path');
          const x2 = c.left - R.left - 2, y2 = c.top + c.height/2 - R.top, k = (x2 - x1) * .55;
          l.setAttribute('d', `M${x1},${y1} C${x1 + k},${y1} ${x2 - k},${y2} ${x2},${y2}`);
          l.setAttribute('class', 'w w' + lvl + (cb.classList.contains('side') ? ' dash' : '') + (cb.classList.contains('here') || cb.classList.contains('sel') ? ' hot' : ''));
          const cid = cb.parentElement.dataset.n; if (cid) l.dataset.c = cid;
          svg.appendChild(l);
          if (anim && cid && fresh.has(cid)) {
            /* o galho se desenha; se a árvore for redesenhada no meio, a animação continua de onde estava */
            if (!grown.has(cid)) grown.set(cid, { t0: performance.now(), d: parseFloat(cb.style.getPropertyValue('--d')) || 0 });
            const g = grown.get(cid), left = g.d + 420 - (performance.now() - g.t0);
            if (left > 0) { const len = l.getTotalLength ? l.getTotalLength() + 2 : Math.hypot(x2 - x1, y2 - y1) * 1.2;
              if (!cb.classList.contains('side')) l.style.strokeDasharray = len;
              l.style.strokeDashoffset = len;
              l.style.animation = `m-grow .42s cubic-bezier(.2,.7,.2,1) ${g.d - (performance.now() - g.t0)}ms forwards`; } }
        });
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('cx', x1); dot.setAttribute('cy', y1); dot.setAttribute('r', 3.5); dot.setAttribute('class', 'wd wd' + lvl);
        svg.appendChild(dot);
      });
    }
    redraw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
    if (el._ro) el._ro.disconnect();
    if (window.ResizeObserver){ el._ro = new ResizeObserver(redraw); el._ro.observe(map); }

    el.querySelectorAll('button.mb').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.id;
      let closing = false;
      if (b.dataset.kind === 'fase'){ closing = open.has(id); closing ? open.delete(id) : open.add(id); }
      else { if (sel === id && open.has(id)) { open.delete(id); sel = null; closing = true; } else { open.add(id); sel = id; } }
      const kids = b.parentElement.querySelector(':scope > .mk');
      if (closing && kids && !RM()) {
        /* fechar: os galhos recolhem e somem antes de redesenhar */
        kids.classList.add('m-out'); b.classList.remove('sel');
        kids.querySelectorAll('.mn[data-n]').forEach(mn => svg.querySelectorAll(`[data-c="${CSS.escape(mn.dataset.n)}"]`).forEach(l => l.classList.add('w-out')));
        setTimeout(() => rerender(b, id), 230);
      } else rerender(b, id);
    }));
    function rerender(b, id){
      const sx = el.querySelector('.m-scroll').scrollLeft;
      render(el, plano, Object.assign({}, o, { selected: sel }));
      el.querySelector('.m-scroll').scrollLeft = sx;
      if (b.dataset.kind === 'aula' && sel && o.onOpen) o.onOpen(id);
      const again = el.querySelector(`button.mb[data-id="${CSS.escape(id)}"]`); if (again) again.focus({ preventScroll: true });
    }
    return { here, all, redraw };
  }

  /* HTML do roteiro de uma aula, para a gaveta de detalhes. */
  function roteiroHTML(n){
    if (n.roteiro && n.roteiro.length) return `${n.objetivo?`<p class="rot-obj">${esc(n.objetivo)}</p>`:''}<ol class="rot">${n.roteiro.map(r=>`<li class="${r.tipo==='exercicio'?'ex':'tec'}"><b>${r.tc?`<code class="rot-tc">${esc(r.tc)}</code>`:''}${esc(r.t)}${(r.tipo==='exercicio'?'Exercício':'Técnica')===r.t?'':` <em>${r.tipo==='exercicio'?'Exercício':'Técnica'}</em>`}</b><span>${esc(r.txt)}</span></li>`).join('')}</ol>${n.roteiroFonte?`<p class="rot-src">${esc(n.roteiroFonte)}</p>`:''}`;
    if (n.pendente) return `<p class="rot-empty">O roteiro desta aula vai ser escrito a partir do Projeto_aulas_v02.nknc, assim que o arquivo for lido.</p>`;
    return `<p class="rot-empty">Aula gravada. Os tópicos abaixo resumem o que ela cobre.</p>`;
  }
  window.Organograma = { render, flat, LABEL, roteiroHTML, esc };
})();
