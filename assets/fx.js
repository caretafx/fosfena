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

  /* fosfenas: pontos de luz que flutuam e se ligam como nodes perto do cursor */
  (function(){
    const cv=document.createElement('canvas'); aura.append(cv);
    const ctx=cv.getContext('2d'); if(!ctx) return;
    let W=0,H=0,dpr=Math.min(devicePixelRatio||1,2), mx=-999, my=-999, pts=[], run=true;
    const N = innerWidth<760 ? 16 : 34;
    function size(){ W=cv.clientWidth; H=cv.clientHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    size(); addEventListener('resize', size);
    for(let i=0;i<N;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:-(.1+Math.random()*.35),r:.6+Math.random()*2.2,a:Math.random()*Math.PI*2,amber:Math.random()<.7});
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
    document.addEventListener('visibilitychange',()=>{ run=!document.hidden; if(run) requestAnimationFrame(tick); });
    function draw(move){
      ctx.clearRect(0,0,W,H);
      for(const p of pts){
        if(move){ p.x+=p.vx; p.y+=p.vy; p.a+=.03;
          const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy); if(d<140&&d>0){ p.x+=dx/d*1.2; p.y+=dy/d*1.2; }
          if(p.y<-10){p.y=H+10;p.x=Math.random()*W} if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10; }
        const tw=.45+.55*Math.sin(p.a);
        const c=p.amber?'224,168,78':'236,234,228';
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        g.addColorStop(0,`rgba(${c},${.9*tw})`); g.addColorStop(1,`rgba(${c},0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*6,0,7); ctx.fill();
      }
      if(mx>-900){ ctx.lineWidth=1; for(const p of pts){ const d=Math.hypot(p.x-mx,p.y-my); if(d<220){ ctx.strokeStyle=`rgba(224,168,78,${(1-d/220)*.35})`; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(p.x,p.y); ctx.stroke(); } } }
    }
    function tick(){ if(!run) return; draw(true); requestAnimationFrame(tick); }
    if(reduce) draw(false); else requestAnimationFrame(tick);
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
    (function loop(){ rx+=(x-rx)*.18; ry+=(y-ry)*.18; ring.style.transform=`translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); })();
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

  /* faixas infinitas: repete o conteúdo até cobrir telas largas (a animação anda 50%) */
  function fillTracks(){
    document.querySelectorAll('.ticker .track, .ptrack').forEach(t=>{
      let guard=0;
      while(t.scrollWidth < innerWidth*2 + 400 && guard++ < 6){
        [...t.children].forEach(c=>{ const k=c.cloneNode(true); k.setAttribute('aria-hidden','true'); t.append(k); });
      }
    });
  }
  fillTracks(); addEventListener('resize', fillTracks);

  window.fxScan = scan;
  scan();
  new MutationObserver(ms=>{ if(ms.some(m=>[...m.addedNodes].some(n=>n.nodeType===1 && !(n.classList&&n.classList.contains('w'))))) scan(); }).observe(document.body, {childList:true, subtree:true});
})();
