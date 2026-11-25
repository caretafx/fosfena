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
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 5h16v11H9l-5 4z"/></svg>',
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
      room.on(E.DataReceived,(payload, participant, kind, topic)=>{ if(topic!=='chat') return; try{ const m=JSON.parse(new TextDecoder().decode(payload)); addMsg({name:(participant&&(participant.name||participant.identity))||'?', text:String(m.text||'').slice(0,500), t:Date.now()}); }catch(e){} });
      room.on(E.Disconnected,()=>{ window.FosFluid&&FosFluid.pause(false); room=null; cur=null; els.clear(); paint(); onChange(); });
      await room.connect(LK.url, j.token);
      await room.startAudio().catch(()=>{});
      if(v.kind!=='live'){ await room.localParticipant.setMicrophoneEnabled(true).catch(()=>toast('Não consegui acessar o microfone. Libere a permissão no navegador.')); }
      paint(); onChange(); window.FosFluid&&FosFluid.pause(true);
    }catch(e){ room=null; cur=null; status(e.message==='lib'?'Não consegui carregar a voz. Recarregue a página.':'Não consegui entrar na sala agora. Tente de novo em instantes.', true); onChange(); }
  }
  async function leave(silent){ window.FosFluid&&FosFluid.pause(false); const r=room; room=null; cur=null; els.clear(); chatLog=[]; unread=0; if(r) await r.disconnect(); document.getElementById('lkAudio')?.replaceChildren(); if(!silent){ paint(); onChange(); } }

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
  /* chat de texto do canal de voz: vai pelo canal de dados do LiveKit, só para quem está na sala (não fica salvo) */
  let chatLog=[], unread=0, chatOpen=innerWidth>900;
  const linkify=t=>esc(t).replace(/https?:\/\/[^\s<]+/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  const hhmm=t=>new Date(t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  function addMsg(m){ chatLog.push(m); if(chatLog.length>200) chatLog.shift(); if(!chatOpen) unread++; drawChat(); paintBar(); }
  function drawChat(){ const box=host&&host.querySelector('#vmsgs'); if(!box) return;
    box.innerHTML=chatLog.length? chatLog.map(m=>`<div class="vm"><b style="color:${color(m.name)}">${esc(m.name)}</b><span>${hhmm(m.t)}</span><p>${linkify(m.text)}</p></div>`).join('') : '<p class="vmempty">As mensagens deste canal aparecem só para quem está na sala agora e somem quando todos saem. Bom para mandar links durante a conversa.</p>';
    box.scrollTop=box.scrollHeight; }
  async function sendMsg(text){ text=text.trim().slice(0,500); if(!text||!room) return;
    await room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify({text})),{reliable:true, topic:'chat'}).catch(()=>{});
    addMsg({name:(me&&me.name)||'Você', text, t:Date.now()}); }
  function setChat(open){ chatOpen=open; if(open) unread=0; if(host) host.classList.toggle('chatopen',open); paintBar(); if(open){ drawChat(); host&&host.querySelector('#vtxt')?.focus(); } }

  /* quadros reaproveitados por participante: falar só troca o contorno, nada é recriado nem reordenado */
  const tiles=new Map();
  function tile(x){
    const key=x.p.identity; let t=tiles.get(key);
    if(!t){ t=document.createElement('div'); t.dataset.k=key; t.innerHTML='<div class="vmedia"></div><span class="vname"></span>'; tiles.set(key,t); }
    t.className='vtile'+(x.speaking?' speaking':'')+(x.vid?' hasvid':'')+(x.scr?' scr':'')+(x.me&&!x.scr?' mirror':'');
    const media=t.firstChild, want=x.vid?x.vid.sid:'av:'+x.name;
    if(media.dataset.w!==want){ media.dataset.w=want; media.replaceChildren();
      if(x.vid){ let el=els.get(x.vid.sid); if(!el){ el=x.vid.attach(); el.muted=true; el.playsInline=true; els.set(x.vid.sid,el); } media.append(el); }
      else media.innerHTML=`<span class="vav" style="background:${color(x.name)}">${esc(x.name.charAt(0).toUpperCase())}</span>`; }
    const nm=`${x.mic?'':IC.micOff}${esc(x.name)}${x.me?' (você)':''}`; const lab=t.lastChild; if(lab.innerHTML!==nm) lab.innerHTML=nm;
    return t;
  }

  /* grade estilo Discord: quadros 16:9 do maior tamanho que caiba, centralizados */
  let lastFit='', lastCols=0, lastN=0;
  function fit(stage, force){
    const n=stage.querySelectorAll('.vtile').length; if(!n) return;
    const sig=[n, stage.clientWidth, stage.clientHeight, !!stage.querySelector('.vtile.scr'), !!stage.querySelector('.vwait')].join();
    if(sig===lastFit && !force) return; lastFit=sig;
    const cs=getComputedStyle(stage), pad=parseFloat(cs.getPropertyValue('--pad'))||16, gap=parseFloat(cs.columnGap)||12;
    const W=stage.clientWidth-2*pad-1;
    const H=stage.clientHeight-2*pad-(stage.querySelector('.vwait')?40:0)-1;
    const scr=stage.querySelector('.vtile.scr');
    if(scr){ const others=n-1, strip=others?Math.min(170,Math.max(110,H*0.2)):0, sw=Math.floor(strip*16/9);
      stage.classList.add('focus'); stage.style.setProperty('--sw', sw+'px');
      stage.style.setProperty('--tw', Math.floor(Math.min(W, (H-(others?strip+gap:0))*16/9))+'px'); return; }
    stage.classList.remove('focus');
    /* grade estilo Discord: testa todas as combinações de colunas e escolhe a que deixa os quadros 16:9 maiores,
       preferindo lado a lado em área larga e empilhado em área alta (penalidade de 25% para a orientação contrária) */
    const size=c=>{ const r=Math.ceil(n/c); return Math.floor(Math.min((W-gap*(c-1))/c, ((H-gap*(r-1))/r)*16/9))-2; };
    const score=c=>{ const r=Math.ceil(n/c); return size(c)*(n>1&&(c>=r)!==(W>=H)&&c!==r?0.75:1)*(1-0.02*Math.abs(c-r)); }; // e, no empate, a grade mais quadrada
    let bc=1; for(let c=2;c<=n;c++) if(score(c)>score(bc)) bc=c;
    if(lastN===n&&lastCols&&lastCols<=n&&bc!==lastCols&&score(bc)<score(lastCols)*1.08) bc=lastCols; // histerese só ao redimensionar
    lastCols=bc; lastN=n;
    const tw=Math.max(96,size(bc)), gw=bc*tw+gap*(bc-1);
    stage.style.setProperty('--tw', tw+'px');
    stage.style.setProperty('--px', Math.max(0,Math.floor((W-gw)/2))+'px'); // trava a quebra de linha exatamente em bc colunas
  }
  /* desenha a tela do canal de voz dentro de vbox */
  function show(v, vbox, who){
    host=vbox; me=who; vbox.classList.remove('incall','chatopen');
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
    vbox.innerHTML=`<div class="vmain"><div class="vstage" id="vstage"></div><div class="vbar" id="vbar"></div></div>
      <aside class="vchat" aria-label="Chat do canal"><header><b>Chat do canal</b><button class="vx" id="vchatx" aria-label="Fechar chat">×</button></header><div class="vmsgs" id="vmsgs" aria-live="polite"></div>
      <form class="vform" id="vform"><input id="vtxt" maxlength="500" autocomplete="off" placeholder="Mensagem para o canal"><button class="btn btn-primary">Enviar</button></form></aside>`;
    vbox.classList.toggle('chatopen',chatOpen);
    vbox.querySelector('#vform').onsubmit=e=>{ e.preventDefault(); const i=vbox.querySelector('#vtxt'); sendMsg(i.value); i.value=''; };
    vbox.querySelector('#vchatx').onclick=()=>setChat(false);
    drawChat();
    const st=vbox.querySelector('#vstage'); if(window.ResizeObserver) new ResizeObserver(()=>fit(st)).observe(st); lastFit=''; lastCols=0; tiles.clear();
    paint();
  }
  function paint(){
    if(!host || !document.body.contains(host)) return;
    const stage=host.querySelector('#vstage'), bar=host.querySelector('#vbar'); if(!stage||!bar||!room) return;
    const ps=people(), live=cur&&cur.kind==='live', lp=room.localParticipant, canPub=lp.permissions?lp.permissions.canPublish!==false:true;
    const withVid=ps.filter(x=>x.vid);
    const order=[...ps.filter(x=>x.scr), ...ps.filter(x=>!x.scr)].map(tile);
    const ids=new Set(ps.map(x=>x.p.identity)); for(const k of [...tiles.keys()]) if(!ids.has(k)) tiles.delete(k);
    const waitTxt= live && !withVid.length ? (canPub?'Ligue a câmera ou compartilhe a tela para começar a live.':'A live ainda não começou. Fique por aqui.') : '';
    let w=stage.querySelector('.vwait');
    if(waitTxt&&!w){ w=document.createElement('p'); w.className='vwait'; } if(w) w.textContent=waitTxt;
    const want=waitTxt?[w,...order]:order, have=[...stage.children];
    if(want.length!==have.length||want.some((e,i)=>e!==have[i])) stage.replaceChildren(...want);
    fit(stage);
    const btn=(id,ic,lbl,on,cls='')=>`<button class="vbtn ${on?'on':''} ${cls}" id="${id}" title="${lbl}" aria-label="${lbl}" aria-pressed="${!!on}">${ic}<span>${lbl}</span></button>`;
    bar.innerHTML=(canPub?btn('vmic',lp.isMicrophoneEnabled?IC.mic:IC.micOff,lp.isMicrophoneEnabled?'Microfone':'Mudo',lp.isMicrophoneEnabled)
      +btn('vcam',IC.cam,'Câmera',lp.isCameraEnabled)+btn('vscr',IC.screen,'Tela',lp.isScreenShareEnabled):'')
      +(document.fullscreenEnabled?btn('vfull',IC.full,'Tela cheia',!!document.fullscreenElement):'')
      +btn('vchatb',IC.chat+(unread?`<em class="vbadge">${unread>9?'9+':unread}</em>`:''),'Chat',chatOpen)
      +btn('vout',IC.leave,'Sair',false,'red');
    const g=id=>bar.querySelector('#'+id);
    if(g('vmic')) g('vmic').onclick=()=>lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled).then(paint).catch(()=>toast('Não consegui acessar o microfone.'));
    if(g('vcam')) g('vcam').onclick=()=>lp.setCameraEnabled(!lp.isCameraEnabled).then(paint).catch(()=>toast('Não consegui acessar a câmera.'));
    if(g('vscr')) g('vscr').onclick=()=>lp.setScreenShareEnabled(!lp.isScreenShareEnabled,{audio:true}).then(paint).catch(()=>{});
    if(g('vfull')) g('vfull').onclick=()=>{ (document.fullscreenElement?document.exitFullscreen():host.requestFullscreen()).catch(()=>{}).then(paint); };
    g('vchatb').onclick=()=>setChat(!chatOpen);
    g('vout').onclick=()=>{ const v=cur; leave().then(()=>{ if(v&&host) show(v,host,me); }); };
  }

  document.addEventListener('fullscreenchange',()=>paint());
  addEventListener('beforeunload',()=>{ if(room) room.disconnect(); });
  if(!document.getElementById('lkAudio')){ const d=document.createElement('div'); d.id='lkAudio'; d.hidden=true; document.body.append(d); }

    function paintBar(){ const b=host&&host.querySelector('#vchatb'); if(!b) return; b.classList.toggle('on',chatOpen); b.setAttribute('aria-pressed',chatOpen); const e=b.querySelector('.vbadge'); if(unread&&!chatOpen){ if(e) e.textContent=unread>9?'9+':unread; else b.insertAdjacentHTML('afterbegin',`<em class="vbadge">${unread>9?'9+':unread}</em>`); } else if(e) e.remove(); }

  /* quem está em cada sala, para a lista de canais (consulta o Worker a cada 6 s enquanto a Comunidade está aberta) */
  let roster={}, onRoster=()=>{}, rosterT=null;
  async function pollRoster(){ clearTimeout(rosterT);
    if(!document.querySelector('.vwho')){ rosterT=null; return; }
    if(!document.hidden&&LK.tokenUrl){ try{ const r=await fetch(LK.tokenUrl.replace(/\/$/,'')+'/?list=1'); if(r.ok){ const j=await r.json(); if(j.rooms){ roster=j.rooms; onRoster(); } } }catch(e){} }
    rosterT=setTimeout(pollRoster,6000); }
  window.FosfenaVoz={ watch:()=>{ if(!rosterT) pollRoster(); }, roster:room=>roster[room]||[], onRoster:f=>{onRoster=f;}, show, leave, ready:()=>!!LK.tokenUrl, current:()=>cur, people:()=>people().map(x=>({name:x.name,speaking:x.speaking,mic:x.mic})), onChange:f=>{onChange=f;} };
})();
