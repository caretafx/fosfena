/* Fosfena · exercícios interativos e trechos de aula.
   Dados em assets/nk101-pratica.js (window.FOS_PRATICA, window.FOS_PROVAS, window.FOS_VIDEOS).
   Tipos de exercício:
     grafo   – conectar nodes num mini node graph (clica numa saída e depois numa entrada)
     ordem   – clicar as etapas na ordem certa
     escolha – escolher o node/opção certa para uma situação
   Cada exercício tem `duvida:{in,out,txt}` (segundos no vídeo da aula) e abre o trecho exato. */
(function(){
const esc = t => String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tcode = s => { s=Math.max(0,s); const t=Math.floor(s), f=Math.floor((s%1)*30); return [Math.floor(t/3600),Math.floor(t%3600/60),t%60].map(v=>String(v).padStart(2,'0')).join(':')+':'+String(f).padStart(2,'0'); };
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; };

const css = `
.px{display:flex;flex-direction:column;gap:22px}
.px-intro{color:var(--muted);font-size:14.5px;line-height:1.55;margin:0}
.px-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.px-count{font-family:var(--f-mono);font-size:12.5px;color:var(--muted);white-space:nowrap}
.px-nav{display:flex;gap:8px;flex-wrap:wrap}
.px-nav button{font-family:var(--f-mono);font-size:12px;padding:7px 12px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
.px-nav button.on{border-color:var(--accent);color:var(--fg);background:rgba(224,168,78,.12)}
.px-nav button.ok::after{content:' ✓';color:#5fd38d}
.px-card{border:1px solid var(--line);border-radius:14px;padding:clamp(18px,3vw,28px);display:flex;flex-direction:column;gap:10px;background:var(--panel)}
.px-card h3{font-size:21px;line-height:1.25;margin:2px 0 0}
.px-card p{margin:0}
.px-card > p{font-size:15.5px;line-height:1.6;color:var(--fg);max-width:70ch}
.px-body{display:flex;flex-direction:column;gap:18px;margin-top:14px}
.px-body > .px-row{border-top:1px solid var(--line);padding-top:18px}
.px-body > p:not(.px-fb){font-size:13px;color:var(--muted);line-height:1.5}
.px-body > .px-fb:empty{display:none}
.px-foot{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap}
.px-eb{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.px-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.px-fb{font-size:14.5px;line-height:1.5;margin:0;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,.04)}
.px-fb.ok{color:#5fd38d;background:rgba(95,211,141,.08)}.px-fb.no{color:#e8a39a;background:rgba(232,116,106,.08)}
.px-help{display:inline-flex;align-items:center;gap:8px}
.px-help svg{width:16px;height:16px}
.px-graph{width:100%;height:auto;max-height:440px;background:#141519;border:1px solid var(--line);border-radius:10px;touch-action:manipulation;user-select:none}
.px-graph .nd rect{fill:#2E3036;stroke:#4a4d55;stroke-width:1}
.px-graph .nd text{font-family:var(--f-mono),monospace;font-size:13px;fill:#ECEAE4;pointer-events:none}
.px-graph .port{fill:#18191C;stroke:#8B8E96;stroke-width:1.5;cursor:pointer}
.px-graph .port:hover,.px-graph .port.sel{fill:#E0A84E;stroke:#E0A84E}
.px-graph .plbl{font-family:var(--f-mono),monospace;font-size:10px;fill:#8B8E96;pointer-events:none}
.px-graph .wire{stroke:#ECEAE4;stroke-width:2;fill:none;cursor:pointer}
.px-graph .wire:hover{stroke:#e8746a}
.px-graph .wire.ok{stroke:#5fd38d}.px-graph .wire.bad{stroke:#e8746a}
.px-graph .hit{stroke:transparent;stroke-width:14;fill:none;cursor:pointer}
.px-ord{display:flex;flex-direction:column;gap:8px}
.px-ord button{display:flex;gap:10px;align-items:center;text-align:left;padding:10px 12px;border:1px solid var(--line);border-radius:8px;color:var(--fg)}
.px-ord button:hover{border-color:rgba(224,168,78,.6)}
.px-ord button i{font-style:normal;font-family:var(--f-mono);font-size:12px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);color:var(--muted);flex:none}
.px-ord button.picked i{background:var(--accent);color:#18191C;border-color:var(--accent)}
.px-ord button.ok{border-color:#5fd38d}.px-ord button.no{border-color:#e8746a}
.px-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:12px}
.px-chips button{display:flex;align-items:center;gap:12px;text-align:left;font-size:15px;line-height:1.35;padding:16px 18px;border-radius:12px;background:rgba(255,255,255,.03);color:var(--fg,#ECEAE4);border:1px solid var(--line);transition:border-color .15s,background .15s}
.px-chips button::before{content:'';width:18px;height:18px;border-radius:50%;border:2px solid #6b6e76;flex:none;box-sizing:border-box;transition:all .15s}
.px-chips button:hover{border-color:rgba(224,168,78,.6);background:rgba(224,168,78,.05)}
.px-chips button.sel{border-color:var(--accent);background:rgba(224,168,78,.12);box-shadow:0 0 0 1px var(--accent)}
.px-chips button.sel::before{border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 3px #18191C}
.px-chips button.ok{border-color:#5fd38d;background:rgba(95,211,141,.1);box-shadow:0 0 0 1px #5fd38d}.px-chips button.ok::before{border-color:#5fd38d;background:#5fd38d}
.px-chips button.no{border-color:#e8746a;background:rgba(232,116,106,.08);box-shadow:0 0 0 1px #e8746a}.px-chips button.no::before{border-color:#e8746a;background:#e8746a}
.px-clip{position:fixed;inset:0;z-index:9500;background:rgba(5,4,10,.86);display:grid;place-items:center;padding:16px}
.px-clip .box{width:min(900px,100%);background:var(--panel,#1c1d22);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;max-height:92vh}
.px-clip .hd{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--line)}
.px-clip .hd b{font-size:15px}
.px-clip .scr{aspect-ratio:16/9;background:#0c0b12;display:grid;place-items:center;position:relative}
.px-clip video{width:100%;height:100%;display:block;background:#000}
.px-clip .pv{display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;padding:20px;color:var(--muted)}
.px-clip .tcs{font-family:var(--f-mono);font-size:clamp(18px,4vw,30px);color:var(--fg);letter-spacing:.02em}
.px-clip .tcs span{color:var(--accent)}
.px-clip .rng{width:min(520px,90%);height:6px;border-radius:3px;background:var(--line);position:relative}
.px-clip .rng i{position:absolute;top:0;bottom:0;background:var(--accent);border-radius:3px}
.px-clip .ft{padding:12px 16px;display:flex;flex-direction:column;gap:6px;overflow-y:auto}
.px-clip .ft q{font-size:14px;color:var(--muted);quotes:none;border-left:2px solid var(--accent);padding-left:10px;display:block}
.px-clip .x{font-size:20px;line-height:1;color:var(--muted);padding:4px 8px}
.px-nav button.skip{opacity:.6;text-decoration:line-through}
.qhelp{align-self:flex-start;font-size:13px;color:var(--link,#7F9CC0);padding:0;display:none}
.quiz.checked .qhelp{display:inline}
.qhelp:hover{text-decoration:underline}
`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* ---------- player de trecho (in/out) ---------- */
function videoFor(lessonId){ return (window.FOS_VIDEOS||{})[lessonId] || null; }
/* aceita link do YouTube (watch, youtu.be, shorts, embed) ou só o ID de 11 caracteres */
function ytId(src){ if(!src) return null; const m=String(src).match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)||String(src).match(/^([\w-]{11})$/); return m?m[1]:null; }
function openClip(lesson, d){
  const src = videoFor(lesson.id);
  const dur = lesson.dur || d.out;
  const wrap=document.createElement('div'); wrap.className='px-clip'; wrap.setAttribute('role','dialog'); wrap.setAttribute('aria-modal','true');
  const range = `<span>${tcode(d.in)}</span> → <span>${tcode(d.out)}</span>`;
  wrap.innerHTML = `<div class="box">
    <div class="hd"><b>Aula ${String(lesson.n).padStart(2,'0')} · ${esc(lesson.title)} · trecho</b><button class="x" aria-label="Fechar">×</button></div>
    <div class="scr">${ytId(src)
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${ytId(src)}?start=${Math.floor(d.in)}&end=${Math.ceil(d.out)}&autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;display:block" title="Trecho da aula"></iframe>`
      : src
      ? `<video controls playsinline preload="metadata" src="${esc(src)}#t=${d.in.toFixed(2)},${d.out.toFixed(2)}"></video>`
      : `<div class="pv"><span class="eyebrow">Prévia · vídeo ainda sem hospedagem</span><div class="tcs">${range}</div>
         <div class="rng" aria-hidden="true"><i style="left:${(d.in/dur*100).toFixed(2)}%;width:${Math.max(.6,(d.out-d.in)/dur*100).toFixed(2)}%"></i></div>
         <span style="font-size:13px">Na plataforma no ar, o player abre a própria videoaula e toca só esse trecho (${Math.round(d.out-d.in)} s).</span></div>`}</div>
    <div class="ft"><span class="mono" style="font-size:12px;color:var(--muted)">IN ${tcode(d.in)} · OUT ${tcode(d.out)}</span>${d.txt?`<q>${esc(d.txt)}</q>`:''}</div>
  </div>`;
  const close=()=>{ const v=wrap.querySelector('video'); if(v) v.pause(); wrap.remove(); document.removeEventListener('keydown',onk); };
  const onk=e=>{ if(e.key==='Escape') close(); };
  wrap.onclick=e=>{ if(e.target===wrap) close(); };
  wrap.querySelector('.x').onclick=close;
  document.addEventListener('keydown',onk);
  document.body.appendChild(wrap);
  const v=wrap.querySelector('video');
  if(v){ // o fragmento #t já define in/out; o JS garante o corte em navegadores que ignoram o fim
    v.addEventListener('loadedmetadata',()=>{ if(Math.abs(v.currentTime-d.in)>0.5) v.currentTime=d.in; v.play().catch(()=>{}); },{once:true});
    v.addEventListener('timeupdate',()=>{ if(v.currentTime>=d.out){ v.pause(); v.currentTime=d.out; } });
    v.addEventListener('play',()=>{ if(v.currentTime>=d.out-0.05||v.currentTime<d.in-0.5) v.currentTime=d.in; });
  }
  wrap.querySelector('.x').focus();
}
const helpBtn = (cls='btn btn-ghost px-help') => `<button class="${cls}" data-help><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17.2v.1"/></svg>Dúvida? Ver o trecho da aula</button>`;

