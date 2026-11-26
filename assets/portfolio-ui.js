/* vfxstudio · player do portfólio, com marcas no tempo e desenho sobre o frame (estilo review de estúdio).
   FosPortUI.player(el, {src, marcas, editar, curso}) devolve {video, marcas(), limpar(), destruir()}.
   - Aluno (editar:false): vê as marcas na linha do tempo; clicar pula para o ponto, pausa e mostra o desenho e o texto.
   - Professor (editar:true): pausa, desenha no frame, escreve a nota e clica "Marcar neste ponto". */
(function(){
  const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const CORES=[['#FFB547','Âmbar'],['#5CC8FF','Ciano'],['#ff5d7a','Vermelho'],['#ffffff','Branco']];
  function player(root, o){
    o=o||{}; let marcas=(o.marcas||[]).map(m=>({...m})), cor=CORES[0][0], pen=false, sujo=false, ativa=-1;
    const ehImg=o.tipo&&o.tipo.startsWith('image/');
    root.classList.add('pf-player');
    root.innerHTML=`<div class="pf-stage">${ehImg?`<img class="pf-media" src="${esc(o.src)}" alt="">`:`<video class="pf-media" src="${esc(o.src)}" controls playsinline preload="metadata"></video>`}<canvas class="pf-draw" aria-hidden="true"></canvas><div class="pf-call" hidden></div></div>
      <div class="pf-tl" aria-label="Marcas do professor na linha do tempo"><i class="pf-ph"></i></div>
      ${o.editar?`<div class="pf-tools"><button type="button" class="pf-b" data-pen aria-pressed="false" title="Desenhar sobre o frame (D)">✎ Desenhar</button>
        <span class="pf-cores">${CORES.map((c,i)=>`<button type="button" data-cor="${c[0]}" aria-label="${c[1]}" aria-pressed="${i===0}" style="--k:${c[0]}"></button>`).join('')}</span>
        <button type="button" class="pf-b" data-limpa title="Apagar o desenho">Limpar</button>
        <span class="pf-sep"></span>
        <input class="pf-in" type="text" maxlength="500" placeholder="Nota neste ponto (ex.: a borda do key está serrilhada)">
        <button type="button" class="pf-b pri" data-marca>＋ Marcar neste ponto</button></div>`:''}
      <ol class="pf-ml"></ol>`;
    const st=root.querySelector('.pf-stage'), v=root.querySelector('.pf-media'), cv=root.querySelector('.pf-draw'), g=cv.getContext('2d'), tl=root.querySelector('.pf-tl'), head=tl.querySelector(".pf-ph"), ml=root.querySelector('.pf-ml'), call=root.querySelector('.pf-call');
    const dur=()=>ehImg?1:(v.duration&&isFinite(v.duration)?v.duration:0);
    const cur=()=>ehImg?0:v.currentTime;
    /* canvas cobre só a área da imagem (o vídeo usa object-fit: contain) */
    function rect(){ const W=st.clientWidth, H=st.clientHeight, vw=(ehImg?v.naturalWidth:v.videoWidth)||16, vh=(ehImg?v.naturalHeight:v.videoHeight)||9, s=Math.min(W/vw,H/vh), w=vw*s, h=vh*s; return {l:(W-w)/2, t:(H-h)/2, w, h, vw, vh}; }
    function fit(){ const r=rect(); Object.assign(cv.style,{left:r.l+'px',top:r.t+'px',width:r.w+'px',height:r.h+'px'}); const k=Math.min(1,1920/r.vw); const cw=Math.round(r.vw*k), ch=Math.round(r.vh*k); if(cv.width!==cw||cv.height!==ch){ const keep=sujo?cv.toDataURL():null; cv.width=cw; cv.height=ch; if(keep) img(keep); } }
    function limpar(){ g.clearRect(0,0,cv.width,cv.height); sujo=false; }
    function img(src){ return new Promise(ok=>{ const i=new Image(); i.onload=()=>{ g.drawImage(i,0,0,cv.width,cv.height); sujo=true; ok(); }; i.onerror=ok; i.src=src; }); }
    const ro=new ResizeObserver(fit); ro.observe(st);
    v.addEventListener(ehImg?'load':'loadedmetadata',()=>{ fit(); desenhaTl(); });
    if(!ehImg){ v.addEventListener('timeupdate',()=>{ const d=dur(); head.style.left=(d?cur()/d*100:0)+'%'; });
      v.addEventListener('play',()=>{ if(!o.editar||!sujo||ativa>=0){ limpar(); call.hidden=true; ativa=-1; marcaAtiva(); } }); }
    /* desenho */
    let drawing=false, last=null;
    const pt=e=>{ const b=cv.getBoundingClientRect(); return {x:(e.clientX-b.left)/b.width*cv.width, y:(e.clientY-b.top)/b.height*cv.height}; };
    cv.addEventListener('pointerdown',e=>{ if(!pen) return; e.preventDefault(); if(!ehImg&&!v.paused) v.pause(); if(ativa>=0){ ativa=-1; call.hidden=true; marcaAtiva(); } drawing=true; last=pt(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove',e=>{ if(!drawing) return; const p=pt(e); g.strokeStyle=cor; g.lineWidth=Math.max(3,cv.width/320); g.lineCap='round'; g.lineJoin='round'; g.shadowColor=cor; g.shadowBlur=g.lineWidth*1.6; g.beginPath(); g.moveTo(last.x,last.y); g.lineTo(p.x,p.y); g.stroke(); last=p; sujo=true; });
    const up=()=>{ drawing=false; }; cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
    /* linha do tempo e lista */
    function desenhaTl(){ const d=dur(); tl.querySelectorAll('.pf-mk').forEach(x=>x.remove());
      marcas.forEach((m,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='pf-mk'+(m.desenho?' d':''); b.style.left=(d?Math.min(100,m.t/d*100):0)+'%'; b.title=FosPort.tc(m.t)+(m.texto?' · '+m.texto:''); b.setAttribute('aria-label','Ir para a marca em '+FosPort.tc(m.t)); b.onclick=()=>ir(i); tl.appendChild(b); });
      ml.innerHTML=marcas.map((m,i)=>`<li data-i="${i}"><button type="button" class="pf-go"><span class="pf-tc">${ehImg?'#'+(i+1):FosPort.tc(m.t)}</span>${m.desenho?'<span class="pf-ico" title="Tem desenho">✎</span>':''}<span class="pf-tx">${esc(m.texto||'(só desenho)')}</span></button>${o.editar?`<button type="button" class="pf-x" aria-label="Apagar esta marca">×</button>`:''}</li>`).join('');
      ml.hidden=!marcas.length;
      ml.querySelectorAll('li').forEach(li=>{ const i=+li.dataset.i; li.querySelector('.pf-go').onclick=()=>ir(i); const x=li.querySelector('.pf-x'); if(x) x.onclick=()=>{ marcas.splice(i,1); ativa=-1; call.hidden=true; limpar(); desenhaTl(); if(o.onchange) o.onchange(marcas); }; });
      marcaAtiva(); }
    function marcaAtiva(){ ml.querySelectorAll('li').forEach(li=>li.classList.toggle('on',+li.dataset.i===ativa)); tl.querySelectorAll('.pf-mk').forEach((b,i)=>b.classList.toggle('on',i===ativa)); }
    async function ir(i){ const m=marcas[i]; if(!m) return; ativa=i; if(!ehImg){ v.pause(); v.currentTime=m.t; } limpar(); if(m.desenho) await img(m.desenho);
      call.innerHTML=`<b>${ehImg?'#'+(i+1):FosPort.tc(m.t)}</b>${esc(m.texto||'')}`; call.hidden=!m.texto; marcaAtiva(); }
    if(o.editar){
      const pb=root.querySelector('[data-pen]'), inp=root.querySelector('.pf-in');
      const setPen=on=>{ pen=on; pb.setAttribute('aria-pressed',on); st.classList.toggle('pen',on); };
      pb.onclick=()=>setPen(!pen);
      root.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>{ cor=b.dataset.cor; root.querySelectorAll('[data-cor]').forEach(x=>x.setAttribute('aria-pressed',x===b)); setPen(true); });
      root.querySelector('[data-limpa]').onclick=()=>{ limpar(); ativa=-1; call.hidden=true; marcaAtiva(); };
      const add=()=>{ const texto=inp.value.trim(); if(!texto&&!sujo){ inp.focus(); return; }
        marcas.push({t:cur(), texto, desenho:sujo?cv.toDataURL('image/png'):null}); marcas.sort((a,b)=>a.t-b.t);
        inp.value=''; limpar(); ativa=-1; call.hidden=true; desenhaTl(); if(o.onchange) o.onchange(marcas); };
      root.querySelector('[data-marca]').onclick=add; inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); add(); } };
      inp.onfocus=()=>{ if(!ehImg&&!v.paused) v.pause(); };
      root.addEventListener('keydown',e=>{ if(e.target===inp) return; if(e.key==='d'||e.key==='D') setPen(!pen); });
    }
    desenhaTl();
    return { video:v, marcas:()=>marcas.slice(), limpar, ir, destruir(){ ro.disconnect(); if(!ehImg){ v.pause(); v.removeAttribute('src'); v.load(); } } };
  }
  window.FosPortUI={player, esc};
})();
