/* Fosfena · NK101 · exercícios interativos que simulam a interface do Nuke.
   Ficam neste arquivo (e não no nk101-pratica.js, que é gerado por script) e substituem, pelo id, os exercícios de escolha equivalentes.
   Tipos novos: "paineis" (arrastar abas para montar o workspace), "atalho" (mouse no painel certo + tecla),
   "prefs" (Large Viewer e Preferences) e "maxpaineis" (limite de painéis no Properties). */
(function(){
  if(!window.FosPratica||!window.FOS_PRATICA) return;
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const help=()=>FosPratica.helpBtn();

  const css=`
.nk{--nk-bg:#2b2b2b;--nk-pan:#323232;--nk-bar:#3d3d3d;--nk-line:#1d1d1d;--nk-tx:#d6d6d6;--nk-mut:#9a9a9a;--nk-acc:#f7931e;font:12.5px/1.3 system-ui,-apple-system,Segoe UI,sans-serif;color:var(--nk-tx);user-select:none;-webkit-user-select:none}
.nk-tray{display:flex;flex-wrap:wrap;gap:6px;min-height:40px;padding:8px;border:1px dashed rgba(236,234,228,.25);border-radius:10px;margin-bottom:10px;background:rgba(10,9,16,.35)}
.nk-tray:empty::after{content:'Todas as abas estão no workspace.';color:var(--muted);font-size:13px;align-self:center}
.nk-tab{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:6px;background:var(--nk-bar);border:1px solid #555;color:var(--nk-tx);cursor:grab;touch-action:none;font-size:12.5px;white-space:nowrap}
.nk-tab i{width:8px;height:8px;border-radius:2px;background:var(--c,#888);flex:none}
.nk-tab.sel{outline:2px solid var(--nk-acc);outline-offset:1px}.nk-tab.bad{border-color:#ff6b6b;box-shadow:0 0 0 2px rgba(255,107,107,.35)}.nk-tab.good{border-color:#7be0a5}
.nk-ghost{position:fixed;z-index:9999;pointer-events:none;opacity:.9;transform:translate(-50%,-50%) rotate(-3deg);box-shadow:0 10px 24px rgba(0,0,0,.6)}
.nk-ws{display:grid;grid-template-columns:1.9fr 1fr;grid-template-rows:1.5fr 1fr;gap:4px;background:var(--nk-line);border:1px solid #111;border-radius:8px;padding:4px;aspect-ratio:16/9;min-height:260px}
.nk-zone{background:var(--nk-pan);border-radius:4px;display:flex;flex-direction:column;min-width:0;min-height:0;position:relative;transition:box-shadow .15s}
.nk-zone[data-z="c"]{grid-row:1/3;grid-column:2}
.nk-zone.hot{box-shadow:inset 0 0 0 2px var(--nk-acc)}
.nk-tabs{display:flex;flex-wrap:wrap;gap:2px;padding:3px;background:var(--nk-bar);border-radius:4px 4px 0 0;min-height:30px}
.nk-tabs .nk-tab{padding:4px 8px;border-radius:4px 4px 0 0;font-size:11.5px}
.nk-body{flex:1;display:grid;place-items:center;color:var(--nk-mut);font-size:12px;text-align:center;padding:8px;min-height:0}
.nk-body b{display:block;font-size:15px;color:#bdbdbd;font-weight:600;margin-bottom:2px}
.nk-hint{position:absolute;inset:auto 6px 6px 6px;font-size:11px;color:#8a8a8a;text-align:center}
@media (max-width:640px){.nk-hint{position:static;padding:0 0 6px}.nk-ws{aspect-ratio:auto;grid-template-columns:1fr;grid-template-rows:auto;min-height:0}.nk-zone{min-height:96px}.nk-zone[data-z="c"]{grid-row:auto;grid-column:auto}}
.nk-mini{display:grid;grid-template-columns:1.4fr 1fr;gap:4px;background:var(--nk-line);border-radius:8px;padding:4px;min-height:220px}
.nk-pane{background:var(--nk-pan);border-radius:4px;position:relative;display:flex;flex-direction:column;cursor:crosshair;outline:none}
.nk-pane.mouse{box-shadow:inset 0 0 0 2px var(--nk-acc)}
.nk-pane .nk-tabs{min-height:0}.nk-pane .nk-body{position:relative}
.nk-pop{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#1f1f1f;border:1px solid #666;border-radius:6px;padding:8px 10px;min-width:150px;color:#ddd;box-shadow:0 8px 20px rgba(0,0,0,.6);font-size:12px;text-align:left}
.nk-pop input{width:100%;box-sizing:border-box;background:#111;border:1px solid var(--nk-acc);color:#fff;border-radius:4px;padding:4px 6px;margin-top:4px;font:inherit}
.nk-3d{position:absolute;inset:0;background:linear-gradient(#2a2a2a,#232323);overflow:hidden}.nk-3d::after{content:'';position:absolute;left:-40%;right:-40%;bottom:-10%;height:70%;background-image:linear-gradient(#555 1px,transparent 1px),linear-gradient(90deg,#555 1px,transparent 1px);background-size:28px 28px;transform:perspective(220px) rotateX(60deg);opacity:.6}
.nk-keys{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.nk-key{min-width:44px;padding:8px 12px;border-radius:8px;border:1px solid #666;border-bottom-width:3px;background:#2a2a2a;color:#eee;font:600 13px var(--f-mono,monospace);cursor:pointer}
.nk-key:active{transform:translateY(1px);border-bottom-width:2px}
.nk-steps{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:0;list-style:none;font-size:14px}
.nk-steps li{display:flex;gap:8px;align-items:center;color:var(--muted)}.nk-steps li::before{content:'';width:16px;height:16px;border-radius:50%;border:1.5px solid #666;flex:none}
.nk-steps li.now{color:var(--fg)}.nk-steps li.now::before{border-color:var(--nk-acc)}
.nk-steps li.ok{color:#7be0a5}.nk-steps li.ok::before{background:#7be0a5;border-color:#7be0a5}
.nk-dlg{background:#2b2b2b;border:1px solid #555;border-radius:8px;overflow:hidden;max-width:560px}
.nk-dlg header{background:#3d3d3d;padding:6px 10px;font-weight:600;display:flex;justify-content:space-between}
.nk-dlg .in{display:grid;grid-template-columns:150px 1fr;min-height:190px}
.nk-dlg nav{background:#262626;border-right:1px solid #1d1d1d;padding:6px 0;display:flex;flex-direction:column}
.nk-dlg nav button{text-align:left;padding:6px 12px;color:#ccc;font-size:12.5px;background:none;border:0;cursor:pointer}.nk-dlg nav button.on{background:#4a4a4a;color:#fff}.nk-dlg nav button.sub{padding-left:24px}
.nk-dlg .pg{padding:12px 14px;display:flex;flex-direction:column;gap:10px}
.nk-dlg label{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.nk-dlg select,.nk-num{background:#1b1b1b;border:1px solid #666;color:#eee;border-radius:4px;padding:4px 6px;font:inherit;font-size:13px}
@media (max-width:520px){.nk-dlg .in{grid-template-columns:1fr}.nk-dlg nav{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid #1d1d1d}}
.nk-bin{background:#2b2b2b;border:1px solid #444;border-radius:8px;overflow:hidden;max-width:420px}
.nk-bin .tb{display:flex;align-items:center;gap:8px;padding:6px 8px;background:#3d3d3d}
.nk-num{width:44px;text-align:center;font-size:14px}.nk-num:focus{outline:2px solid var(--nk-acc)}
.nk-node{margin:6px;border:1px solid #555;border-radius:4px;background:#333}
.nk-node h4{margin:0;padding:5px 8px;font-size:12.5px;background:#444;display:flex;justify-content:space-between}
.nk-node div{padding:6px 8px;color:#aaa;font-size:12px}
`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---------- 1. arrastar as abas para montar o workspace ---------- */
  const PANELS={
    viewer:{n:'Viewer', c:'#7ab8ff', z:'a', why:'O Viewer é onde você vê a imagem. Fica na área grande.'},
    graph:{n:'Node Graph', c:'#f7931e', z:'b', why:'O Node Graph é onde você trabalha com os nodes. Fica embaixo do Viewer.'},
    curve:{n:'Curve Editor', c:'#c792ea', z:'b', why:'O Curve Editor é de animação e keyframes. Fica junto do Node Graph.'},
    dope:{n:'Dope Sheet', c:'#c792ea', z:'b', why:'O Dope Sheet também é de animação. Fica junto do Node Graph.'},
    props:{n:'Properties', c:'#7be0a5', z:'c', why:'O Properties é onde você ajusta os parâmetros. Fica na coluna da direita.'},
    bg:{n:'Background Renders', c:'#8d8d8d', z:'c', why:'Background Renders é fila de render, coisa de pipeline. Fica junto do Properties.'},
    scene:{n:'Scene Graph', c:'#8d8d8d', z:'c', why:'O Scene Graph organiza os elementos 3D. Fica junto do Properties.'},
  };
  const ZONES={a:{t:'Área grande',h:'aqui você vê'},b:{t:'Embaixo',h:'aqui você trabalha'},c:{t:'Coluna da direita',h:'aqui você ajusta'}};
  function paineisEx(ex, el, done){
    const order=['scene','graph','dope','viewer','bg','props','curve']; // embaralhado fixo
    let where={}; order.forEach(k=>where[k]='tray'); let sel=null, solved=false;
    el.innerHTML=`<div class="nk"><div class="nk-tray" data-z="tray" aria-label="Abas soltas"></div>
      <div class="nk-ws">${['a','b','c'].map(z=>`<div class="nk-zone" data-z="${z}"><div class="nk-tabs" data-z="${z}"></div><div class="nk-body" data-body="${z}"></div><span class="nk-hint">${ZONES[z].h}</span></div>`).join('')}</div></div>
      <div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button><button class="btn btn-ghost" data-rst>Recomeçar</button>${help()}</div>
      <p class="px-fb" aria-live="polite"></p>
      <p style="font-size:13px;color:var(--muted)">Arraste cada aba para a área certa, como no Nuke. No celular, toque na aba e depois na área.</p>`;
    const root=el.querySelector('.nk'), fb=el.querySelector('.px-fb');
    const tabEl=k=>`<button type="button" class="nk-tab ${sel===k?'sel':''}" data-k="${k}" style="--c:${PANELS[k].c}"><i></i>${esc(PANELS[k].n)}</button>`;
    function draw(marks){
      root.querySelector('.nk-tray').innerHTML=order.filter(k=>where[k]==='tray').map(tabEl).join('');
      ['a','b','c'].forEach(z=>{ const ks=order.filter(k=>where[k]===z); root.querySelector(`.nk-tabs[data-z="${z}"]`).innerHTML=ks.map(tabEl).join('');
        const top=ks[0]; root.querySelector(`[data-body="${z}"]`).innerHTML=top?`<span><b>${esc(PANELS[top].n)}</b>${ks.length>1?`+ ${ks.length-1} aba${ks.length>2?'s':''}`:''}</span>`:'<span>solte uma aba aqui</span>'; });
      if(marks) root.querySelectorAll('.nk-tab').forEach(t=>{ const k=t.dataset.k; if(where[k]!=='tray') t.classList.add(where[k]===PANELS[k].z?'good':'bad'); });
    }
    const zoneAt=(x,y)=>{ const e=document.elementFromPoint(x,y); const z=e&&e.closest('[data-z]'); return z&&root.contains(z)?z.dataset.z:null; };
    function put(k,z){ if(!k||!z) return; where[k]=z; sel=null; fb.textContent=''; fb.className='px-fb'; draw(); }
    root.addEventListener('pointerdown',e=>{
      const t=e.target.closest('.nk-tab'); if(!t||solved) return; e.preventDefault();
      const k=t.dataset.k, x0=e.clientX, y0=e.clientY; let g=null, hot=null;
      const mv=m=>{ if(!g&&Math.hypot(m.clientX-x0,m.clientY-y0)>6){ g=t.cloneNode(true); g.classList.add('nk-ghost'); document.body.append(g); }
        if(g){ g.style.left=m.clientX+'px'; g.style.top=m.clientY+'px'; const z=zoneAt(m.clientX,m.clientY); const zEl=z&&z!=='tray'?root.querySelector(`.nk-zone[data-z="${z}"]`):null; if(hot!==zEl){ hot&&hot.classList.remove('hot'); zEl&&zEl.classList.add('hot'); hot=zEl; } } };
      const up=u=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); removeEventListener('pointercancel',up); hot&&hot.classList.remove('hot');
        if(g){ g.remove(); put(k, zoneAt(u.clientX,u.clientY)); } else { sel = sel===k?null:k; draw(); } };
      addEventListener('pointermove',mv); addEventListener('pointerup',up); addEventListener('pointercancel',up);
    });
    root.addEventListener('click',e=>{ if(!sel||e.target.closest('.nk-tab')) return; const z=e.target.closest('[data-z]'); if(z) put(sel,z.dataset.z); });
    el.querySelector('[data-rst]').onclick=()=>{ solved=false; order.forEach(k=>where[k]='tray'); sel=null; fb.textContent=''; draw(); };
    el.querySelector('[data-chk]').onclick=()=>{
      const left=order.filter(k=>where[k]==='tray');
      if(left.length){ fb.textContent=`Ainda faltam ${left.length} aba${left.length>1?'s':''} para colocar no workspace.`; fb.className='px-fb no'; return; }
      const wrong=order.filter(k=>where[k]!==PANELS[k].z); draw(true);
      if(!wrong.length){ solved=true; fb.textContent=ex.ok||'Isso! Viewer para ver, Node Graph para trabalhar e Properties para ajustar.'; fb.className='px-fb ok'; done(true); return; }
      fb.textContent=`${wrong.length} aba${wrong.length>1?'s':''} no lugar errado (em vermelho). Dica: ${PANELS[wrong[0]].why}`; fb.className='px-fb no';
    };
    draw();
  }

  /* ---------- 2. atalhos: o que importa é onde está o mouse ---------- */
  function atalhoEx(ex, el, done){
    const tasks=[{key:'Tab', pane:'graph', txt:'Abra a busca de nodes (o menu para criar um node).'},
                 {key:'S', pane:'graph', txt:'Abra as configurações do projeto (Project Settings).'}];
    let step=0, mouse=null;
    el.innerHTML=`<ol class="nk-steps">${tasks.map((t,i)=>`<li data-s="${i}">${esc(t.txt)}</li>`).join('')}</ol>
      <div class="nk"><div class="nk-mini">
        <div class="nk-pane" data-p="viewer" tabindex="0"><div class="nk-tabs"><span class="nk-tab" style="--c:#7ab8ff"><i></i>Viewer1</span></div><div class="nk-body"><span><b>Viewer</b>passe o mouse ou toque aqui</span></div></div>
        <div class="nk-pane" data-p="graph" tabindex="0"><div class="nk-tabs"><span class="nk-tab" style="--c:#f7931e"><i></i>Node Graph</span></div><div class="nk-body"><span><b>Node Graph</b>passe o mouse ou toque aqui</span></div></div>
      </div>
      <div class="nk-keys"><span style="font-size:13px;color:var(--muted)">Aperte no teclado ou toque:</span><button type="button" class="nk-key" data-key="Tab">Tab</button><button type="button" class="nk-key" data-key="S">S</button></div></div>
      <div class="px-row">${help()}</div><p class="px-fb" aria-live="polite"></p>`;
    const fb=el.querySelector('.px-fb'), panes=[...el.querySelectorAll('.nk-pane')];
    const steps=()=>el.querySelectorAll('.nk-steps li').forEach((li,i)=>{ li.className=i<step?'ok':i===step?'now':''; });
    const setMouse=p=>{ mouse=p; panes.forEach(x=>x.classList.toggle('mouse',x.dataset.p===p)); };
    panes.forEach(p=>{ p.addEventListener('pointerenter',()=>setMouse(p.dataset.p)); p.addEventListener('pointerdown',()=>setMouse(p.dataset.p)); });
    const body=p=>el.querySelector(`.nk-pane[data-p="${p}"] .nk-body`);
    const reset=()=>{ body('viewer').innerHTML='<span><b>Viewer</b>passe o mouse ou toque aqui</span>'; body('graph').innerHTML='<span><b>Node Graph</b>passe o mouse ou toque aqui</span>'; };
    function press(key){
      if(step>=tasks.length) return;
      if(!mouse){ fb.textContent='Primeiro coloque o mouse (ou toque) em cima de um painel. No Nuke, o atalho vale para o painel em que o mouse está.'; fb.className='px-fb no'; return; }
      reset(); const b=body(mouse);
      const fx={ 'viewer:Tab':'<div class="nk-3d"></div><span style="position:relative"><b>3D</b>o Viewer foi para o ambiente 3D</span>',
                 'graph:Tab':'<div class="nk-pop">Busca de nodes<input value="" placeholder="Digite o nome do node…" readonly></div>',
                 'viewer:S':'<div class="nk-pop"><b>Viewer Settings</b>configurações do Viewer</div>',
                 'graph:S':'<div class="nk-pop"><b>Project Settings</b>configurações do projeto</div>' };
      b.innerHTML=fx[mouse+':'+key];
      const t=tasks[step];
      if(key===t.key&&mouse===t.pane){ step++; steps();
        if(step>=tasks.length){ fb.textContent=ex.ok||'Isso! O mesmo atalho muda conforme o painel em que está o mouse.'; fb.className='px-fb ok'; done(true); }
        else { fb.textContent='Certo! Agora a próxima.'; fb.className='px-fb ok'; } }
      else if(key===t.key){ fb.textContent=`Com o mouse no ${mouse==='viewer'?'Viewer':'Node Graph'}, o ${key} faz outra coisa. Tente com o mouse no outro painel.`; fb.className='px-fb no'; }
      else { fb.textContent='Esse atalho não é o desta tarefa. Tente a outra tecla.'; fb.className='px-fb no'; }
    }
    el.querySelectorAll('.nk-key').forEach(k=>k.onclick=()=>press(k.dataset.key));
    const onKey=e=>{ if(!document.body.contains(el)){ removeEventListener('keydown',onKey,true); return; } if(!mouse||!el.querySelector('.nk-pane.mouse:hover')) return;
      if(e.key==='Tab'||e.key==='s'||e.key==='S'){ e.preventDefault(); press(e.key==='Tab'?'Tab':'S'); } };
    addEventListener('keydown',onKey,true);
    steps();
  }

  /* ---------- 3. Large Viewer (Shift+F3) e Preferences (Shift+S) ---------- */
  function prefsEx(ex, el, done){
    let step=0;
    const tasks=['Deixe a interface no layout Large Viewer pelo atalho.','Abra as Preferences pelo atalho.','Em Behaviors > Startup, deixe o Startup Workspace como Large Viewer.'];
    el.innerHTML=`<ol class="nk-steps">${tasks.map((t,i)=>`<li data-s="${i}">${esc(t)}</li>`).join('')}</ol>
      <div class="nk"><div class="nk-keys" data-k><span style="font-size:13px;color:var(--muted)">Qual atalho?</span>
        ${['Shift + F3','Alt + H','Ctrl + S','Shift + S','Tab'].map(k=>`<button type="button" class="nk-key" data-key="${k}">${k}</button>`).join('')}</div>
        <div data-dlg style="margin-top:12px"></div></div>
      <div class="px-row">${help()}</div><p class="px-fb" aria-live="polite"></p>`;
    const fb=el.querySelector('.px-fb'), dlg=el.querySelector('[data-dlg]');
    const steps=()=>el.querySelectorAll('.nk-steps li').forEach((li,i)=>{ li.className=i<step?'ok':i===step?'now':''; });
    const say=(t,ok)=>{ fb.textContent=t; fb.className='px-fb '+(ok?'ok':'no'); };
    function openPrefs(){
      let page='general';
      const pages={ general:'<p style="margin:0;color:#aaa">Configurações gerais. Procure onde fica o comportamento ao abrir o Nuke.</p>',
        perf:'<label>Threads/Processes<select><option>padrão</option><option>usar mais da máquina</option></select></label><p style="margin:0;color:#aaa;font-size:12px">Em PC mais fraco, a aula mostra a segunda opção. Não é o que pedimos agora.</p>',
        startup:'<label>Startup Workspace<select data-ws><option>Compositing</option><option>Large Viewer</option></select></label>' };
      const draw=()=>{ dlg.innerHTML=`<div class="nk-dlg"><header>Preferences<span style="color:#999">×</span></header><div class="in"><nav>
          <button type="button" data-pg="general" class="${page==='general'?'on':''}">General</button>
          <button type="button" data-pg="perf" class="${page==='perf'?'on':''}">Performance</button>
          <button type="button" data-pg="perf" class="sub ${page==='perf'?'on':''}">Threads/Processes</button>
          <button type="button" data-pg="startup" class="${page==='startup'?'on':''}">Behaviors</button>
          <button type="button" data-pg="startup" class="sub ${page==='startup'?'on':''}">Startup</button></nav><div class="pg">${pages[page]}</div></div></div>`;
        dlg.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>{ page=b.dataset.pg; draw(); });
        const ws=dlg.querySelector('[data-ws]'); if(ws) ws.onchange=()=>{ if(ws.value==='Large Viewer'){ step=3; steps(); say(ex.ok||'Pronto! Agora o Nuke sempre abre no Large Viewer.',true); done(true); } }; };
      draw();
    }
    el.querySelectorAll('.nk-key').forEach(b=>b.onclick=()=>{
      const k=b.dataset.key;
      if(step===0){ if(k==='Shift + F3'){ step=1; steps(); say('Isso! O Shift + F3 organiza a interface no Large Viewer. Agora abra as Preferences.',true); } else say('Esse não é o atalho do Large Viewer. Dica: ele aparece ao lado do nome em Workspace.',false); return; }
      if(step===1){ if(k==='Shift + S'){ step=2; steps(); say('Isso! Agora ache o Startup Workspace.',true); openPrefs(); } else say('Esse não abre as Preferences. Dica: é Shift com a letra das configurações.',false); return; }
    });
    steps();
  }

  /* ---------- 4. quantos painéis abertos no Properties ---------- */
  function maxEx(ex, el, done){
    const nodes=['Merge1','Grade1','Blur1','Transform1','Read1'];
    el.innerHTML=`<div class="nk"><div class="nk-bin"><div class="tb"><span>Properties</span><input class="nk-num" type="number" min="0" max="10" value="10" inputmode="numeric" aria-label="Quantos painéis abertos ao mesmo tempo"><span style="color:#aaa;font-size:12px">← painéis abertos ao mesmo tempo</span></div><div data-n></div></div></div>
      <div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button>${help()}</div><p class="px-fb" aria-live="polite"></p>
      <p style="font-size:13px;color:var(--muted)">Com 10, cada node que você abre empilha mais um painel. Ajuste o número como a aula recomenda.</p>`;
    const inp=el.querySelector('.nk-num'), box=el.querySelector('[data-n]'), fb=el.querySelector('.px-fb');
    const draw=()=>{ const n=Math.max(0,Math.min(10,parseInt(inp.value)||0)); box.innerHTML=nodes.slice(0,Math.max(1,Math.min(n,nodes.length))).map(x=>`<div class="nk-node"><h4>${x}<span style="color:#888">×</span></h4><div>parâmetros do ${x}…</div></div>`).join(''); };
    inp.oninput=()=>{ draw(); fb.textContent=''; };
    el.querySelector('[data-chk]').onclick=()=>{ if(parseInt(inp.value)===1){ fb.textContent=ex.ok||'Isso! Com 1, só aparece o node que você está mexendo.'; fb.className='px-fb ok'; done(true); } else { fb.textContent='Ainda tem painel demais empilhado. O Maurício quase sempre usa só um por vez.'; fb.className='px-fb no'; } };
    draw();
  }

  FosPratica.tipo('paineis','Monte o workspace',paineisEx);
  FosPratica.tipo('atalho','Mouse no painel certo',atalhoEx);
  FosPratica.tipo('prefs','Atalhos e Preferences',prefsEx);
  FosPratica.tipo('maxpaineis','Ajuste o Properties',maxEx);

  /* troca, pelo id, os exercícios de escolha da aula 02 pelas versões interativas (mantém o trecho de dúvida de cada um) */
  const NOVOS={
    'a2-paineis':{tipo:'paineis', titulo:'Monte o workspace do Nuke', enunciado:'Arraste as abas para o lugar certo: o Viewer na área grande, o Node Graph e os painéis de animação embaixo, e o Properties com os painéis de pipeline e 3D na direita.', ok:'Isso! Viewer para ver, Node Graph para trabalhar e Properties para ajustar. Os outros painéis ficam em abas junto deles.'},
    'a2-layout':{tipo:'prefs', titulo:'Deixe o Nuke trabalhável', enunciado:'Faça o que a aula mostra: troque para o Large Viewer e deixe ele como padrão ao abrir o Nuke.', ok:'Pronto! Agora o Nuke sempre abre no Large Viewer.'},
    'a2-mouse':{tipo:'atalho', titulo:'Cuidado com onde está o mouse', enunciado:'No Nuke, o mesmo atalho faz coisas diferentes conforme o painel em que está o mouse. Faça as duas tarefas.', ok:'Isso! Tab no Node Graph abre a busca de nodes; no Viewer, vai para o 3D. S no Node Graph abre o projeto; no Viewer, as configurações do Viewer.'},
    'a2-props':{tipo:'maxpaineis', titulo:'Um painel de propriedades por vez', enunciado:'O seu Properties está abrindo 10 painéis ao mesmo tempo. Deixe como a aula recomenda.'},
  };
  const list=FOS_PRATICA['aula-2']||[];
  list.forEach((x,i)=>{ const n=NOVOS[x.id]; if(n) list[i]=Object.assign({}, x, n, {opcoes:undefined, certo:undefined}); });
})();
