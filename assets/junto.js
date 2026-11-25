/* Fosfena · Assistir junto: quem está no mesmo canal de voz assiste à mesma videoaula sincronizada.
   Play, pause e pulos de qualquer um valem para todos. Vai pelo canal de dados do LiveKit (tópico "wt"), sem servidor extra. */
(function(){
  const V=()=>window.FosfenaVoz;
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const toast=m=>(window.toast||alert)(m);
  let S=null, invite=null;              // S: sessão ativa nesta aula
  const send=o=>V()&&V().send('wt',Object.assign({by:V().name()},o));
  const P=()=>S&&S.ctl.pl();

  function local(){ const p=P(); if(!p||!p.getPlayerState) return null; const st=p.getPlayerState(); return {t:p.getCurrentTime()||0, playing:st===1||st===3}; }
  function broadcast(){ const L=local(); if(!L) return; send({type:'state', lesson:S.lesson, t:L.t, playing:L.playing}); }
  function apply(m){
    if(!S||m.lesson!==S.lesson) return;
    const p=P(); if(!p||!S.ctl.ready()){ S.pending=m; return; }
    S.ctl.skipVin(); S.quiet=Date.now()+1200;
    const target=m.t+(m.playing?.15:0);
    if(Math.abs((p.getCurrentTime()||0)-target)>.8) p.seekTo(target,true);
    if(m.playing){ p.playVideo(); setTimeout(()=>{ if(S&&p.getPlayerState&&p.getPlayerState()!==1&&p.getPlayerState()!==3){ p.mute(); p.playVideo(); S.muted=true; draw(); } },1500); }
    else p.pauseVideo();
    S.prev=null;
  }
  /* olha o player 3 vezes por segundo: se a pessoa deu play, pausou ou pulou, avisa os outros */
  function watch(){
    if(!S) return; const L=local(), now=performance.now();
    if(L&&Date.now()>S.quiet){
      if(S.prev){ const exp=S.prev.t+(S.prev.playing?(now-S.prev.w)/1000*(P().getPlaybackRate?P().getPlaybackRate():1):0);
        if(L.playing!==S.prev.playing||Math.abs(L.t-exp)>1.3) broadcast(); }
    }
    if(L) S.prev={t:L.t, playing:L.playing, w:now};
    if(S.pending&&S.ctl.ready()){ const m=S.pending; S.pending=null; apply(m); }
    for(const [n,t] of S.people) if(Date.now()-t>14000) S.people.delete(n);
    if(++S.n%15===0){ send({type:'ping', lesson:S.lesson}); draw(); }
  }
  function start(){
    if(!S) return;
    if(!V()||!V().current()){ toast('Para assistir junto, entre primeiro num canal de voz da Comunidade com a turma.'); return; }
    S.on=true; S.people=new Map(); S.quiet=0; S.n=0; S.prev=null;
    send({type:'invite', lesson:S.lesson, title:S.title}); send({type:'hello', lesson:S.lesson});
    clearInterval(S.timer); S.timer=setInterval(watch,330); draw();
  }
  function stop(silent){ if(!S||!S.on) return; clearInterval(S.timer); S.on=false; if(!silent) send({type:'bye', lesson:S.lesson}); draw(); }

  function draw(){
    const slot=document.getElementById('wtSlot'); if(!slot||!S) return;
    if(!S.on){ slot.innerHTML=`<button class="btn btn-ghost wt-btn" id="wtGo" title="Assistir esta aula junto com quem está no seu canal de voz"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M10 8.5v5l4.5-2.5z" fill="currentColor"/><path d="M7 21h10"/></svg>Assistir junto</button>`;
      slot.querySelector('#wtGo').onclick=start; return; }
    const names=[...S.people.keys()];
    slot.innerHTML=`<div class="wt-on"><span class="wt-dot"></span><span>Assistindo junto${names.length?' com '+esc(names.slice(0,3).join(', '))+(names.length>3?` e mais ${names.length-3}`:''):' · esperando a turma'}</span>${S.muted?'<button id="wtSnd">Ativar som</button>':''}<button id="wtOut">Sair</button></div>`;
    slot.querySelector('#wtOut').onclick=()=>stop();
    const snd=slot.querySelector('#wtSnd'); if(snd) snd.onclick=()=>{ const p=P(); p&&p.unMute(); S.muted=false; draw(); };
  }
  function drawInvite(){
    let el=document.getElementById('wtInv');
    if(!invite||(S&&S.on&&S.lesson===invite.lesson)){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement('div'); el.id='wtInv'; el.className='wt-inv'; document.body.append(el); }
    el.innerHTML=`<p style="margin:0"><b>${esc(invite.by)}</b> chamou para assistir junto</p><span>${esc(invite.title||'uma aula')}</span><div><button class="btn btn-primary" id="wtIr">Ir junto</button><button class="btn btn-ghost" id="wtNo">Agora não</button></div>`;
    el.querySelector('#wtIr').onclick=()=>{ try{ sessionStorage.setItem('wtJoin',invite.lesson); }catch(e){} const id=invite.lesson; invite=null; drawInvite(); if(location.hash==='#'+id) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash='#'+id; };
    el.querySelector('#wtNo').onclick=()=>{ invite=null; drawInvite(); };
  }

  function onData(m, from){
    if(!m||!m.lesson) return;
    const mine=S&&S.on&&m.lesson===S.lesson;
    if(m.type==='invite'&&!mine){ invite={lesson:m.lesson, title:m.title, by:m.by||from}; drawInvite(); }
    if(!mine) return;
    if(m.type==='bye'){ S.people.delete(m.by||from); draw(); return; }
    const who=m.by||from, isNew=!S.people.has(who); S.people.set(who, Date.now()); if(isNew) draw();
    if(m.type==='hello'){ const L=local(); if(L&&(L.t>1||L.playing)) broadcast(); draw(); }
    if(m.type==='state') apply(m);
    if(m.type==='ping'||m.type==='invite') draw();
  }
  function hook(){ if(V()&&!hook.done){ hook.done=true; V().onData('wt',onData); } }

  window.FosJunto={
    /* chamado pela página da aula quando o player do YouTube é criado */
    bind(lesson, title, ctl){
      hook(); if(S&&S.on&&S.lesson!==lesson) stop();
      S={lesson, title, ctl, on:false, people:new Map()};
      let auto=false; try{ auto=sessionStorage.getItem('wtJoin')===lesson; if(auto) sessionStorage.removeItem('wtJoin'); }catch(e){}
      if(auto) start(); else draw();
      if(invite&&invite.lesson===lesson){ invite=null; drawInvite(); }
    },
    unbind(){ if(S){ stop(); S=null; } },
  };
  hook();
})();
