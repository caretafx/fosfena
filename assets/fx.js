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
  window.fxScan = scan;
  scan();
  new MutationObserver(ms=>{ if(ms.some(m=>[...m.addedNodes].some(n=>n.nodeType===1 && !(n.classList&&n.classList.contains('w'))))) scan(); }).observe(document.body, {childList:true, subtree:true});
})();
