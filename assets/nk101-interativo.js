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

  /* ---------- 1. montar o workspace: réplica da interface do Nuke em HTML/CSS ---------- */
  const nkwCss=`
.nkw-fit{position:relative;width:100%;overflow:hidden;border-radius:6px;box-shadow:0 14px 40px rgba(0,0,0,.45);border:1px solid #0d0d0d}
.nkw{position:absolute;left:0;top:0;width:1000px;height:560px;transform-origin:0 0;background:#262626;color:#c8c8c8;font:11px/1.25 "Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;display:flex;flex-direction:column;user-select:none;-webkit-user-select:none;touch-action:none}
.nkw *{box-sizing:border-box}
.nkw-title{height:22px;background:#1e1e1e;display:flex;align-items:center;justify-content:center;color:#9d9d9d;position:relative;flex:none}
.nkw-title .wb{position:absolute;right:6px;top:4px;display:flex;gap:12px;color:#888;font-size:12px}
.nkw-menu{height:20px;background:#2d2d2d;display:flex;gap:14px;align-items:center;padding:0 8px;color:#c8c8c8;border-bottom:1px solid #1a1a1a;flex:none}
.nkw-main{flex:1;display:flex;min-height:0}
.nkw-tool{width:28px;background:#2d2d2d;border-right:1px solid #1a1a1a;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 0;flex:none}
.nkw-tool svg{width:16px;height:16px;flex:none}
.nkw-grid{flex:1;display:grid;grid-template-columns:var(--sx,74%) 4px 1fr;grid-template-rows:var(--sy,58%) 4px 1fr;background:#151515;min-width:0;min-height:0}
.nkw-pane{background:#2f2f2f;display:flex;flex-direction:column;min-width:0;min-height:0;position:relative;overflow:hidden}
.nkw-pane[data-pane=a]{grid-area:1/1/2/2}.nkw-pane[data-pane=b]{grid-area:3/1/4/2}.nkw-pane[data-pane=c]{grid-area:1/3/4/4}
.nkw-dv{background:#151515;position:relative;z-index:2}
.nkw-dv:hover,.nkw-dv.on{background:#f7931e}
.nkw-dv.v{grid-area:1/2/4/3;cursor:col-resize}.nkw-dv.h{grid-area:2/1/3/2;cursor:row-resize}
.nkw-dv::after{content:'';position:absolute;inset:-4px}
.nkw-bar{height:21px;background:#262626;display:flex;align-items:flex-end;gap:1px;padding:0 0 0 2px;flex:none;border-bottom:1px solid #3a3a3a}
.nkw-cm{width:15px;height:15px;margin:0 3px 3px 1px;border:1px solid #5a5a5a;border-radius:2px;background:linear-gradient(#444,#383838);flex:none;display:grid;place-items:center}
.nkw-cm::after{content:'';width:7px;height:5px;border-top:1px solid #aaa;border-bottom:1px solid #aaa;box-shadow:inset 0 2px 0 -1px #aaa}
.nkw-tab{height:19px;display:flex;align-items:center;gap:7px;padding:0 6px 0 9px;background:#303030;border:1px solid #1c1c1c;border-bottom:0;border-radius:3px 3px 0 0;color:#a8a8a8;white-space:nowrap;cursor:default;font-size:10.5px}
.nkw-tab b{font-weight:400;overflow:hidden;text-overflow:ellipsis}
.nkw-bar{overflow:hidden}.nkw-bar .nkw-tab{min-width:0;flex:0 1 auto}
.nkw-tab .x{color:#7a7a7a;font-size:11px;line-height:1}
.nkw-tab.on{background:#3a3a3a;color:#f7931e;height:20px}
.nkw-tab:hover{color:#ddd}.nkw-tab.on:hover{color:#ffa94a}
.nkw-tab.sel{box-shadow:inset 0 0 0 1px #f7931e}
.nkw-tab.bad{background:#5a2424;color:#ffb4b4}
.nkw-tab.ghost{position:fixed;z-index:9999;pointer-events:none;opacity:.92;transform:translate(-30%,-50%);box-shadow:0 6px 18px rgba(0,0,0,.6);border:1px solid #f7931e;border-radius:3px;height:22px;font:11px "Segoe UI",Roboto,Arial,sans-serif;background:#3a3a3a;color:#f7931e;padding:0 10px}
.nkw-body{flex:1;position:relative;min-height:0;overflow:hidden}
.nkw-empty{position:absolute;inset:0;display:grid;place-items:center;color:#6b6b6b;font-size:12px}
.nkw-drop{position:absolute;inset:0;z-index:5;pointer-events:none;background:rgba(247,147,30,.16);box-shadow:inset 0 0 0 2px #f7931e;display:none}
.nkw-drop span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#f7931e;color:#1a1a1a;font-weight:600;padding:4px 10px;border-radius:3px;font-size:12px;white-space:nowrap}
.nkw-pane.hot .nkw-drop{display:block}
.nkw-st{height:18px;background:#262626;border-top:1px solid #1a1a1a;color:#8d8d8d;font-size:10px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px;gap:12px;flex:none}
/* conteúdo de cada painel */
.nkw-v{position:absolute;inset:0;display:flex;flex-direction:column;background:#000}
.nkw-vc{background:#333;display:flex;align-items:center;gap:4px;padding:2px 4px;height:21px;flex:none;border-bottom:1px solid #222;font-size:10px;color:#bbb;overflow:hidden;white-space:nowrap}
.nkw-dd{background:#262626;border:1px solid #4a4a4a;border-radius:2px;padding:1px 14px 1px 4px;position:relative;line-height:14px}
.nkw-dd::after{content:'';position:absolute;right:4px;top:6px;border:3px solid transparent;border-top-color:#999}
.nkw-ib{width:16px;height:15px;border:1px solid #474747;border-radius:2px;background:#2c2c2c;flex:none}
.nkw-sp{flex:1}
.nkw-img{flex:1;position:relative;background:#000;min-height:0}
.nkw-frame{position:absolute;left:33%;right:33%;top:12%;bottom:16%;border:1px solid #4d4d4d}
.nkw-frame span{position:absolute;left:100%;bottom:-2px;margin-left:3px;color:#8a8a8a;font-size:9px;white-space:nowrap}
.nkw-info{position:absolute;left:4px;right:4px;bottom:2px;color:#9a9a9a;font-size:9px;display:flex;justify-content:space-between;white-space:nowrap;overflow:hidden}
.nkw-tl{height:20px;flex:none;background:#2a2a2a;border-top:1px solid #444;position:relative;overflow:hidden;background-image:repeating-linear-gradient(90deg,#5c5c5c 0 1px,transparent 1px 7.4%),repeating-linear-gradient(90deg,#444 0 1px,transparent 1px 1.48%);background-size:100% 7px,100% 4px;background-repeat:no-repeat;background-position:0 0,0 0}
.nkw-tl i{position:absolute;bottom:1px;font-style:normal;font-size:8.5px;color:#888}
.nkw-tl em{position:absolute;left:1.2%;top:0;bottom:0;width:1px;background:#f7931e}
.nkw-tr{height:21px;flex:none;background:#333;display:flex;align-items:center;gap:3px;padding:0 4px;font-size:10px;color:#bbb;white-space:nowrap;overflow:hidden}
.nkw-tr .pb{width:15px;height:14px;border:1px solid #4a4a4a;background:#2a2a2a;border-radius:2px;display:grid;place-items:center;color:#c8c8c8;font-size:7px;flex:none}
.nkw-ng{position:absolute;inset:0;background:#3a3a3a}
.nkw-node{position:absolute;left:46%;top:56%;width:70px;height:16px;border-radius:8px;background:linear-gradient(#d9d9d9,#a9a9a9);border:1px solid #222;color:#111;font-size:9.5px;display:grid;place-items:center}
.nkw-node::before{content:'';position:absolute;left:50%;top:-14px;width:1px;height:14px;background:#888}
.nkw-grid2{position:absolute;inset:0;background:#2e2e2e;background-image:linear-gradient(#3a3a3a 1px,transparent 1px),linear-gradient(90deg,#3a3a3a 1px,transparent 1px);background-size:40px 30px}
.nkw-list{position:absolute;left:0;top:0;bottom:0;width:30%;background:#2a2a2a;border-right:1px solid #1a1a1a;padding:4px 6px;color:#9a9a9a;font-size:10px;display:flex;flex-direction:column;gap:3px}
.nkw-pr{position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(#323232,#2a2a2a)}
.nkw-pt{height:22px;flex:none;display:flex;align-items:center;gap:4px;padding:0 4px;border-bottom:1px solid #222;background:#333}
.nkw-pt input{width:26px;height:15px;background:#1f1f1f;border:1px solid #4a4a4a;color:#ddd;font:10px inherit;text-align:center;padding:0;border-radius:2px}
.nkw-tbl{position:absolute;inset:0;background:#2b2b2b}
.nkw-th{display:flex;background:#383838;border-bottom:1px solid #1d1d1d;color:#bbb;font-size:10px}
.nkw-th span{flex:1;padding:3px 5px;border-right:1px solid #262626;white-space:nowrap;overflow:hidden}
.nkw-tree{position:absolute;inset:0;background:#2b2b2b;padding:4px 6px;color:#aaa;font-size:10.5px;display:flex;flex-direction:column;gap:3px}
.nkw-help{margin-top:14px;font-size:13px;color:var(--muted)}
.nkw-chips{display:none;flex-direction:column;gap:10px;margin-top:14px}
.nkw-chips .row{display:flex;flex-wrap:wrap;gap:8px}
.nkw-chips button{padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:#2a2a2a;color:#ddd;font-size:14px}
.nkw-chips button.sel{border-color:#f7931e;color:#f7931e;background:rgba(247,147,30,.1)}
.nkw-chips button.bad{border-color:#e8746a}
.nkw-chips .dest button{background:#1f1f1f}
.nkw-chips .lbl{font-size:12.5px;color:var(--muted)}
@media (max-width:700px),(pointer:coarse){.nkw-chips{display:flex}}
`;
  const st2=document.createElement('style'); st2.textContent=nkwCss; document.head.appendChild(st2);

  const PANELS={
    viewer:{n:'Viewer1', z:'a', why:'O Viewer é onde você vê a imagem. Ele fica sozinho na área grande, em cima.'},
    graph:{n:'Node Graph', z:'b', why:'O Node Graph é onde você monta os nodes. Fica embaixo do Viewer.'},
    curve:{n:'Curve Editor', z:'b', why:'O Curve Editor é de animação. Fica em aba junto do Node Graph.'},
    dope:{n:'Dope Sheet', z:'b', why:'O Dope Sheet também é de animação. Fica em aba junto do Node Graph.'},
    props:{n:'Properties', z:'c', why:'O Properties é onde você ajusta os parâmetros. Fica na coluna da direita.'},
    bg:{n:'Background Renders', z:'c', why:'Background Renders é a fila de render. Fica em aba junto do Properties.'},
    scene:{n:'Scene Graph', z:'c', why:'O Scene Graph organiza o 3D. Fica em aba junto do Properties.'},
  };
  const PANE_NOME={a:'Área do Viewer (em cima)',b:'Embaixo',c:'Coluna da direita'};
  const ICONS=['<rect x="3" y="3" width="10" height="10" rx="1" fill="none" stroke="#c9c9c9"/>','<path d="M3 12 8 3l5 9z" fill="none" stroke="#c9c9c9"/>','<circle cx="8" cy="8" r="5" fill="#8fb7e0"/>','<rect x="3" y="5" width="10" height="6" fill="#b9b9b9"/>','<path d="M3 8h10M8 3v10" stroke="#d1a35c" stroke-width="2"/>','<circle cx="8" cy="8" r="5" fill="none" stroke="#c9c9c9"/><circle cx="8" cy="8" r="2" fill="#c9c9c9"/>','<path d="M3 13 13 3" stroke="#77c27a" stroke-width="2"/>','<rect x="3" y="3" width="10" height="10" fill="#7c5aa6"/>','<path d="M4 4h8v8H4z" fill="#c45d5d"/>','<path d="M3 8a5 5 0 0 1 10 0" fill="none" stroke="#c9c9c9" stroke-width="1.5"/>','<circle cx="5" cy="8" r="2" fill="#bbb"/><circle cx="11" cy="8" r="2" fill="#bbb"/>','<path d="M8 2l2 4h4l-3 3 1 5-4-3-4 3 1-5-3-3h4z" fill="#d9c05a"/>','<rect x="2" y="6" width="12" height="4" fill="#5fa0a0"/>','<path d="M3 3h10v3H3zM3 10h10v3H3z" fill="#9a9a9a"/>','<circle cx="8" cy="8" r="5" fill="#6aa86a"/>','<path d="M8 3v10M3 8h10" stroke="#9a9a9a"/>'];
  const dd=t=>`<span class="nkw-dd">${t}</span>`, ib=(n=1)=>'<span class="nkw-ib"></span>'.repeat(n);
  const CONTENT={
    viewer:()=>`<div class="nkw-v"><div class="nkw-vc">${dd('rgba')}${dd('rgba.alpha')}${dd('RGB')}${ib(1)}${dd('A')}<span>-</span>${dd('B')}<span class="nkw-sp"></span>${dd('50%')}${dd('1:1')}${dd('2D')}${ib(3)}</div>
      <div class="nkw-vc">${ib(1)}<span>f/8</span>${ib(1)}<span>1</span>${ib(1)}<span>Y</span><span>1</span>${ib(2)}<span class="nkw-sp"></span>${dd('sRGB')}${ib(4)}</div>
      <div class="nkw-img"><div class="nkw-frame"><span>2K_Super_35(full-ap)</span></div><div class="nkw-info"><span>2K_Super_35(full-ap) 2048x1556  bbox: 0 0 1 1 channel: none</span><span>x=0 y=0</span></div></div>
      <div class="nkw-tl"><em></em>${[1,10,20,30,40,50,60,70,80,90,100].map((n,i)=>`<i style="left:${1+i*9.6}%">${n}</i>`).join('')}</div>
      <div class="nkw-tr">${dd('24*')}${dd('TF')}${dd('Global')}<span class="nkw-sp"></span>${['|◀','◀◀','◀|','◀','▶','|▶','▶▶','▶|'].map(s=>`<span class="pb">${s}</span>`).join('')}<span>10</span><span class="nkw-sp"></span>${ib(3)}<span>100</span></div></div>`,
    graph:()=>`<div class="nkw-ng"><div class="nkw-node">Viewer1</div></div>`,
    curve:()=>`<div class="nkw-grid2"><div class="nkw-list"><span>▸ Viewer1</span></div><svg style="position:absolute;left:30%;top:0;width:70%;height:100%" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 45 C30 45 40 12 60 15 S90 30 100 28" fill="none" stroke="#5f8fbf" stroke-width=".6" vector-effect="non-scaling-stroke"/></svg></div>`,
    dope:()=>`<div class="nkw-grid2" style="background-size:24px 100%"><div class="nkw-list"><span>▾ Project</span><span style="padding-left:10px">Viewer1</span></div></div>`,
    props:()=>`<div class="nkw-pr"><div class="nkw-pt">${ib(1)}<input value="10" readonly tabindex="-1">${ib(3)}</div></div>`,
    bg:()=>`<div class="nkw-tbl"><div class="nkw-th"><span>Process</span><span>Script</span><span>Write Node</span><span>Frames</span><span>Progress</span><span>Time</span></div></div>`,
    scene:()=>`<div class="nkw-tree"><span>▾ root</span><span style="padding-left:12px;color:#777">(sem cena 3D)</span></div>`,
  };
  function paineisEx(ex, el, done){
    const START={a:['dope','props'], b:['viewer','scene'], c:['graph','curve','bg']};
    let P, act, sel=null, solved=false, sx=74, sy=58, marks=false;
    const reset=()=>{ P=JSON.parse(JSON.stringify(START)); act={a:'dope',b:'viewer',c:'graph'}; sel=null; solved=false; marks=false; };
    reset();
    el.innerHTML=`<div class="nkw-fit"><div class="nkw">
        <div class="nkw-title">Untitled - NukeX<span class="wb"><span>–</span><span>▢</span><span>✕</span></span></div>
        <div class="nkw-menu">${['File','Edit','Workspace','Viewer','Render','Cache','Help'].map(m=>`<span>${m}</span>`).join('')}</div>
        <div class="nkw-main"><div class="nkw-tool">${ICONS.map(s=>`<svg viewBox="0 0 16 16">${s}</svg>`).join('')}</div>
          <div class="nkw-grid">${['a','b','c'].map(z=>`<div class="nkw-pane" data-pane="${z}"><div class="nkw-bar"></div><div class="nkw-body"></div><div class="nkw-drop"><span>Encaixar aqui</span></div></div>`).join('')}
            <div class="nkw-dv v" data-dv="x"></div><div class="nkw-dv h" data-dv="y"></div></div></div>
        <div class="nkw-st"><span>Channel Count: 22</span><span>Localization Mode: On</span><span>Memory: 1.4 GB (2.2%)</span><span>CPU: 0.0%</span></div>
      </div></div>
      <div class="nkw-chips"><span class="lbl">No celular: toque numa aba e depois no lugar para onde ela vai.</span><div class="row" data-ch></div><div class="row dest">${['a','b','c'].map(z=>`<button type="button" data-to="${z}">→ ${PANE_NOME[z]}</button>`).join('')}</div></div>
      <div class="px-row"><button class="btn btn-primary" data-chk>Conferir</button><button class="btn btn-ghost" data-rst>Recomeçar</button>${help()}</div>
      <p class="px-fb" aria-live="polite"></p>
      <p class="nkw-help">Arraste as abas pelo nome, como no Nuke: o painel de destino acende em laranja. Clique numa aba para ver o painel; arraste as divisórias para redimensionar.</p>`;
    const fit=el.querySelector('.nkw-fit'), ws=el.querySelector('.nkw'), fb=el.querySelector('.px-fb'), chips=el.querySelector('[data-ch]');
    let scale=1;
    const resize=()=>{ const w=fit.clientWidth||1000; scale=w/1000; ws.style.transform=`scale(${scale})`; fit.style.height=(560*scale)+'px'; };
    if(window.ResizeObserver) new ResizeObserver(resize).observe(fit); else addEventListener('resize',resize);
    resize();
    const paneOf=k=>['a','b','c'].find(z=>P[z].includes(k));
    const isOk=k=>paneOf(k)===PANELS[k].z;
    function draw(){
      ws.querySelector('.nkw-grid').style.setProperty('--sx',sx+'%'); ws.querySelector('.nkw-grid').style.setProperty('--sy',sy+'%');
      ['a','b','c'].forEach(z=>{ const pane=ws.querySelector(`.nkw-pane[data-pane="${z}"]`);
        if(!P[z].includes(act[z])) act[z]=P[z][0]||null;
        pane.querySelector('.nkw-bar').innerHTML='<span class="nkw-cm"></span>'+P[z].map(k=>`<span class="nkw-tab ${act[z]===k?'on':''} ${sel===k?'sel':''} ${marks&&!isOk(k)?'bad':''}" data-k="${k}"><b>${esc(PANELS[k].n)}</b><span class="x">×</span></span>`).join('');
        pane.querySelector('.nkw-body').innerHTML=act[z]?CONTENT[act[z]]():'<div class="nkw-empty">painel vazio · arraste uma aba para cá</div>'; });
      chips.innerHTML=Object.keys(PANELS).map(k=>`<button type="button" data-k="${k}" class="${sel===k?'sel':''} ${marks&&!isOk(k)?'bad':''}">${esc(PANELS[k].n)}</button>`).join('');
    }
    const say=(t,ok)=>{ fb.textContent=t; fb.className='px-fb'+(ok===undefined?'':ok?' ok':' no'); };
    function check(auto){
      const wrong=Object.keys(PANELS).filter(k=>!isOk(k));
      if(!wrong.length){ solved=true; marks=false; sel=null; Object.assign(act,{a:'viewer',b:'graph',c:'props'}); draw(); say(ex.ok||'Isso! Viewer em cima, Node Graph embaixo e Properties na direita.',true); done(true); return; }
      if(auto) return;
      marks=true; draw(); say(`${wrong.length} aba${wrong.length>1?'s':''} no lugar errado (em vermelho). Dica: ${PANELS[wrong[0]].why}`,false);
    }
    function move(k,z){ if(!k||!z) return; const from=paneOf(k); if(from===z){ act[z]=k; sel=null; draw(); return; }
      P[from]=P[from].filter(x=>x!==k); P[z].push(k); act[z]=k; sel=null; marks=false; say(''); draw(); check(true); }
    const paneAt=(x,y)=>{ const e=document.elementFromPoint(x,y); const p=e&&e.closest('.nkw-pane'); return p&&ws.contains(p)?p:null; };
    ws.addEventListener('pointerdown',e=>{
      const dv=e.target.closest('[data-dv]');
      if(dv){ e.preventDefault(); const grid=ws.querySelector('.nkw-grid'), r=grid.getBoundingClientRect(); dv.classList.add('on');
        const mv=m=>{ if(dv.dataset.dv==='x') sx=Math.max(35,Math.min(85,(m.clientX-r.left)/r.width*100)); else sy=Math.max(30,Math.min(80,(m.clientY-r.top)/r.height*100));
          grid.style.setProperty('--sx',sx+'%'); grid.style.setProperty('--sy',sy+'%'); };
        const up=()=>{ dv.classList.remove('on'); removeEventListener('pointermove',mv); removeEventListener('pointerup',up); removeEventListener('pointercancel',up); };
        addEventListener('pointermove',mv); addEventListener('pointerup',up); addEventListener('pointercancel',up); return; }
      const t=e.target.closest('.nkw-tab');
      if(!t){ const p=e.target.closest('.nkw-pane'); if(sel&&p){ move(sel,p.dataset.pane); } return; }
      if(solved) { act[paneOf(t.dataset.k)]=t.dataset.k; draw(); return; }
      e.preventDefault();
      const k=t.dataset.k, x0=e.clientX, y0=e.clientY, touch=e.pointerType!=='mouse'; let g=null, hot=null;
      const mv=m=>{ if(!g&&Math.hypot(m.clientX-x0,m.clientY-y0)>5){ g=document.createElement('div'); g.className='nkw-tab ghost'; g.textContent=PANELS[k].n; document.body.append(g); }
        if(g){ g.style.left=m.clientX+'px'; g.style.top=m.clientY+'px'; const p=paneAt(m.clientX,m.clientY); if(hot!==p){ hot&&hot.classList.remove('hot'); p&&p.classList.add('hot'); hot=p; } } };
      const up=u=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); removeEventListener('pointercancel',up); hot&&hot.classList.remove('hot');
        if(g){ g.remove(); const p=paneAt(u.clientX,u.clientY); if(p) move(k,p.dataset.pane); }
        else { act[paneOf(k)]=k; sel=touch?(sel===k?null:k):null; draw(); } };
      addEventListener('pointermove',mv); addEventListener('pointerup',up); addEventListener('pointercancel',up);
    });
    el.querySelector('.nkw-chips').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||solved) return;
      if(b.dataset.k){ sel=sel===b.dataset.k?null:b.dataset.k; if(sel) act[paneOf(sel)]=sel; draw(); }
      else if(b.dataset.to){ if(!sel){ say('Primeiro toque numa aba.',false); return; } move(sel,b.dataset.to); } });
    el.querySelector('[data-rst]').onclick=()=>{ reset(); say(''); draw(); };
    el.querySelector('[data-chk]').onclick=()=>check(false);
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
    'a2-paineis':{tipo:'paineis', titulo:'Monte o workspace do Nuke', enunciado:'O workspace abriu bagunçado. Arraste as abas até deixar como na aula: o Viewer sozinho em cima, o Node Graph com o Curve Editor e o Dope Sheet embaixo, e o Properties com o Background Renders e o Scene Graph na coluna da direita.', ok:'Isso! Viewer para ver, Node Graph para trabalhar e Properties para ajustar. Os outros painéis ficam em abas junto deles.'},
    'a2-layout':{tipo:'prefs', titulo:'Deixe o Nuke trabalhável', enunciado:'Faça o que a aula mostra: troque para o Large Viewer e deixe ele como padrão ao abrir o Nuke.', ok:'Pronto! Agora o Nuke sempre abre no Large Viewer.'},
    'a2-mouse':{tipo:'atalho', titulo:'Cuidado com onde está o mouse', enunciado:'No Nuke, o mesmo atalho faz coisas diferentes conforme o painel em que está o mouse. Faça as duas tarefas.', ok:'Isso! Tab no Node Graph abre a busca de nodes; no Viewer, vai para o 3D. S no Node Graph abre o projeto; no Viewer, as configurações do Viewer.'},
    'a2-props':{tipo:'maxpaineis', titulo:'Um painel de propriedades por vez', enunciado:'O seu Properties está abrindo 10 painéis ao mesmo tempo. Deixe como a aula recomenda.'},
  };
  const list=FOS_PRATICA['aula-2']||[];
  list.forEach((x,i)=>{ const n=NOVOS[x.id]; if(n) list[i]=Object.assign({}, x, n, {opcoes:undefined, certo:undefined}); });
})();
