/* Fosfena · canais de voz e live dentro da Comunidade (LiveKit Cloud).
   O token vem do Worker da Cloudflare (livekit/token-worker.js); o segredo nunca fica no site.
   Enquanto LK.tokenUrl estiver vazio, a tela de voz explica que falta ligar o servidor. */
(function(){
  const LK = {
    url: 'wss://fosfena-0k1hsnkn.livekit.cloud',
    tokenUrl: 'https://fosfena-livekit.maumau-c-rod.workers.dev',
    lib: 'assets/vendor/livekit-client-2.23.0.umd.js',
  };
  let room=null, cur=null, me=null, els=new Map(), host=null, onChange=()=>{};

  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const COLS=['#FFB547','#9B6BFF','#5CC8FF','#ff7fb0','#7be0a5','#f6d36b'];
  const color=n=>{ let h=0; for(const c of String(n)) h=(h*31+c.charCodeAt(0))|0; return COLS[Math.abs(h)%COLS.length]; };
  const IC={
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    micOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M9 9V6a3 3 0 0 1 5.8-1M15 10v1a3 3 0 0 1-4.6 2.5M5 11a7 7 0 0 0 11.2 5.6M19 11a7 7 0 0 1-.6 2.8M12 18v3M3 3l18 18"/></svg>',
    cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/></svg>',
    screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    full:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    leave:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 15c5-5 13-5 18 0l-2.5 2.5-3-1.5v-3a10 10 0 0 0-5 0v3l-3 1.5z"/></svg>',
  };

  function loadLib(){ return window.LivekitClient ? Promise.resolve() : new Promise((ok,err)=>{ const s=document.createElement('script'); s.src=LK.lib; s.onload=ok; s.onerror=()=>err(new Error('lib')); document.head.append(s); }); }

  async function join(v, who){
    if(room && cur && cur.id===v.id) return;
    if(room) await leave(true);
    cur=v; me=who; status('Conectando…');
    try{
      await loadLib();
      const q=new URLSearchParams({room:v.room, name:who.name}); if(who.admin) q.set('host','1');
      const r=await fetch(LK.tokenUrl.replace(/\/$/,'')+'/?'+q); const j=await r.json(); if(!r.ok||!j.token) throw new Error(j.error||'token');
      const L=window.LivekitClient, E=L.RoomEvent;
      room=new L.Room({adaptiveStream:true, dynacast:true});
      ['ParticipantConnected','ParticipantDisconnected','TrackSubscribed','TrackUnsubscribed','TrackMuted','TrackUnmuted','LocalTrackPublished','LocalTrackUnpublished','ActiveSpeakersChanged','ConnectionStateChanged'].forEach(k=>room.on(E[k],()=>{ paint(); onChange(); }));
      room.on(E.TrackSubscribed,(track)=>{ if(track.kind==='audio'){ const a=track.attach(); a.dataset.sid=track.sid; document.getElementById('lkAudio').append(a); } });
      room.on(E.TrackUnsubscribed,(track)=>{ track.detach().forEach(x=>x.remove()); els.delete(track.sid); });
      room.on(E.Disconnected,()=>{ room=null; cur=null; els.clear(); paint(); onChange(); });
      await room.connect(LK.url, j.token);
      await room.startAudio().catch(()=>{});
      if(v.kind!=='live'){ await room.localParticipant.setMicrophoneEnabled(true).catch(()=>toast('Não consegui acessar o microfone. Libere a permissão no navegador.')); }
      paint(); onChange();
    }catch(e){ room=null; cur=null; status(e.message==='lib'?'Não consegui carregar a voz. Recarregue a página.':'Não consegui entrar na sala agora. Tente de novo em instantes.', true); onChange(); }
  }
  async function leave(silent){ const r=room; room=null; cur=null; els.clear(); if(r) await r.disconnect(); document.getElementById('lkAudio')?.replaceChildren(); if(!silent){ paint(); onChange(); } }

  function toast(m){ (window.toast||alert)(m); }
  function status(m, err){ if(!host) return; const s=host.querySelector('.vstatus'); if(s){ s.textContent=m; s.classList.toggle('err',!!err); } }

  function people(){
    if(!room) return [];
    const L=window.LivekitClient, S=L.Track.Source;
    return [room.localParticipant, ...room.remoteParticipants.values()].map(p=>{
      const scr=p.getTrackPublication(S.ScreenShare), cam=p.getTrackPublication(S.Camera);
      const isScr=!!(scr&&scr.track&&!scr.isMuted);
      const vid=isScr?scr.track:(cam&&cam.track&&!cam.isMuted)?cam.track:null;
      return {p, name:p.name||p.identity, me:p===room.localParticipant, speaking:p.isSpeaking, mic:p.isMicrophoneEnabled, vid, scr:isScr};
    });
  }
  function tile(x){
    const t=document.createElement('div'); t.className='vtile'+(x.speaking?' speaking':'')+(x.vid?' hasvid':'')+(x.scr?' scr':'')+(x.me&&!x.scr?' mirror':'');
    if(x.vid){ let el=els.get(x.vid.sid); if(!el){ el=x.vid.attach(); el.muted=true; el.playsInline=true; els.set(x.vid.sid,el); } t.append(el); }
    else t.insertAdjacentHTML('beforeend',`<span class="vav" style="background:${color(x.name)}">${esc(x.name.charAt(0).toUpperCase())}</span>`);
    t.insertAdjacentHTML('beforeend',`<span class="vname">${x.mic?'':IC.micOff}${esc(x.name)}${x.me?' (você)':''}</span>`);
    return t;
  }

  /* grade estilo Discord: quadros 16:9 do maior tamanho que caiba, centralizados */
  function fit(stage){
    const n=stage.querySelectorAll('.vtile').length; if(!n) return;
    const cs=getComputedStyle(stage), gap=12;
    const W=stage.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-1;
    const H=stage.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-(stage.querySelector('.vwait')?40:0)-1;
    const scr=stage.querySelector('.vtile.scr');
    if(scr){ const others=n-1, strip=others?Math.min(170,Math.max(110,H*0.2)):0, sw=Math.floor(strip*16/9);
      stage.classList.add('focus'); stage.style.setProperty('--sw', sw+'px');
      stage.style.setProperty('--tw', Math.floor(Math.min(W, (H-(others?strip+gap:0))*16/9))+'px'); return; }
    stage.classList.remove('focus');
    let best=160;
    for(let c=1;c<=n;c++){ const r=Math.ceil(n/c); const w=Math.min((W-gap*(c-1))/c, ((H-gap*(r-1))/r)*16/9); if(w>best) best=w; }
    stage.style.setProperty('--tw', Math.floor(best)+'px');
  }
  /* desenha a tela do canal de voz dentro de vbox */
  function show(v, vbox, who){
    host=vbox; me=who; vbox.classList.remove('incall');
    const live=v.kind==='live';
    if(!LK.tokenUrl){
      vbox.innerHTML=`<div class="vempty"><span class="vring ${live?'live':''}">${live?IC.screen:IC.mic}</span><h2>${esc(v.name)}</h2><p>${esc(v.desc)}</p>
        <p class="vnote">A voz e as lives desta página estão quase prontas: falta só ligar o servidor de chaves do LiveKit. Assim que ele estiver no ar, é só clicar e falar, sem abrir outra aba.</p>
        ${who.fallback&&!live?'<button class="btn btn-ghost" id="vfb">Usar a sala provisória (abre outra aba)</button>':''}</div>`;
      const fb=vbox.querySelector('#vfb'); if(fb) fb.onclick=()=>who.fallback(v);
      return;
    }
    if(!room || !cur || cur.id!==v.id){
      const canHost=live&&who.admin;
      vbox.innerHTML=`<div class="vempty"><span class="vring ${live?'live':''}">${live?IC.screen:IC.mic}</span><h2>${esc(v.name)}</h2><p>${esc(v.desc)}</p>
        <button class="btn btn-primary" id="vgo">${live?(canHost?'Abrir a live':'Assistir à live'):'Entrar no canal'}</button>
        <p class="vstatus"></p>
        <p class="vhint">${live?(canHost?'Você entra como apresentador: ligue a câmera ou compartilhe a tela.':'Você assiste e ouve. Para perguntar, use o chat de texto.'):'Use fone de ouvido para não dar eco. Na primeira vez, o navegador pede permissão para o microfone.'}</p></div>`;
      vbox.querySelector('#vgo').onclick=()=>join(v, who).then(()=>{ if(host===vbox) show(v,vbox,who); });
      return;
    }
    vbox.classList.add('incall');
    vbox.innerHTML=`<div class="vstage" id="vstage"></div><div class="vbar" id="vbar"></div>`;
    const st=vbox.querySelector('#vstage'); if(window.ResizeObserver) new ResizeObserver(()=>fit(st)).observe(st);
    paint();
  }
  function paint(){
    if(!host || !document.body.contains(host)) return;
    const stage=host.querySelector('#vstage'), bar=host.querySelector('#vbar'); if(!stage||!bar||!room) return;
    const ps=people(), live=cur&&cur.kind==='live', lp=room.localParticipant, canPub=lp.permissions?lp.permissions.canPublish!==false:true;
    const withVid=ps.filter(x=>x.vid);
    stage.className='vstage';
    stage.replaceChildren(...[...ps.filter(x=>x.scr), ...ps.filter(x=>x.vid&&!x.scr), ...ps.filter(x=>!x.vid)].map(tile));
    if(live && !withVid.length){ stage.insertAdjacentHTML('afterbegin',`<p class="vwait">${canPub?'Ligue a câmera ou compartilhe a tela para começar a live.':'A live ainda não começou. Fique por aqui.'}</p>`); }
    fit(stage);
    const btn=(id,ic,lbl,on,cls='')=>`<button class="vbtn ${on?'on':''} ${cls}" id="${id}" title="${lbl}" aria-label="${lbl}" aria-pressed="${!!on}">${ic}<span>${lbl}</span></button>`;
    bar.innerHTML=(canPub?btn('vmic',lp.isMicrophoneEnabled?IC.mic:IC.micOff,lp.isMicrophoneEnabled?'Microfone':'Mudo',lp.isMicrophoneEnabled)
      +btn('vcam',IC.cam,'Câmera',lp.isCameraEnabled)+btn('vscr',IC.screen,'Tela',lp.isScreenShareEnabled):'')
      +(document.fullscreenEnabled?btn('vfull',IC.full,'Tela cheia',!!document.fullscreenElement):'')
      +btn('vout',IC.leave,'Sair',false,'red');
    const g=id=>bar.querySelector('#'+id);
    if(g('vmic')) g('vmic').onclick=()=>lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled).then(paint).catch(()=>toast('Não consegui acessar o microfone.'));
    if(g('vcam')) g('vcam').onclick=()=>lp.setCameraEnabled(!lp.isCameraEnabled).then(paint).catch(()=>toast('Não consegui acessar a câmera.'));
    if(g('vscr')) g('vscr').onclick=()=>lp.setScreenShareEnabled(!lp.isScreenShareEnabled,{audio:true}).then(paint).catch(()=>{});
    if(g('vfull')) g('vfull').onclick=()=>{ (document.fullscreenElement?document.exitFullscreen():host.requestFullscreen()).catch(()=>{}).then(paint); };
    g('vout').onclick=()=>{ const v=cur; leave().then(()=>{ if(v&&host) show(v,host,me); }); };
  }

  document.addEventListener('fullscreenchange',()=>paint());
  addEventListener('beforeunload',()=>{ if(room) room.disconnect(); });
  if(!document.getElementById('lkAudio')){ const d=document.createElement('div'); d.id='lkAudio'; d.hidden=true; document.body.append(d); }

  window.FosfenaVoz={ show, leave, ready:()=>!!LK.tokenUrl, current:()=>cur, people:()=>people().map(x=>({name:x.name,speaking:x.speaking,mic:x.mic})), onChange:f=>{onChange=f;} };
})();
