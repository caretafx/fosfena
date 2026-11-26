/* vfxstudio · Portfólio dentro da Revisão do painel do professor (admin.html).
   Estúdio de review: player com marcas no tempo e desenho no frame, gravação da tela desta aba com a voz (e a câmera, se quiser),
   texto geral e escolha da vitrine. Usa FosPort, FosPortUI e as funções da página: esc, toast, size. */
(function(){
  let fSt='aguardando', fCu='', modal=null, player=null, rec=null, cam=null, recTimer=null;
  const curso=t=>t.curso==='flame'?'flame':'nuke', CCx=c=>c==='flame'?'c-fl':'c-nk';
  const nomeCurso=c=>c==='flame'?'Curso de Flame':'Curso de Nuke';
  const etapaTxt=t=>t.etapa&&t.etapa.titulo?t.etapa.titulo:'Projeto livre';
  const fD=d=>new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})+' · '+new Date(d).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const vv=n=>'v'+String(n).padStart(2,'0');

  async function pendentes(){ return (await FosPort.todos()).filter(t=>FosPort.status(t)==='aguardando').length; }

  async function render(){
    const box=document.getElementById('lPort'); if(!box) return;
    const all=await FosPort.todos();
    const l=all.filter(t=>(!fCu||curso(t)===fCu)&&(fSt==='vitrine'?t.destaque:!fSt||FosPort.status(t)===fSt));
    box.innerHTML=l.length?`<div class="pf-grid">${l.map(t=>{ const s=FosPort.status(t); return `<button type="button" class="pf-card ${CCx(curso(t))}" data-id="${t.id}">
        <span class="pf-thumb" style="${t.capa?`background-image:url('${t.capa}')`:''}"><span class="pf-v">${vv(FosPort.ultima(t).n)}</span>${t.destaque?'<span class="pf-star">Na vitrine</span>':''}</span>
        <span class="pf-b1"><span class="pf-eb">${esc(nomeCurso(curso(t)))} · ${esc(etapaTxt(t))}</span><h3>${esc(t.titulo)}</h3>
        <span class="pf-meta"><b style="color:var(--fg)">${esc(t.aluno)}</b><span class="pf-pill ${s}">${s==='com-feedback'?'Com feedback':'Esperando feedback'}</span><span>${fD(FosPort.ultima(t).data)}</span></span></span></button>`; }).join('')}</div>`
      :`<div class="pf-empty">${fSt==='aguardando'?'Nenhum trabalho esperando feedback.':fSt==='vitrine'?'Nada na vitrine ainda. Abra um trabalho com feedback e marque "Colocar na vitrine".':'Nada por aqui.'}</div>`;
    box.querySelectorAll('.pf-card').forEach(c=>c.onclick=()=>abrir(c.dataset.id));
    const n=all.filter(t=>FosPort.status(t)==='aguardando').length, em=document.getElementById('pfAdmN'); if(em){ em.hidden=!n; em.textContent=n; }
  }

  function pararCam(){ if(cam){ cam.stream.getTracks().forEach(t=>t.stop()); cam.el.remove(); cam=null; } }
  function fechar(){ if(rec){ rec.cancelar(); rec=null; } clearInterval(recTimer); document.querySelectorAll('.pf-recbar').forEach(x=>x.remove()); pararCam();
    if(player){ player.destruir(); player=null; } if(modal){ modal.remove(); modal=null; } document.removeEventListener('keydown',escK); }
  const escK=e=>{ if(e.key==='Escape'&&!rec) fechar(); };

  async function abrir(id){
    fechar(); let t=await FosPort.get(id); if(!t) return;
    let ver=FosPort.ultima(t).n, video=null, marcas=[];
    modal=document.createElement('div'); modal.className='pf-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label','Revisar '+t.titulo);
    document.body.appendChild(modal); document.addEventListener('keydown',escK);
    const draw=()=>{ const V=t.versoes.find(x=>x.n===ver), fbs=t.feedbacks.filter(f=>f.versao===ver);
      modal.innerHTML=`<div class="pf-box ${CCx(curso(t))}"><div class="pf-bh"><div><span class="pf-eb">${esc(nomeCurso(curso(t)))} · ${esc(etapaTxt(t))} · ${esc(t.aluno)}</span><h2>${esc(t.titulo)}</h2></div><button class="pf-close" aria-label="Fechar">×</button></div>
        <div class="pf-bd"><div class="pf-main">
          <div class="pf-row" style="justify-content:space-between"><div class="pf-vers">${t.versoes.map(x=>`<button type="button" data-v="${x.n}" aria-pressed="${x.n===ver}">${vv(x.n)}${t.feedbacks.some(f=>f.versao===x.n)?'<i>✓</i>':''}</button>`).join('')}</div>
            <a class="pf-btn" href="${FosPort.url(V.arquivo)}" download="${esc(V.arquivo.name)}">Baixar ${esc(vv(ver))} · ${size(V.arquivo.size||0)}</a></div>
          <div id="pfPl" tabindex="-1"></div>
          <p class="hint" style="margin:0;font-size:12.5px;color:var(--muted)">Pause no frame, clique em <b>Desenhar</b> (ou tecla D), risque em cima e escreva a nota. Cada marca vira um losango na linha do tempo do aluno.</p>
        </div><div class="pf-side">
          ${(ver===1?t.descricao:V.nota)?`<div><span class="pf-lbl">Recado do aluno · ${vv(ver)}</span><p class="pf-txt">${esc(ver===1?t.descricao:V.nota)}</p></div>`:''}
          <div><span class="pf-lbl">Feedback em vídeo</span>
            <div id="pfVid"></div></div>
          <div><span class="pf-lbl">Comentário geral</span><textarea id="pfTxt" maxlength="4000" placeholder="Resumo do que está bom e do que ajustar para a próxima versão."></textarea></div>
          <div class="pf-row"><button type="button" class="pf-btn pri" id="pfSend" disabled>Enviar feedback para ${esc(t.aluno)}</button><span class="hint" id="pfSum" style="font-size:12.5px;color:var(--muted)"></span></div>
          <div style="border-top:1px solid var(--line);padding-top:14px;display:flex;flex-direction:column;gap:8px"><span class="pf-lbl" style="margin:0">Vitrine da turma</span>
            ${t.vitrine?`<label class="pf-toggle"><input type="checkbox" id="pfDest" ${t.destaque?'checked':''}><span>Colocar na vitrine${t.destaque&&t.destaqueVersao?` (${vv(t.destaqueVersao)})`:''}<small>Entra a versão mais recente${t.destaque?' do momento em que você marcou':''}. Os alunos veem o vídeo e o nome. O feedback continua privado.</small></span></label>
              <textarea id="pfDestN" maxlength="280" style="min-height:60px" placeholder="Por que está na vitrine (opcional). Ex.: integração de luz muito boa.">${esc(t.destaqueNota||'')}</textarea>`
              :`<p class="hint" style="margin:0;font-size:13px;color:var(--muted)">${esc(t.aluno)} não liberou este trabalho para a vitrine.</p>`}</div>
          ${fbs.length?`<div><span class="pf-lbl">Feedbacks já enviados · ${vv(ver)}</span>${fbs.map(f=>`<div class="pf-fb" data-f="${f.id}"><div class="pf-meta"><span>${fD(f.data)}</span><span>${f.visto?'Visto pelo aluno':'Ainda não visto'}</span>${f.marcas&&f.marcas.length?`<span>${f.marcas.length} marca${f.marcas.length>1?'s':''}</span>`:''}</div>
              ${f.video?`<video src="${FosPort.url(f.video)}" controls playsinline preload="metadata"></video>`:''}${f.texto?`<p class="pf-txt">${esc(f.texto)}</p>`:''}
              <div class="pf-row">${f.marcas&&f.marcas.length?'<button type="button" class="pf-btn" data-ver>Ver marcas no player</button>':''}<button type="button" class="pf-btn del" data-apaga>Apagar</button></div></div>`).join('')}</div>`:''}
          <div class="pf-row" style="margin-top:auto"><button type="button" class="pf-btn del" id="pfDelT">Apagar trabalho</button></div>
        </div></div></div>`;
      modal.querySelector('.pf-close').onclick=()=>{ if(rec) return toast('Pare a gravação antes de fechar.'); fechar(); };
      modal.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ if(rec) return; ver=+b.dataset.v; video=null; marcas=[]; draw(); });
      if(player) player.destruir();
      player=FosPortUI.player(modal.querySelector('#pfPl'), {src:FosPort.url(V.arquivo), tipo:V.arquivo.type, marcas:[], editar:true, onchange:m=>{ marcas=m; pronto(); }});
      const txt=modal.querySelector('#pfTxt'), send=modal.querySelector('#pfSend'), sum=modal.querySelector('#pfSum');
      const pronto=()=>{ const ok=!!(video||txt.value.trim()||marcas.length); send.disabled=!ok||!!rec;
        sum.textContent=[video?'vídeo':'', marcas.length?marcas.length+' marca'+(marcas.length>1?'s':''):'', txt.value.trim()?'texto':''].filter(Boolean).join(' + '); };
      txt.oninput=pronto;
      vidUI(modal.querySelector('#pfVid'), ()=>video, v=>{ video=v; pronto(); });
      send.onclick=async()=>{ send.disabled=true; send.textContent='Enviando…';
        try{ t=await FosPort.feedback(t.id,{versao:ver, video, texto:txt.value.trim(), marcas}); video=null; marcas=[]; toast('Feedback enviado. O aluno vê no portfólio dele.'); draw(); render(); badge(); }
        catch(e){ send.disabled=false; send.textContent='Enviar feedback'; toast('Não consegui guardar o feedback: o vídeo pode ser grande demais para a prévia.'); } };
      const dest=modal.querySelector('#pfDest'), destN=modal.querySelector('#pfDestN');
      if(dest){ dest.onchange=async()=>{ t=await FosPort.destacar(t.id, dest.checked, destN.value.trim()); toast(dest.checked?'Na vitrine da turma.':'Saiu da vitrine.'); render(); };
        destN.onchange=async()=>{ t=await FosPort.destacar(t.id, t.destaque, destN.value.trim()); }; }
      modal.querySelectorAll('[data-f]').forEach(c=>{ const f=t.feedbacks.find(x=>x.id===c.dataset.f);
        const vb=c.querySelector('[data-ver]'); if(vb) vb.onclick=()=>{ player.destruir(); player=FosPortUI.player(modal.querySelector('#pfPl'),{src:FosPort.url(V.arquivo), tipo:V.arquivo.type, marcas:f.marcas}); modal.querySelector('#pfPl').scrollIntoView({behavior:'smooth',block:'center'}); toast('Mostrando as marcas enviadas. Troque de versão ou reabra para fazer um feedback novo.'); };
        c.querySelector('[data-apaga]').onclick=async e=>{ const b=e.currentTarget; if(b.dataset.ok!=='1'){ b.dataset.ok='1'; b.textContent='Clique de novo'; return; } t=await FosPort.apagarFeedback(t.id,f.id); draw(); render(); badge(); }; });
      modal.querySelector('#pfDelT').onclick=async e=>{ const b=e.currentTarget; if(b.dataset.ok!=='1'){ b.dataset.ok='1'; b.textContent='Clique de novo para apagar o trabalho'; return; } await FosPort.apagar(t.id); fechar(); toast('Trabalho apagado.'); render(); badge(); };
      pronto();
    };
    draw();
  }

  /* bloco do vídeo de feedback: gravar a tela desta aba (com voz e câmera opcional) ou subir um vídeo pronto */
  function vidUI(el, get, set){
    const pode=FosPort.podeGravar();
    const paint=()=>{ const v=get();
      if(v){ const u=URL.createObjectURL(v); el.innerHTML=`<div class="pf-fb" style="border-color:rgba(255,181,71,.5)"><video src="${u}" controls playsinline></video><div class="pf-meta"><span>${esc(v.name)}</span><span>${size(v.size)}</span></div><div class="pf-row"><button type="button" class="pf-btn" data-re>Gravar de novo</button><button type="button" class="pf-btn del" data-x>Descartar</button></div></div>`;
        el.querySelector('[data-re]').onclick=()=>{ set(null); paint(); }; el.querySelector('[data-x]').onclick=()=>{ set(null); paint(); }; return; }
      el.innerHTML=`<div style="display:flex;flex-direction:column;gap:10px">
        <div class="pf-row">${pode?`<button type="button" class="pf-btn rec" data-rec><span class="pf-dot" style="animation:none"></span>Gravar tela + voz</button>`:''}<button type="button" class="pf-btn" data-up>Subir vídeo pronto</button><input type="file" accept="video/*" hidden></div>
        ${pode?`<label class="pf-toggle" style="font-size:13.5px"><input type="checkbox" data-cam><span>Mostrar minha câmera num círculo<small>Aparece no canto da tela e entra na gravação.</small></span></label>
        <p class="hint" style="margin:0;font-size:12.5px;color:var(--muted);line-height:1.5">Quando o navegador perguntar o que compartilhar, escolha <b>esta aba</b>. Dê play no trabalho, pause onde quiser, desenhe e fale. A gravação pega a tela e o microfone.</p>`
        :`<p class="hint" style="margin:0;font-size:12.5px;color:var(--muted)">Este navegador não grava a tela. Use o Chrome ou o Edge no computador, ou grave fora e suba o vídeo.</p>`}</div>`;
      const inp=el.querySelector('input[type=file]'); el.querySelector('[data-up]').onclick=()=>inp.click(); inp.onchange=()=>{ if(inp.files[0]){ set(inp.files[0]); paint(); } };
      const rb=el.querySelector('[data-rec]'); if(rb) rb.onclick=()=>gravar(el.querySelector('[data-cam]').checked);
    };
    async function gravar(comCam){
      if(rec) return;
      if(comCam&&!cam){ try{ const s=await navigator.mediaDevices.getUserMedia({video:{width:480,height:480,facingMode:'user'}}); const v=document.createElement('video'); v.className='pf-cam'; v.muted=true; v.playsInline=true; v.autoplay=true; v.srcObject=s; document.body.appendChild(v); cam={stream:s, el:v}; }catch(e){ toast('Não consegui abrir a câmera. Sigo só com tela e voz.'); } }
      try{ rec=await FosPort.gravar({mic:true}); }
      catch(e){ pararCam(); rec=null; toast(e&&e.name==='NotAllowedError'?'Gravação cancelada.':'Não consegui começar a gravar a tela.'); return; }
      const bar=document.createElement('div'); bar.className='pf-recbar'; bar.setAttribute('role','status');
      bar.innerHTML=`<span class="pf-dot" style="background:#ff4d6d"></span><span data-t>0:00</span><span style="color:#ffb3c0">gravando</span><button type="button" class="pf-btn rec" style="padding:6px 12px">■ Parar</button>`;
      document.body.appendChild(bar);
      const tick=()=>{ bar.querySelector('[data-t]').textContent=FosPort.tc((Date.now()-rec.t0)/1000); }; recTimer=setInterval(tick,500);
      const sendB=modal&&modal.querySelector('#pfSend'); if(sendB) sendB.disabled=true;
      const fim=async()=>{ if(!rec) return; const r=rec; rec=null; clearInterval(recTimer); bar.remove(); pararCam(); const f=await r.parar(); if(f.size) { set(f); toast('Vídeo gravado. Confira e envie.'); } paint(); };
      bar.querySelector('button').onclick=fim; rec.onfim=fim;
    }
    paint();
  }

  async function badge(){ if(window.__revBadge) window.__revBadge(); }
  function seg(id,set){ document.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#'+id+' button').forEach(x=>x.setAttribute('aria-pressed',x===b)); set(b.dataset.f); render(); }); }
  function init(){ seg('fPortS',v=>fSt=v); seg('fPortC',v=>fCu=v); }
  window.FosPortAdmin={render, init, pendentes, fechar};
})();