/* ---------- grafo ---------- */
function graphEx(ex, el, done){
  const NW=120, NH=34, W=ex.w||Math.max(...ex.nodes.map(n=>n.x))+NW+40, H=ex.h||300; /* viewBox justo: nodes maiores no celular */
  const nodes = ex.nodes.map(n=>({...n, ins:n.ins||['input'], out:n.out!==false}));
  const N = id => nodes.find(n=>n.id===id);
  const inPos = (n,k)=>({x:n.x + (k+1)*NW/(n.ins.length+1), y:n.y});
  const outPos = n=>({x:n.x+NW/2, y:n.y+NH});
  let wires=[], sel=null, checked=false;
  el.innerHTML = `<svg class="px-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Node graph do exercício"></svg>
    <div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button><button class="btn btn-ghost" data-clr>Limpar fios</button>${helpBtn()}</div>
    <p class="px-fb" aria-live="polite"></p>
    <p style="font-size:13px;color:var(--muted)">Clique na saída (embaixo) de um node e depois numa entrada (em cima) de outro. Clique num fio para apagar.</p>`;
  const svg=el.querySelector('svg'), fb=el.querySelector('.px-fb');
  function draw(){
    let w='', b='';
    wires.forEach((c,i)=>{ const a=outPos(N(c.from)), t=inPos(N(c.to),c.k); const d=`M${a.x} ${a.y} C${a.x} ${a.y+40}, ${t.x} ${t.y-40}, ${t.x} ${t.y}`;
      w+=`<path class="wire ${c.st||''}" d="${d}"/><path class="hit" data-w="${i}" d="${d}"/>`; });
    nodes.forEach(n=>{
      b+=`<g class="nd"><rect x="${n.x}" y="${n.y}" width="${NW}" height="${NH}" rx="5" ${n.cor?`style="fill:${n.cor};stroke:${n.cor}"`:''}/><text x="${n.x+NW/2}" y="${n.y+NH/2+4.5}" text-anchor="middle" ${n.cor?'style="fill:#18191C"':''}>${esc(n.label)}</text></g>`;
      n.ins.forEach((p,k)=>{ const q=inPos(n,k); b+=`<circle class="port ${sel&&sel.to===n.id&&sel.k===k?'sel':''}" data-in="${n.id}" data-k="${k}" cx="${q.x}" cy="${q.y}" r="9"><title>Entrada ${esc(p)} de ${esc(n.label)}</title></circle>${n.ins.length>1||p!=='input'?`<text class="plbl" x="${q.x}" y="${q.y-13}" text-anchor="middle">${esc(p)}</text>`:''}`; });
      if(n.out){ const q=outPos(n); b+=`<circle class="port ${sel&&sel.from===n.id?'sel':''}" data-out="${n.id}" cx="${q.x}" cy="${q.y}" r="9"><title>Saída de ${esc(n.label)}</title></circle>`; }
    });
    svg.innerHTML=w+b;
  }
  svg.onclick=e=>{
    if(checked){ checked=false; wires.forEach(c=>c.st=''); fb.textContent=''; fb.className='px-fb'; }
    const t=e.target;
    if(t.dataset.w!==undefined){ wires.splice(+t.dataset.w,1); sel=null; draw(); return; }
    if(t.dataset.out){ sel={from:t.dataset.out}; draw(); return; }
    if(t.dataset.in!==undefined){
      const to=t.dataset.in, k=+t.dataset.k;
      if(sel&&sel.from&&sel.from!==to){ wires=wires.filter(c=>!(c.to===to&&c.k===k)); wires.push({from:sel.from,to,k}); sel=null; }
      else sel=null;
      draw(); return; }
    sel=null; draw();
  };
  const key=c=>`${c.from}>${c.to}:${c.k}`;
  const want=new Set(ex.certo.map(c=>{ const [from,rest]=c.split('>'); const [to,k]=rest.split(':'); return `${from}>${to}:${k||0}`; }));
  el.querySelector('[data-chk]').onclick=()=>{
    checked=true; let ok=0;
    wires.forEach(c=>{ c.st = want.has(key(c))?'ok':'bad'; if(c.st==='ok') ok++; });
    const extra=wires.length-ok, falta=want.size-ok;
    draw();
    if(!falta&&!extra){ fb.textContent=ex.ok||'Isso! O fluxo está certo.'; fb.className='px-fb ok'; done(true); }
    else { fb.textContent = (falta?`Faltam ${falta} conexão(ões). `:'') + (extra?`${extra} fio(s) em vermelho não deveriam estar aí. `:'') + (ex.dica||''); fb.className='px-fb no'; }
  };
  el.querySelector('[data-clr]').onclick=()=>{ wires=[]; sel=null; checked=false; fb.textContent=''; draw(); };
  draw();
}

