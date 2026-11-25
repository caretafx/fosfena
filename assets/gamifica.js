/* Fosfena · gamificação da área do aluno.
   - Sons bem baixinhos de acerto e erro (WebAudio, sem arquivo), com botão de mudo.
   - Comemoração no acerto (faíscas nas cores da marca) e "+XP" flutuando.
   - XP e níveis com nomes de VFX; cada coisa só dá XP uma vez (chave única), então refazer não rende XP de novo.
   API: FosGame.ok(el) · FosGame.no(el) · FosGame.award(chave, xp, el) · FosGame.sync([[chave,xp],...]) · FosGame.state()
   Guardado no navegador (localStorage "fosfena-xp-v1"); quando houver login de verdade, isso vai para o servidor. */
(function(){
  const KEY='fosfena-xp-v1', SOM='fosfena-som';
  const NIVEIS=[
    [0,'Roto Trainee'],[100,'Rotoscopista'],[250,'Paint & Cleanup'],[450,'Keyer'],[700,'Compositor Júnior'],
    [1000,'Compositor'],[1400,'Compositor Sênior'],[1900,'Lead Compositor'],[2500,'Supervisor de Comp'],[3200,'VFX Supervisor']];
  const RM=matchMedia('(prefers-reduced-motion: reduce)');
  const load=()=>{ try{ const v=JSON.parse(localStorage.getItem(KEY)); if(v&&v.got) return v; }catch(e){} return {xp:0,got:{}}; };
  const save=v=>{ try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} };
  let S=load();
  const muted=()=>{ try{ return localStorage.getItem(SOM)==='0'; }catch(e){ return false; } };
  const nivel=xp=>{ let i=0; NIVEIS.forEach((n,k)=>{ if(xp>=n[0]) i=k; }); const ini=NIVEIS[i][0], fim=NIVEIS[i+1]?NIVEIS[i+1][0]:null;
    return {n:i+1, nome:NIVEIS[i][1], ini, fim, pct: fim? (xp-ini)/(fim-ini) : 1}; };

  const css=`
.fos-lv{display:flex;flex-direction:column;gap:7px;padding-bottom:12px;margin-bottom:4px;border-bottom:1px solid var(--line)}
.lv-top{display:flex;align-items:center;gap:10px}
.lv-badge{width:34px;height:34px;border-radius:50%;flex:none;display:grid;place-items:center;font:700 13px var(--f-mono,monospace);color:#18191C;background:radial-gradient(circle at 35% 30%,#ffe2a8,#E0A84E 55%,#b9802c);box-shadow:0 0 0 2px rgba(224,168,78,.25),0 0 18px rgba(224,168,78,.35)}
.lv-nm{display:flex;flex-direction:column;min-width:0;line-height:1.2}
.lv-nm b{font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lv-nm span{font:11.5px var(--f-mono,monospace);color:var(--muted)}
.lv-som{margin-left:auto;width:26px;height:26px;border-radius:6px;display:grid;place-items:center;color:var(--muted);flex:none}
.lv-som:hover{color:var(--fg);background:var(--raise,rgba(255,255,255,.06))}
.lv-som svg{width:16px;height:16px}
.lv-bar{height:6px;border-radius:99px;background:var(--line);overflow:hidden}
.lv-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#9B6BFF,#E0A84E);transition:width .8s cubic-bezier(.2,.8,.2,1)}
.fos-lv.bump .lv-badge{animation:lvBump .7s cubic-bezier(.2,.8,.2,1)}
@keyframes lvBump{30%{transform:scale(1.25)}100%{transform:none}}
.lv-chip{display:none;align-items:center;gap:6px;padding:4px 9px 4px 4px;border-radius:99px;border:1px solid var(--line);font:600 12px var(--f-mono,monospace);color:var(--fg);white-space:nowrap}
.lv-chip i{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:11px;color:#18191C;background:#E0A84E}
@media (max-width:900px), (max-height:500px) and (max-width:1000px){.lv-chip{display:inline-flex;margin-left:auto}.lv-chip+.nav{margin-left:0}}
.fx-xp{position:fixed;z-index:9700;pointer-events:none;font:700 15px var(--f-mono,monospace);color:#E0A84E;text-shadow:0 0 12px rgba(224,168,78,.6);transform:translate(-50%,0);animation:fxXp 1.3s ease-out forwards}
@keyframes fxXp{0%{opacity:0;transform:translate(-50%,6px) scale(.8)}15%{opacity:1;transform:translate(-50%,0) scale(1.1)}100%{opacity:0;transform:translate(-50%,-46px) scale(1)}}
.fx-shake{animation:fxShake .38s}
@keyframes fxShake{20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
.fx-glow{animation:fxGlow 1s ease-out}
@keyframes fxGlow{0%{box-shadow:0 0 0 0 rgba(95,211,141,.55)}100%{box-shadow:0 0 0 18px rgba(95,211,141,0)}}
.lvup{position:fixed;inset:0;z-index:9800;display:grid;place-items:center;background:rgba(8,6,16,.55);backdrop-filter:blur(3px);animation:lvIn .3s ease-out;cursor:pointer;padding:16px}
.lvup .card{position:relative;text-align:center;padding:34px 40px 28px;border-radius:20px;border:1px solid rgba(224,168,78,.5);background:radial-gradient(circle at 50% 0%,rgba(224,168,78,.22),transparent 60%),#1b1626;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(155,107,255,.25);max-width:360px;width:100%;animation:lvPop .6s cubic-bezier(.2,1.4,.3,1)}
.lvup .big{width:84px;height:84px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;font:700 32px var(--f-mono,monospace);color:#18191C;background:radial-gradient(circle at 35% 30%,#ffe2a8,#E0A84E 55%,#b9802c);box-shadow:0 0 0 6px rgba(224,168,78,.18),0 0 50px rgba(224,168,78,.55)}
.lvup .eb{font:12px var(--f-mono,monospace);letter-spacing:.12em;text-transform:uppercase;color:#E0A84E}
.lvup h3{margin:6px 0 4px;font-size:24px}
.lvup p{margin:0;color:var(--muted);font-size:14px}
@keyframes lvIn{from{opacity:0}}
@keyframes lvPop{from{opacity:0;transform:scale(.7) translateY(20px)}}
.fx-burst{position:fixed;inset:0;z-index:9750;pointer-events:none}
@media (prefers-reduced-motion:reduce){.fx-xp{animation-duration:1.6s}.lvup .card{animation:none}.fos-lv.bump .lv-badge{animation:none}}
`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---------- sons (bem baixinhos) ---------- */
  let ac=null;
  function tone(freq, t0, dur, type, vol){
    const o=ac.createOscillator(), g=ac.createGain(); o.type=type; o.frequency.setValueAtTime(freq, ac.currentTime+t0);
    g.gain.setValueAtTime(0.0001, ac.currentTime+t0); g.gain.exponentialRampToValueAtTime(vol, ac.currentTime+t0+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+t0+dur);
    o.connect(g); g.connect(ac.destination); o.start(ac.currentTime+t0); o.stop(ac.currentTime+t0+dur+0.02); return o; }
  function play(kind){
    if(muted()) return;
    try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); }catch(e){ return; }
    if(kind==='ok'){ tone(880,0,.22,'sine',.045); tone(1318.5,.07,.32,'sine',.04); }
    else if(kind==='no'){ const o=tone(330,0,.22,'triangle',.04); o.frequency.exponentialRampToValueAtTime(220, ac.currentTime+.2); }
    else if(kind==='up'){ [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,i*.08,.4,'sine',.045)); tone(1568,.34,.6,'sine',.025); }
  }

  /* ---------- faíscas ---------- */
  function burst(x,y,n=46,spread=1){
    if(RM.matches) return;
    const c=document.createElement('canvas'); c.className='fx-burst'; const dpr=Math.min(2,devicePixelRatio||1);
    c.width=innerWidth*dpr; c.height=innerHeight*dpr; document.body.appendChild(c); const g=c.getContext('2d'); g.scale(dpr,dpr);
    const cols=['#E0A84E','#ffd58a','#ECEAE4','#9B6BFF','#5fd38d'];
    const ps=Array.from({length:n},()=>{ const a=Math.random()*Math.PI*2, v=(2.5+Math.random()*5.5)*spread;
      return {x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3*spread,r:1.5+Math.random()*2.6,c:cols[(Math.random()*cols.length)|0],life:0,max:55+Math.random()*35,rect:Math.random()<.45,rot:Math.random()*6}; });
    let f=0; const step=()=>{ g.clearRect(0,0,innerWidth,innerHeight); let alive=0;
      ps.forEach(p=>{ if(p.life>p.max) return; alive++; p.life++; p.vx*=.97; p.vy=p.vy*.97+.16; p.x+=p.vx; p.y+=p.vy; p.rot+=.2;
        const k=1-p.life/p.max; g.globalAlpha=Math.max(0,k); g.fillStyle=p.c;
        if(p.rect){ g.save(); g.translate(p.x,p.y); g.rotate(p.rot); g.fillRect(-p.r,-p.r*.5,p.r*2.2,p.r); g.restore(); }
        else { g.shadowBlur=8; g.shadowColor=p.c; g.beginPath(); g.arc(p.x,p.y,p.r*k+.4,0,7); g.fill(); g.shadowBlur=0; } });
      if(alive&&++f<160) requestAnimationFrame(step); else c.remove(); };
    requestAnimationFrame(step);
  }
  const center=el=>{ if(!el||!el.getBoundingClientRect) return {x:innerWidth/2,y:innerHeight/2}; const r=el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; };
  function floatXp(xp, el){ const p=center(el); const d=document.createElement('div'); d.className='fx-xp'; d.textContent=`+${xp} XP`; d.style.left=p.x+'px'; d.style.top=(p.y-28)+'px'; document.body.appendChild(d); setTimeout(()=>d.remove(),1400); }

  /* ---------- widget no "Seu progresso" ---------- */
  const SPK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const MUTE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  function paint(bump){
    const L=nivel(S.xp);
    let w=document.querySelector('.fos-lv');
    const foot=document.querySelector('.side-foot');
    if(!w&&foot){ w=document.createElement('div'); w.className='fos-lv'; const lbl=foot.querySelector('.lbl'); lbl?lbl.after(w):foot.prepend(w); }
    if(w){ w.innerHTML=`<div class="lv-top"><span class="lv-badge" title="Seu nível">${L.n}</span><span class="lv-nm"><b>${L.nome}</b><span>${L.fim?`${S.xp} / ${L.fim} XP`:`${S.xp} XP · máximo`}</span></span>
        <button type="button" class="lv-som" aria-label="${muted()?'Ligar':'Desligar'} os sons" title="${muted()?'Ligar':'Desligar'} os sons">${muted()?MUTE:SPK}</button></div>
        <div class="lv-bar" title="XP até o próximo nível"><i style="width:${(L.pct*100).toFixed(1)}%"></i></div>`;
      w.querySelector('.lv-som').onclick=()=>{ try{ localStorage.setItem(SOM, muted()?'1':'0'); }catch(e){} paint(); if(!muted()) play('ok'); };
      if(bump){ w.classList.remove('bump'); void w.offsetWidth; w.classList.add('bump'); } }
    let chip=document.querySelector('.lv-chip'); const nav=document.querySelector('.side .nav');
    if(!chip&&nav){ chip=document.createElement('a'); chip.className='lv-chip'; chip.href='#inicio'; nav.before(chip); }
    if(chip){ chip.innerHTML=`<i>${L.n}</i>${S.xp} XP`; chip.title=`Nível ${L.n} · ${L.nome}`; }
  }
  function levelUp(L){
    play('up');
    const o=document.createElement('div'); o.className='lvup'; o.setAttribute('role','dialog'); o.setAttribute('aria-label','Subiu de nível');
    o.innerHTML=`<div class="card"><div class="big">${L.n}</div><span class="eb">Subiu de nível</span><h3>${L.nome}</h3><p>${L.fim?`Próximo nível em ${L.fim-S.xp} XP.`:'Você chegou ao topo. Respeito.'}</p></div>`;
    document.body.appendChild(o);
    const p=center(o.querySelector('.big')); setTimeout(()=>{ burst(p.x,p.y,90,1.4); },120);
    const close=()=>{ o.remove(); removeEventListener('keydown',k); }; const k=e=>{ if(e.key==='Escape'||e.key==='Enter') close(); };
    o.onclick=close; addEventListener('keydown',k); setTimeout(close,3600);
  }
  function award(key, xp, el){
    if(!key||S.got[key]) return 0;
    const before=nivel(S.xp).n; S.got[key]=xp; S.xp+=xp; save(S);
    if(el) floatXp(xp, el);
    const L=nivel(S.xp); paint(true);
    if(L.n>before) setTimeout(()=>levelUp(L), el?650:0);
    return xp;
  }
  /* soma em silêncio o que o aluno já tinha feito antes da gamificação existir */
  function sync(list){ let ch=false; (list||[]).forEach(([k,x])=>{ if(k&&!S.got[k]){ S.got[k]=x; S.xp+=x; ch=true; } }); if(ch){ save(S); } paint(); }
  function ok(el){ play('ok'); const p=center(el); burst(p.x,p.y); const card=el&&el.closest&&el.closest('.px-card,.score,.q'); if(card&&!RM.matches){ card.classList.remove('fx-glow'); void card.offsetWidth; card.classList.add('fx-glow'); } }
  function no(el){ play('no'); if(el&&!RM.matches){ el.classList.remove('fx-shake'); void el.offsetWidth; el.classList.add('fx-shake'); } }

  window.FosGame={ ok, no, play, award, sync, burst, state:()=>({xp:S.xp, ...nivel(S.xp)}), NIVEIS, reset:()=>{ S={xp:0,got:{}}; save(S); paint(); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>paint()); else paint();
})();
