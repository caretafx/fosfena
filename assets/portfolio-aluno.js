/* vfxstudio · tela "Portfólio" da área do aluno (aluno.html#portfolio).
   Usa FosPort (dados), FosPortUI (player com marcas) e as funções da página: esc, me, toast, fmtData, fsize, EMB, CC. */
(function(){
  const ACEITA='.mov,.mp4,.webm,.m4v,.png,.jpg,.jpeg,.exr';
  const pfData=d=>new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
  let aba='meus', abriu=null, modal=null, player=null;
  const curso=t=>t.curso==='flame'?'flame':'nuke';
  const nomeCurso=c=>c==='flame'?'Curso de Flame':'Curso de Nuke';
  function etapas(c){ const P=c==='flame'?window.FL101_PLANO:window.NK101_PLANO; if(!P) return [];
    return P.fases.map(f=>({fase:f.titulo, itens:f.nodes.map(n=>({id:n.id, titulo:`Aula ${String(n.n).padStart(2,'0')} · ${n.titulo}`}))})); }
  const etapaTxt=t=>t.etapa&&t.etapa.titulo?t.etapa.titulo:'Projeto livre';

  function card(t, vit){ const s=FosPort.status(t), n=FosPort.novos(t);
    const V=vit?FosPort.versaoVitrine(t):FosPort.ultima(t), cp=V.capa||t.capa;
    return `<button type="button" class="pf-card ${CC(curso(t))}" data-id="${t.id}">
      <span class="pf-thumb" style="${cp?`background-image:url('${cp}')`:''}"><span class="pf-v">v${String(V.n).padStart(2,'0')}</span>${t.destaque?'<span class="pf-star">Na vitrine</span>':''}</span>
      <span class="pf-b1"><span class="pf-eb">${esc(nomeCurso(curso(t)))} · ${esc(etapaTxt(t))}</span><h3>${esc(t.titulo)}</h3>
      <span class="pf-meta">${vit?`<span>${esc(t.aluno)}</span>`:`<span class="pf-pill ${s}">${s==='com-feedback'?'Com feedback':'Aguardando o professor'}</span>${n?`<span class="pf-pill novo">${n} novo${n>1?'s':''}</span>`:''}`}<span>${pfData(FosPort.ultima(t).data)}</span></span></span></button>`; }

  async function render(el){
    el.innerHTML=`<div class="pf-wrap" style="display:flex;flex-direction:column;gap:22px">
      <div class="pf-head"><div style="display:flex;flex-direction:column;gap:6px"><span class="eyebrow">Portfólio</span><h1 style="font-size:34px">Seu portfólio</h1>
        <p style="margin:0;color:var(--muted);max-width:64ch">Suba aqui os trabalhos do projetão. O professor assiste, marca os pontos no tempo, desenha em cima do frame e grava um vídeo comentando. Os melhores vão para a vitrine da turma.</p></div>
        <div class="pf-seg" role="group" aria-label="O que ver"><button type="button" data-aba="meus" aria-pressed="${aba==='meus'}">Meus trabalhos<em id="pfN" hidden></em></button><button type="button" data-aba="vitrine" aria-pressed="${aba==='vitrine'}">Vitrine da turma</button></div></div>
      <div id="pfBody"></div></div>`;
    el.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{ aba=b.dataset.aba; render(el); });
    const body=el.querySelector('#pfBody'), eu=me().name;
    const meus=await FosPort.meus(eu), n=meus.reduce((a,t)=>a+FosPort.novos(t),0), em=el.querySelector('#pfN'); em.hidden=!n; em.textContent=n;
    if(aba==='vitrine'){ const vs=await FosPort.vitrine();
      body.innerHTML=`<div style="display:flex;flex-direction:column;gap:16px">${vs.length?`<div class="pf-grid">${vs.map(t=>card(t,true)).join('')}</div>`:`<div class="pf-empty">A vitrine ainda está vazia. O professor escolhe os trabalhos que vão aparecer aqui, entre os alunos que deixaram.</div>`}
        <p class="pf-note">Só aparecem aqui trabalhos que o próprio aluno autorizou e que o professor escolheu. O feedback em vídeo continua sendo só seu.</p></div>`;
      body.querySelectorAll('.pf-card').forEach(c=>c.onclick=()=>abrir(c.dataset.id, true, el));
      return; }
    body.innerHTML=`<div style="display:flex;flex-direction:column;gap:18px">
      <div class="pf-row"><button type="button" class="btn btn-primary" id="pfNovo">＋ Novo trabalho</button><span class="hint">Vídeo (.mov, .mp4) ou imagem. Cada envio novo do mesmo trabalho vira uma versão (v01, v02…).</span></div>
      <div id="pfForm" hidden></div>
      ${meus.length?`<div class="pf-grid">${meus.map(t=>card(t,false)).join('')}</div>`:`<div class="pf-empty">Você ainda não subiu nenhum trabalho. Comece pelo que você fez no projetão: mesmo que não esteja pronto, o feedback ajuda a acertar o caminho.</div>`}
      ${FosPort.modo==='previa'?`<p class="pf-note"><b>Modo prévia:</b> por enquanto os vídeos ficam guardados neste navegador. Quando o servidor entrar no ar, eles passam a ir para a nuvem, sem mudar nada nesta tela.</p>`:''}</div>`;
    body.querySelector('#pfNovo').onclick=()=>{ const f=body.querySelector('#pfForm'); f.hidden=!f.hidden; if(!f.hidden) form(f, el); };
    body.querySelectorAll('.pf-card').forEach(c=>c.onclick=()=>abrir(c.dataset.id, false, el));
    if(abriu){ const id=abriu; abriu=null; abrir(id,false,el); }
  }

  function drop(box, onfile){ const inp=document.createElement('input'); inp.type='file'; inp.accept=ACEITA; inp.hidden=true; box.after(inp);
    box.onclick=()=>inp.click(); box.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); inp.click(); } };
    box.ondragover=e=>{ e.preventDefault(); box.classList.add('over'); }; box.ondragleave=()=>box.classList.remove('over');
    const set=f=>{ if(!f) return; onfile(f); box.classList.add('tem'); box.innerHTML=`<b>${esc(f.name)}</b><small>${fsize(f.size)} · clique para trocar</small>`; };
    box.ondrop=e=>{ e.preventDefault(); box.classList.remove('over'); set(e.dataTransfer.files[0]); }; inp.onchange=()=>{ set(inp.files[0]); inp.value=''; }; }

  function form(f, el){ let arq=null; const optEt=c=>etapas(c).map(g=>`<optgroup label="${esc(g.fase)}">${g.itens.map(i=>`<option value="${esc(i.id)}">${esc(i.titulo)}</option>`).join('')}</optgroup>`).join('');
    f.innerHTML=`<form class="pf-form" novalidate>
      <label class="full">Título do trabalho<input type="text" name="titulo" maxlength="120" required placeholder="Ex.: Troca de tela no celular, versão final"></label>
      <label>Curso<select name="curso"><option value="nuke">Curso de Nuke</option><option value="flame">Curso de Flame</option></select></label>
      <label>Etapa do projetão<select name="etapa"><option value="">Projeto livre</option>${optEt('nuke')}</select></label>
      <div class="full"><div class="pf-drop" tabindex="0" role="button" aria-label="Escolher o vídeo ou a imagem"><b>Arraste o render aqui</b> ou clique para escolher<small>${ACEITA.replace(/\./g,'').replace(/,/g,' · ')}</small></div></div>
      <label class="full">O que você fez e onde quer ajuda<textarea name="descricao" maxlength="2000" placeholder="Ex.: fiz o key com Keyer e limpei com FilterErode. Não sei se a borda do cabelo está boa."></textarea></label>
      <label class="pf-check full"><input type="checkbox" name="vitrine" checked><span>Pode aparecer na vitrine da turma<small>Se o professor escolher, os outros alunos veem o vídeo e o seu nome. O feedback continua só seu. Dá para mudar depois.</small></span></label>
      <div class="full pf-row"><button class="btn btn-primary" type="submit">Enviar para o professor</button><button class="btn btn-ghost" type="button" data-cancel>Cancelar</button><span class="hint" role="status" data-msg></span></div></form>`;
    const fm=f.querySelector('form'), msg=f.querySelector('[data-msg]');
    fm.curso.onchange=()=>{ fm.etapa.innerHTML=`<option value="">Projeto livre</option>${optEt(fm.curso.value)}`; };
    drop(f.querySelector('.pf-drop'), x=>arq=x);
    f.querySelector('[data-cancel]').onclick=()=>{ f.hidden=true; };
    fm.onsubmit=async e=>{ e.preventDefault(); const titulo=fm.titulo.value.trim();
      if(!titulo){ msg.textContent='Dê um título ao trabalho.'; fm.titulo.focus(); return; }
      if(!arq){ msg.textContent='Escolha o vídeo ou a imagem.'; return; }
      const btn=fm.querySelector('[type=submit]'); btn.disabled=true; msg.textContent='Enviando…';
      try{ try{ navigator.storage&&navigator.storage.persist&&navigator.storage.persist(); }catch(x){}
        const op=fm.etapa.selectedOptions[0];
        const t=await FosPort.criar({aluno:me().name, curso:fm.curso.value, etapa:fm.etapa.value?{id:fm.etapa.value, titulo:op.textContent}:null, titulo, descricao:fm.descricao.value.trim(), arquivo:arq, vitrine:fm.vitrine.checked});
        toast('Trabalho enviado. O professor vai comentar em vídeo.');
        if(window.FosGame) FosGame.award('port:'+t.id, 40, btn);
        render(el); }
      catch(x){ btn.disabled=false; msg.textContent='Não consegui guardar: o arquivo pode ser grande demais para a prévia.'; } };
    fm.titulo.focus(); }

  function fechar(){ if(player){ player.destruir(); player=null; } if(modal){ modal.remove(); modal=null; } document.removeEventListener('keydown',esc_); }
  const esc_=e=>{ if(e.key==='Escape') fechar(); };

  async function abrir(id, vit, el){
    fechar(); const t=await FosPort.get(id); if(!t) return;
    const eu=!vit&&t.aluno===me().name;
    let ver=vit?FosPort.versaoVitrine(t).n:FosPort.ultima(t).n;
    modal=document.createElement('div'); modal.className='pf-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label',t.titulo);
    modal.onclick=e=>{ if(e.target===modal) fechar(); };
    document.body.appendChild(modal); document.addEventListener('keydown',esc_);
    const draw=()=>{ const V=t.versoes.find(x=>x.n===ver), fbs=eu?t.feedbacks.filter(f=>f.versao===ver):[], marcas=fbs.flatMap(f=>f.marcas||[]).sort((a,b)=>a.t-b.t);
      modal.innerHTML=`<div class="pf-box ${CC(curso(t))}"><div class="pf-bh"><div><span class="pf-eb">${esc(nomeCurso(curso(t)))} · ${esc(etapaTxt(t))}${vit?` · ${esc(t.aluno)}`:''}</span><h2>${esc(t.titulo)}</h2></div><button class="pf-close" aria-label="Fechar">×</button></div>
        <div class="pf-bd"><div class="pf-main">
          ${eu&&t.versoes.length>1?`<div><span class="pf-lbl">Versões</span><div class="pf-vers">${t.versoes.map(x=>`<button type="button" data-v="${x.n}" aria-pressed="${x.n===ver}">v${String(x.n).padStart(2,'0')}${eu&&t.feedbacks.some(f=>f.versao===x.n)?'<i>✓</i>':''}</button>`).join('')}</div></div>`:''}
          <div id="pfPl"></div>
          ${marcas.length?`<p class="hint" style="margin:0">Os losangos na linha são as marcas do professor. Clique para ir ao ponto e ver o desenho em cima do frame.</p>`:''}
        </div><div class="pf-side">
          ${vit&&t.destaqueNota?`<div><span class="pf-lbl">Por que está na vitrine</span><p class="pf-txt">${esc(t.destaqueNota)}</p></div>`:''}
          ${(V.nota||(!vit&&ver===1&&t.descricao))?`<div><span class="pf-lbl">${eu?'Seu recado':'Recado do aluno'}</span><p class="pf-txt">${esc(ver===1?t.descricao:V.nota)}</p></div>`:''}
          ${eu?`<div><span class="pf-lbl">Feedback do professor · v${String(ver).padStart(2,'0')}</span>${fbs.length?fbs.map(f=>`<div class="pf-fb ${f.visto?'':'novo'}">
              <div class="pf-meta"><b style="color:var(--fg)">Professor</b><span>${fmtData(f.data)}</span>${f.visto?'':'<span class="pf-pill novo">novo</span>'}</div>
              ${f.video?`<video src="${FosPort.url(f.video)}" controls playsinline preload="metadata"></video>`:''}
              ${f.texto?`<p class="pf-txt">${esc(f.texto)}</p>`:''}
              ${f.marcas&&f.marcas.length?`<span class="hint">${f.marcas.length} marca${f.marcas.length>1?'s':''} no vídeo</span>`:''}</div>`).join(''):`<p class="hint" style="margin:0">O professor ainda não comentou esta versão. Você recebe aqui um vídeo dele comentando, com as marcas no tempo.</p>`}</div>
            <div><span class="pf-lbl">Mandar nova versão</span><div class="pf-drop" tabindex="0" role="button" aria-label="Escolher a nova versão" id="pfNv"><b>Arraste a v${String(FosPort.ultima(t).n+1).padStart(2,'0')}</b> ou clique<small>depois de aplicar o feedback</small></div>
              <textarea id="pfNvNota" maxlength="2000" placeholder="O que mudou nesta versão?" style="margin-top:8px;min-height:64px"></textarea>
              <div class="pf-row" style="margin-top:8px"><button type="button" class="pf-btn pri" id="pfNvGo" disabled>Enviar nova versão</button></div></div>
            <label class="pf-toggle"><input type="checkbox" id="pfVit" ${t.vitrine?'checked':''}><span>Pode aparecer na vitrine da turma<small>${t.destaque?'Está na vitrine agora.':'O professor escolhe quais entram.'}</small></span></label>
            <div class="pf-row"><button type="button" class="pf-btn del" id="pfDel">Apagar trabalho</button></div>`:''}
        </div></div></div>`;
      modal.querySelector('.pf-close').onclick=fechar;
      modal.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ ver=+b.dataset.v; draw(); });
      if(player) player.destruir();
      player=FosPortUI.player(modal.querySelector('#pfPl'), {src:FosPort.url(V.arquivo), tipo:V.arquivo.type, marcas});
      if(!eu) return;
      let nv=null; const go=modal.querySelector('#pfNvGo');
      drop(modal.querySelector('#pfNv'), f=>{ nv=f; go.disabled=false; });
      go.onclick=async()=>{ if(!nv) return; go.disabled=true; go.textContent='Enviando…';
        try{ const r=await FosPort.novaVersao(t.id,{arquivo:nv, nota:modal.querySelector('#pfNvNota').value.trim()}); Object.assign(t,r); ver=FosPort.ultima(t).n; toast(`v${String(ver).padStart(2,'0')} enviada para o professor.`); draw(); render(el); }
        catch(x){ go.disabled=false; go.textContent='Enviar nova versão'; toast('Não consegui guardar: o arquivo pode ser grande demais para a prévia.'); } };
      modal.querySelector('#pfVit').onchange=async e=>{ const r=await FosPort.autorizar(t.id, e.target.checked); Object.assign(t,r); toast(e.target.checked?'Liberado para a vitrine.':'Fora da vitrine.'); render(el); };
      modal.querySelector('#pfDel').onclick=async()=>{ const b=modal.querySelector('#pfDel'); if(b.dataset.ok!=='1'){ b.dataset.ok='1'; b.textContent='Clique de novo para apagar'; return; } await FosPort.apagar(t.id); fechar(); toast('Trabalho apagado.'); render(el); };
      /* abriu e tinha feedback novo: marca como visto e dá XP uma vez */
      if(FosPort.novos(t)){ FosPort.visto(t.id).then(()=>{ badge(); render(el); }); if(window.FosGame) FosGame.award('port-fb:'+t.id+':'+t.feedbacks.length, 15); }
      if(t.destaque&&window.FosGame) FosGame.award('port-vit:'+t.id, 60);
    };
    draw();
  }

  /* número de feedbacks novos no menu lateral */
  async function badge(){ const a=document.querySelector('#nav a[data-r="portfolio"]'); if(!a||!window.FosPort) return; let b=a.querySelector('.pf-nb');
    /* cria antes do await: duas chamadas seguidas não podem criar dois números */
    if(!b){ b=document.createElement('em'); b.className='pf-nb'; b.hidden=true; b.style.cssText='font-style:normal;font:600 11px "JetBrains Mono",monospace;background:#FFB547;color:#140c00;border-radius:99px;padding:1px 7px;margin-left:auto'; a.appendChild(b); }
    const n=(await FosPort.meus(me().name)).reduce((s,t)=>s+FosPort.novos(t),0);
    b.hidden=!n; b.textContent=n; b.title=n?`${n} feedback novo do professor`:''; }

  window.FosPortAluno={ render(el){ fechar(); render(el); badge(); }, fechar, badge };
  addEventListener('focus',badge);
})();