/* ---------- ordem ---------- */
function orderEx(ex, el, done){
  const items = shuffle(ex.itens.map((t,i)=>({t,i})));
  let picked=[];
  el.innerHTML = `<div class="px-ord"></div><div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button><button class="btn btn-ghost" data-clr>Recomeçar</button>${helpBtn()}</div><p class="px-fb" aria-live="polite"></p>`;
  const box=el.querySelector('.px-ord'), fb=el.querySelector('.px-fb');
  function draw(res){
    box.innerHTML = items.map(x=>{ const p=picked.indexOf(x.i); return `<button data-i="${x.i}" class="${p>-1?'picked':''} ${res?(res[x.i]?'ok':'no'):''}"><i>${p>-1?p+1:'·'}</i><span>${esc(x.t)}</span></button>`; }).join('');
    box.querySelectorAll('button').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i, p=picked.indexOf(i); if(p>-1) picked.splice(p); else picked.push(i); fb.textContent=''; draw(); });
  }
  el.querySelector('[data-chk]').onclick=()=>{
    if(picked.length<items.length){ fb.textContent=`Clique todas as ${items.length} etapas, na ordem.`; fb.className='px-fb no'; return; }
    const res={}; picked.forEach((i,pos)=>res[i]=(i===pos)); const ok=picked.every((i,pos)=>i===pos);
    draw(res); fb.textContent= ok? (ex.ok||'Ordem certa!') : 'As etapas em vermelho estão fora do lugar. '+(ex.dica||''); fb.className='px-fb '+(ok?'ok':'no'); if(ok) done(true);
  };
  el.querySelector('[data-clr]').onclick=()=>{ picked=[]; fb.textContent=''; draw(); };
  draw();
}

