/* Fosfena · efeitos: luz de fundo, vidro, brilho e inclinação com o mouse, entradas ao rolar.
   Cada página define window.FX = {glass:'seletores', glow:'seletores', tilt:'seletores', reveal:'seletores', words:'seletores'} antes de carregar este arquivo. */
(function(){
  const C = Object.assign({glass:'',glow:'',tilt:'',reveal:'',words:''}, window.FX||{});
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  const aura = document.createElement('div');
  aura.className = 'aura'; aura.setAttribute('aria-hidden','true');
  aura.innerHTML = '<i class="b1"></i><i class="b2"></i><i class="b3"></i>';
  document.body.prepend(aura);

  if(fine && !reduce){
    let raf=0, mx=0, my=0;
    addEventListener('pointermove', e=>{ mx=e.clientX; my=e.clientY; if(!raf) raf=requestAnimationFrame(()=>{ raf=0; aura.style.setProperty('--mx', mx+'px'); aura.style.setProperty('--my', my+'px'); }); }, {passive:true});
  }

  const io = ('IntersectionObserver' in window) ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px', threshold:.08}) : null;

  function bindPointer(el, tilt){
    el.addEventListener('pointermove', e=>{
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--x', x+'px'); el.style.setProperty('--y', y+'px');
      if(tilt && fine && !reduce){ el.style.setProperty('--rx', ((.5 - y/r.height)*5).toFixed(2)+'deg'); el.style.setProperty('--ry', ((x/r.width - .5)*6).toFixed(2)+'deg'); }
    });
    el.addEventListener('pointerleave', ()=>{ el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); });
  }

  function splitWords(el){
    if(el.dataset.fxw) return; el.dataset.fxw = 1; let i = 0;
    const walk = n => [...n.childNodes].forEach(c=>{
      if(c.nodeType===3){ const frag=document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t=>{ if(!t) return; if(/^\s+$/.test(t)){ frag.append(t); return; } const s=document.createElement('span'); s.className='w'; s.style.setProperty('--i', i++); s.textContent=t; frag.append(s); }); c.replaceWith(frag); }
      else if(c.nodeType===1){ walk(c); }
    });
    walk(el); el.classList.add('fx-words');
  }

  function scan(root){
    root = root || document;
    const q = s => s ? root.querySelectorAll(s) : [];
    q(C.glass).forEach(el=>el.classList.add('fx-glass'));
    q(C.glow).forEach(el=>{ if(el.dataset.fxg) return; el.dataset.fxg=1; el.classList.add('fx-glow'); bindPointer(el, false); });
    q(C.tilt).forEach(el=>{ if(el.dataset.fxt) return; el.dataset.fxt=1; el.classList.add('fx-tilt','fx-glow'); bindPointer(el, true); });
    q(C.words).forEach(splitWords);
    const groups = new Map();
    q(C.reveal).forEach(el=>{
      if(el.dataset.fxr) return; el.dataset.fxr=1;
      const k = el.parentElement; const n = groups.get(k)||0; groups.set(k, n+1);
      el.style.setProperty('--d', Math.min(n,6)*90+'ms');
      if(reduce || !io){ el.classList.add('fx-reveal','in'); return; }
      el.classList.add('fx-reveal'); io.observe(el);
    });
  }

  /* fosfenas: pontos de luz com vida própria. Cada um nasce apagado, cresce, flutua num campo de correntes suave
     e some devagar (opacidade e tamanho ao longo da vida), com brilho de queda exponencial. Perto do cursor, ligam-se como nodes.
     Flares ao rolar para cima: window.FX.flares=false (ou FOS_FLARES=false no console) desliga. */
  (function(){
    const cv=document.createElement('canvas'); aura.append(cv);
    const ctx=cv.getContext('2d'); if(!ctx) return;
    let W=0,H=0,dpr=Math.min(devicePixelRatio||1,2), mx=-999, my=-999, pts=[], run=true, T=0;
    const N = innerWidth<760 ? 18 : 38;
    function size(){ W=cv.clientWidth; H=cv.clientHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    size(); addEventListener('resize', size);
    const rnd=(a,b)=>a+Math.random()*(b-a);
    function spawn(p, first){ p.x=rnd(0,W); p.y=rnd(0,H); p.r=rnd(.7,2.6); p.life=rnd(7,16); p.age=first?rnd(0,p.life):0;
      p.ph=rnd(0,6.28); p.tw=rnd(.25,.6); p.up=rnd(6,18); p.amber=Math.random()<.7; p.vx=0; p.vy=0; return p; }
    for(let i=0;i<N;i++) pts.push(spawn({},true));
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
    document.addEventListener('visibilitychange',()=>{ run=!document.hidden; if(run){ last=0; requestAnimationFrame(tick); } });
    /* brilho pré-desenhado: núcleo pequeno + halo com queda exponencial (sem borda dura, não "marca" o ponto) */
    const sprite=c=>{ const S=96, k=document.createElement('canvas'); k.width=k.height=S; const x=k.getContext('2d'); const g=x.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
      for(let i=0;i<=12;i++){ const u=i/12, a=Math.exp(-u*5.5)*.85 + Math.exp(-u*22)*.6; g.addColorStop(u,`rgba(${c},${Math.min(1,a*(1-u)).toFixed(3)})`); }
      x.fillStyle=g; x.fillRect(0,0,S,S); return k; };
    const SPR={a:sprite('255,186,92'), w:sprite('236,234,228'), v:sprite('155,107,255')};
    const smooth=u=>u<=0?0:u>=1?1:u*u*(3-2*u);
    /* flares ao rolar para cima: poucos, curtos e fracos, mais fortes quanto mais rápida a rolagem */
    const flares=[]; let lastY=scrollY, lastS=performance.now(), lastF=0;
    const flaresOn=()=>!reduce && C.flares!==false && window.FOS_FLARES!==false;
    addEventListener('scroll',()=>{ const now=performance.now(), y=scrollY, dt=Math.max(16,now-lastS), v=(lastY-y)/dt; lastY=y; lastS=now;
      if(!flaresOn() || v<.45 || flares.length>=4 || now-lastF<140) return; lastF=now;
      const k=Math.min(1,(v-.45)/2.5); flares.push({x:rnd(W*.12,W*.88), y:rnd(H*.08,H*.6), age:0, life:rnd(.7,1.1), k:.6+.4*k, w:rnd(380,720), amber:Math.random()<.65});
      if(!running){ last=0; requestAnimationFrame(tick); } },{passive:true});
    function drawFlares(dt){
      for(let i=flares.length-1;i>=0;i--){ const f=flares[i]; f.age+=dt; const u=f.age/f.life; if(u>=1){ flares.splice(i,1); continue; }
        const a=f.k*smooth(u/.15)*(1-smooth((u-.3)/.7)), spr=f.amber?SPR.a:SPR.v, cx=W/2, cy=H/2;
        ctx.globalAlpha=a; ctx.drawImage(spr, f.x-f.w/2, f.y-11, f.w, 22);           /* risco anamórfico */
        ctx.globalAlpha=a*.7; ctx.drawImage(spr, f.x-f.w*.28, f.y-3, f.w*.56, 6);     /* fio central */
        ctx.globalAlpha=a; ctx.drawImage(SPR.w, f.x-38, f.y-38, 76, 76);               /* núcleo */
        ctx.globalAlpha=a*.6; ctx.drawImage(spr, f.x-110, f.y-110, 220, 220);          /* halo */
        for(const [t,sz] of [[.45,34],[.8,18],[1.25,52]]){ const gx=f.x+(cx-f.x)*t*2, gy=f.y+(cy-f.y)*t*2;   /* fantasmas na linha do centro, como numa lente */
          ctx.globalAlpha=a*.32; ctx.drawImage(SPR.v, gx-sz, gy-sz, sz*2, sz*2); }
      }
    }
    let last=0, running=false;
    function draw(dt){
      ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter'; T+=dt;
      for(const p of pts){
        if(dt){ p.age+=dt; if(p.age>=p.life) spawn(p,false);
          /* campo de correntes: direção muda devagar com a posição e o tempo, sempre com leve subida */
          const ang=Math.sin(p.x*.0031+T*.23+p.ph)*1.6+Math.cos(p.y*.0027-T*.17)*1.2;
          p.vx+= (Math.cos(ang)*14-p.vx)*Math.min(1,dt*1.5); p.vy+= (Math.sin(ang)*9-p.up-p.vy)*Math.min(1,dt*1.5);
          const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy); if(d<150&&d>0){ const f=(1-d/150)*60; p.vx+=dx/d*f*dt*4; p.vy+=dy/d*f*dt*4; }
          p.x+=p.vx*dt; p.y+=p.vy*dt;
          if(p.y<-20) p.y=H+20; if(p.y>H+20) p.y=-20; if(p.x<-20) p.x=W+20; if(p.x>W+20) p.x=-20; }
        const u=p.age/p.life, env=smooth(u/.25)*(1-smooth((u-.6)/.4));        /* nasce e some devagar */
        const sz=.55+.45*Math.sin(Math.min(1,u)*Math.PI*.85);                   /* tamanho ao longo da vida */
        const tw=.82+.18*Math.sin(T*p.tw*6.28+p.ph);                             /* cintilar lento e discreto */
        const R=p.r*9*sz; ctx.globalAlpha=.8*env*tw; ctx.drawImage(p.amber?SPR.a:SPR.w, p.x-R, p.y-R, R*2, R*2);
      }
      if(flares.length) drawFlares(dt);
      ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
      if(mx>-900){ ctx.lineWidth=1; for(const p of pts){ const d=Math.hypot(p.x-mx,p.y-my); if(d<220){ const u=p.age/p.life, env=smooth(u/.25)*(1-smooth((u-.6)/.4)); ctx.strokeStyle=`rgba(224,168,78,${((1-d/220)*.35*env).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(p.x,p.y); ctx.stroke(); } } }
    }
    function tick(t){ if(!run){ running=false; return; } running=true; if(!last) last=t; if(t>last){ draw(Math.min(.05,(t-last)/1000)); last=t; } requestAnimationFrame(tick); }
    if(reduce) draw(0); else { running=true; requestAnimationFrame(tick); }
  })();

  /* cursor com brilho (só com mouse) */
  if(fine && !reduce){
    const dot=document.createElement('div'), ring=document.createElement('div');
    dot.className='fx-cur'; ring.className='fx-ring'; document.body.append(dot, ring);
    let x=-100,y=-100,rx=-100,ry=-100,shown=true;
    const show=v=>{ if(v===shown) return; shown=v; dot.classList.toggle('off',!v); ring.classList.toggle('off',!v); };
    addEventListener('pointermove',e=>{
      if(e.pointerType && e.pointerType!=='mouse'){ show(false); return; }
      if(!shown){ rx=e.clientX; ry=e.clientY; } /* ao voltar, o anel nasce no mouse em vez de correr de longe */
      x=e.clientX; y=e.clientY; dot.style.transform=`translate3d(${x}px,${y}px,0)`; show(true);
      const t=e.target.closest&&e.target.closest('a,button,[role=button],summary,label,input,textarea,.lrow,.mcard'); ring.classList.toggle('big',!!t); },{passive:true});
    addEventListener('pointerdown',()=>ring.classList.add('down')); addEventListener('pointerup',()=>ring.classList.remove('down'));
    /* esconde quando o mouse sai da janela, entra num vídeo/iframe ou a aba perde o foco */
    document.addEventListener('mouseout',e=>{ if(!e.relatedTarget || e.relatedTarget.nodeName==='IFRAME') show(false); });
    document.addEventListener('mouseover',e=>{ if(e.target.nodeName==='IFRAME') show(false); });
    addEventListener('blur',()=>show(false));
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) show(false); });
    show(false);
    let looping=false;
    const loop=()=>{ rx+=(x-rx)*.18; ry+=(y-ry)*.18; ring.style.transform=`translate3d(${rx}px,${ry}px,0)`; if(Math.abs(x-rx)+Math.abs(y-ry)>.3) requestAnimationFrame(loop); else looping=false; };
    addEventListener('pointermove',()=>{ if(!looping){ looping=true; requestAnimationFrame(loop); } },{passive:true});
  }

  /* números contando */
  function count(el){
    const to=parseFloat(el.dataset.count), dur=1400, t0=performance.now(), suf=el.querySelector('small'); const sufH=suf?suf.outerHTML:'';
    if(reduce){ el.innerHTML=el.dataset.count+sufH; return; }
    (function f(t){ const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3); el.innerHTML=Math.round(to*e)+sufH; if(k<1) requestAnimationFrame(f); })(t0);
  }
  const cio = ('IntersectionObserver' in window) ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ count(e.target); cio.unobserve(e.target); } }),{threshold:.6}) : null;
  document.querySelectorAll('[data-count]').forEach(el=>{ if(cio) cio.observe(el); else count(el); });

  /* traço de lápis */
  document.querySelectorAll('.pencil').forEach(el=>{
    const p=el.querySelector('path'); if(p&&p.getTotalLength) el.style.setProperty('--len', Math.ceil(p.getTotalLength()));
    if(reduce||!io){ el.classList.add('in'); return; }
    el.classList.add('fx-pencil'); const o=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ el.classList.add('in'); o.disconnect(); } }),{threshold:1}); o.observe(el);
  });

  /* faixas infinitas: repete o conteúdo até cobrir telas largas (a animação anda 50%).
     A velocidade fica fixa em px/s, mesmo depois de repetir. data-speed multiplica a velocidade;
     data-hover é a velocidade com o mouse em cima (fração da velocidade normal), com transição suave. */
  function fillTracks(){
    document.querySelectorAll('.ticker .track, .ptrack').forEach(t=>{
      const dur=parseFloat(getComputedStyle(t).animationDuration)||0;
      if(!t._pps && dur) t._pps=(t.scrollWidth/2)/dur;
      let guard=0;
      while(t.scrollWidth < innerWidth*2 + 400 && guard++ < 6){
        [...t.children].forEach(c=>{ const k=c.cloneNode(true); k.setAttribute('aria-hidden','true'); t.append(k); });
      }
      if(t._pps) t.style.animationDuration=((t.scrollWidth/2)/(t._pps*(parseFloat(t.dataset.speed)||1))).toFixed(2)+'s';
      if(t.dataset.hover && !t._hov){ t._hov=1; const host=t.closest('.pmarquee,.ticker')||t; let raf=0;
        const ease=to=>{ cancelAnimationFrame(raf); const an=t.getAnimations()[0]; if(!an) return; const from=an.playbackRate, t0=performance.now();
          (function f(now){ const k=Math.min(1,(now-t0)/450), e=1-Math.pow(1-k,3); an.playbackRate=from+(to-from)*e; if(k<1) raf=requestAnimationFrame(f); })(t0); };
        host.addEventListener('mouseenter',()=>ease(parseFloat(t.dataset.hover)));
        host.addEventListener('mouseleave',()=>ease(1)); }
    });
  }
  fillTracks(); addEventListener('resize', fillTracks);

  window.fxScan = scan;
  scan();
  new MutationObserver(ms=>{ if(ms.some(m=>[...m.addedNodes].some(n=>n.nodeType===1 && !(n.classList&&n.classList.contains('w'))))) scan(); }).observe(document.body, {childList:true, subtree:true});
})();