/* ---------- escolha ---------- */
function choiceEx(ex, el, done){
  let sel=null;
  el.innerHTML = `<div class="px-chips">${ex.opcoes.map((o,i)=>`<button data-i="${i}">${esc(o)}</button>`).join('')}</div>
    <div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button>${helpBtn()}</div><p class="px-fb" aria-live="polite"></p>`;
  const bs=el.querySelectorAll('.px-chips button'), fb=el.querySelector('.px-fb');
  bs.forEach(b=>b.onclick=()=>{ sel=+b.dataset.i; bs.forEach(x=>{x.classList.toggle('sel',x===b); x.classList.remove('ok','no');}); fb.textContent=''; });
  el.querySelector('[data-chk]').onclick=()=>{
    if(sel===null){ fb.textContent='Escolha uma opção.'; fb.className='px-fb no'; return; }
    const ok=sel===ex.certo; bs[sel].classList.add(ok?'ok':'no');
    fb.textContent = ok? (ex.ok||'Certo!') : (ex.dica||'Não é esse. Tente de novo ou veja o trecho da aula.'); fb.className='px-fb '+(ok?'ok':'no'); if(ok) done(true);
  };
}

/* ---------- painel "Praticar" ---------- */
const KEY='fosfena-pratica-v1';
const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } };
const save=v=>{ try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} };
function has(lesson){ return !!((window.FOS_PRATICA||{})[lesson.id]||[]).length; }
function render(lesson, el, idx=0){
  const list=(window.FOS_PRATICA||{})[lesson.id]||[]; const S=load(); const okSet=S[lesson.id]||{};
  const ex=list[idx];
  const feitos=()=>{ const o=load()[lesson.id]||{}; return `${Object.keys(o).filter(k=>list.some(x=>x.id===k)).length} de ${list.length} feitos`; };
  el.innerHTML = `<div class="px">
    <p class="px-intro">Exercícios curtos, um por etapa da aula. Se travar, o botão de dúvida abre a própria videoaula no trecho em que isso é explicado.</p>
    <div class="px-top"><div class="px-nav" role="tablist">${list.map((x,i)=>`<button role="tab" aria-selected="${i===idx}" class="${i===idx?'on':''} ${okSet[x.id]?'ok':((S._pulos||{})[x.id]?'skip':'')}" data-i="${i}">${i+1}. ${esc(x.etapa)}</button>`).join('')}</div><span class="px-count">${feitos()}</span></div>
    <div class="px-card"><span class="px-eb">Etapa ${idx+1} de ${list.length} · ${esc(x_tipo(ex))}</span><h3>${esc(ex.titulo)}</h3><p>${esc(ex.enunciado)}</p><div class="px-body"></div></div>
    <div class="px-foot">${okSet[ex.id]?'':`<button class="btn btn-ghost" data-skip title="Você pode voltar a ele depois pela lista de etapas">Pular exercício</button>`}${idx<list.length-1?`<button class="btn btn-ghost" data-next>Próximo exercício →</button>`:''}</div>
  </div>`;
  el.querySelectorAll('.px-nav button').forEach(b=>b.onclick=()=>render(lesson,el,+b.dataset.i));
  const nx=el.querySelector('[data-next]'); if(nx) nx.onclick=()=>render(lesson,el,idx+1);
  const sk=el.querySelector('[data-skip]'); if(sk) sk.onclick=()=>{ const s=load(); (s._pulos=s._pulos||{})[ex.id]=true; save(s);
    if(idx<list.length-1) render(lesson,el,idx+1); else { const c=el.querySelector('.px-card'); c.innerHTML=`<span class="px-eb">Prática</span><h3>Exercício pulado</h3><p>Sem problema. Quando quiser, volte a qualquer etapa pela lista acima.</p>`; } };
  const body=el.querySelector('.px-body');
  const done=()=>{ const s=load(); (s[lesson.id]=s[lesson.id]||{})[ex.id]=true; save(s); const b=el.querySelector(`.px-nav button[data-i="${idx}"]`); if(b) b.classList.add('ok'); const c=el.querySelector('.px-count'); if(c) c.textContent=feitos(); };
  (TIPOS[ex.tipo]||choiceEx)(ex, body, done);
  body.querySelectorAll('[data-help]').forEach(b=>b.onclick=()=>openClip(lesson, ex.duvida));
}
/* tipos de exercício; outros arquivos podem registrar novos (ex.: simulações interativas da interface do Nuke) com FosPratica.tipo(nome, rótulo, função) */
const TIPOS={grafo:graphEx, ordem:orderEx, escolha:choiceEx}, ROTULOS={grafo:'Conecte os nodes', ordem:'Coloque em ordem', escolha:'Escolha a resposta'};
const x_tipo = ex => ex.rotulo||ROTULOS[ex.tipo]||(ex.tipo?'Exercício':ROTULOS.escolha);

window.FosPratica = { has, render, openClip, videoFor, ytId, tcode, helpBtn, tipo:(nome,rotulo,fn)=>{ TIPOS[nome]=fn; ROTULOS[nome]=rotulo; } };
})();
