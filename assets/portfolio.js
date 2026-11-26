/* vfxstudio · Portfólio do aluno (trabalhos do projetão + feedback do professor em vídeo).
   API pública: window.FosPort. As telas (aluno.html e admin.html) só falam com ela.

   CAMADA DE DADOS (troca fácil):
   - Modo prévia (padrão): tudo no IndexedDB "fosfena-portfolio" deste navegador, com os vídeos guardados como Blob.
   - Backend: defina window.FOS_API = 'https://…/api' ANTES deste script e o adaptador Api abaixo passa a valer.
     Contrato esperado (pensado para um Worker na Cloudflare com D1 nos dados e R2 nos arquivos):
       GET    {api}/portfolio              → [trabalho]   (o Worker filtra pelo login: aluno vê os dele + a vitrine; professor vê todos)
       GET    {api}/portfolio/:id          → trabalho
       PUT    {api}/portfolio/:id          ← trabalho em JSON (sem Blob: arquivos já vêm como {url,name,type,size})
       DELETE {api}/portfolio/:id
       POST   {api}/upload  (multipart: file)  → {url}      (grava no R2 e devolve a URL pública ou assinada)
   As telas nunca mexem em Blob direto: usam FosPort.url(arquivo), que serve tanto Blob (prévia) quanto url (backend).

   Formato de um trabalho:
   { id, aluno, curso:'nuke'|'flame', etapa:{id,titulo}, titulo, descricao, capa:dataURL, criado,
     vitrine:bool (o aluno autoriza aparecer na vitrine), destaque:bool (o professor escolhe), destaqueNota, destaqueVersao:n,
     versoes:[{n, arquivo:{name,type,size,blob|url}, nota, data, capa}],
     feedbacks:[{id, versao, data, video:{…}|null, texto, marcas:[{t, texto, desenho:dataURL|null}], visto:bool}] } */
(function(){
  const DB='fosfena-portfolio', ST='trabalhos';
  const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  const now=()=>new Date().toISOString();

  /* ---------- adaptador 1: IndexedDB (prévia) ---------- */
  function Local(){
    let dbp=null;
    const db=()=>dbp||(dbp=new Promise((ok,ko)=>{ const r=indexedDB.open(DB,1); r.onupgradeneeded=()=>r.result.createObjectStore(ST,{keyPath:'id'}); r.onsuccess=()=>ok(r.result); r.onerror=()=>ko(r.error); }));
    const rq=r=>new Promise((ok,ko)=>{ r.onsuccess=()=>ok(r.result); r.onerror=()=>ko(r.error); });
    const tx=(mode,fn)=>db().then(d=>new Promise((ok,ko)=>{ const t=d.transaction(ST,mode); const out=fn(t.objectStore(ST)); t.oncomplete=()=>ok(out); t.onerror=()=>ko(t.error); t.onabort=()=>ko(t.error); }));
    return {
      async list(){ try{ const d=await db(); return await rq(d.transaction(ST).objectStore(ST).getAll()); }catch(e){ return []; } },
      async get(id){ const d=await db(); return rq(d.transaction(ST).objectStore(ST).get(id)); },
      put:t=>tx('readwrite',s=>{ s.put(t); return t; }),
      del:id=>tx('readwrite',s=>{ s.delete(id); }),
      async arquivo(f){ return {name:f.name||'video.webm', type:f.type||'', size:f.size||0, blob:f}; }
    };
  }
  /* ---------- adaptador 2: backend (Cloudflare Worker + D1 + R2) ---------- */
  function Api(base){
    const j=async(r)=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.status===204?null:r.json(); };
    const opt={credentials:'include'};
    return {
      list:()=>fetch(base+'/portfolio',opt).then(j),
      get:id=>fetch(base+'/portfolio/'+encodeURIComponent(id),opt).then(j),
      put:t=>fetch(base+'/portfolio/'+encodeURIComponent(t.id),{...opt,method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(t)}).then(j).then(()=>t),
      del:id=>fetch(base+'/portfolio/'+encodeURIComponent(id),{...opt,method:'DELETE'}).then(j),
      async arquivo(f){ const fd=new FormData(); fd.append('file',f,f.name||'video.webm'); const r=await fetch(base+'/upload',{...opt,method:'POST',body:fd}).then(j); return {name:f.name||'video.webm', type:f.type||'', size:f.size||0, url:r.url}; }
    };
  }
  const S = window.FOS_API ? Api(String(window.FOS_API).replace(/\/$/,'')) : Local();

  /* ---------- utilidades ---------- */
  const urls=new WeakMap();
  function url(a){ if(!a) return ''; if(a.url) return a.url; if(!a.blob) return ''; let u=urls.get(a.blob); if(!u){ u=URL.createObjectURL(a.blob); urls.set(a.blob,u); } return u; }
  const tc=s=>{ s=Math.max(0,Math.floor(s||0)); const m=Math.floor(s/60), x=s%60; return m+':'+String(x).padStart(2,'0'); };
  const ultima=t=>t.versoes[t.versoes.length-1];
  /* status calculado: a última versão já tem feedback? */
  function status(t){ const v=ultima(t).n; return t.feedbacks.some(f=>f.versao===v)?'com-feedback':'aguardando'; }
  const novos=t=>t.feedbacks.filter(f=>!f.visto).length;
  /* capa: um frame do vídeo (ou a própria imagem), reduzido para 480px */
  function capa(file){ return new Promise(ok=>{
    const fim=(src,w,h)=>{ try{ const k=Math.min(1,480/w), c=document.createElement('canvas'); c.width=Math.round(w*k); c.height=Math.round(h*k); c.getContext('2d').drawImage(src,0,0,c.width,c.height); ok(c.toDataURL('image/jpeg',.78)); }catch(e){ ok(''); } };
    const u=URL.createObjectURL(file), done=v=>{ URL.revokeObjectURL(u); ok(v); };
    if((file.type||'').startsWith('image/')){ const i=new Image(); i.onload=()=>{ fim(i,i.naturalWidth,i.naturalHeight); URL.revokeObjectURL(u); }; i.onerror=()=>done(''); i.src=u; return; }
    const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.preload='auto'; v.src=u;
    const tmo=setTimeout(()=>done(''),8000);
    v.onloadedmetadata=()=>{ v.currentTime=Math.min(1, (v.duration||2)/3); };
    v.onseeked=()=>{ clearTimeout(tmo); fim(v,v.videoWidth||16,v.videoHeight||9); URL.revokeObjectURL(u); };
    v.onerror=()=>{ clearTimeout(tmo); done(''); };
  }); }
  const sort=l=>l.sort((a,b)=>(ultima(b).data).localeCompare(ultima(a).data));

  /* ---------- gravação do feedback (tela desta aba + microfone) ---------- */
  function mimeOk(){ return ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||''; }
  async function gravar({mic=true}={}){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia||!window.MediaRecorder) throw new Error('sem-suporte');
    const tela=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30}, audio:true, preferCurrentTab:true, selfBrowserSurface:'include', surfaceSwitching:'exclude'});
    let voz=null; if(mic){ try{ voz=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}}); }catch(e){} }
    const ac=new (window.AudioContext||window.webkitAudioContext)(), dest=ac.createMediaStreamDestination();
    [tela,voz].forEach(s=>{ if(s&&s.getAudioTracks().length) ac.createMediaStreamSource(s).connect(dest); });
    const stream=new MediaStream([...tela.getVideoTracks(), ...dest.stream.getAudioTracks()]);
    const mimeType=mimeOk(), rec=new MediaRecorder(stream, mimeType?{mimeType, videoBitsPerSecond:4e6}:undefined), parts=[];
    rec.ondataavailable=e=>{ if(e.data&&e.data.size) parts.push(e.data); };
    const t0=Date.now(); let fimCb=null;
    const parar=()=>new Promise(ok=>{ if(rec.state==='inactive'){ ok(); return; } rec.onstop=ok; rec.stop(); }).then(()=>{
      [tela,voz].forEach(s=>s&&s.getTracks().forEach(t=>t.stop())); try{ ac.close(); }catch(e){}
      const type=(mimeType||'video/webm').split(';')[0]; return new File(parts,'feedback-'+new Date().toISOString().slice(0,16).replace(/[:T]/g,'-')+(type==='video/mp4'?'.mp4':'.webm'),{type}); });
    /* se o professor parar pelo botão do navegador ("Parar compartilhamento") */
    tela.getVideoTracks()[0].addEventListener('ended',()=>{ if(fimCb) fimCb(); });
    rec.start(1000);
    return { parar, t0, set onfim(f){ fimCb=f; }, cancelar(){ parar(); } };
  }

  /* ---------- API usada pelas telas ---------- */
  window.FosPort={
    tc, url, status, novos, ultima, gravar, podeGravar:()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia&&window.MediaRecorder),
    modo: window.FOS_API?'servidor':'previa',
    async criar({aluno, curso, etapa, titulo, descricao, arquivo, vitrine}){
      const c=await capa(arquivo);
      const t={id:uid('p'), aluno, curso:curso||'nuke', etapa:etapa||null, titulo:String(titulo||'').slice(0,120), descricao:String(descricao||'').slice(0,2000),
        capa:c, criado:now(), vitrine:!!vitrine, destaque:false, destaqueNota:'', destaqueVersao:null,
        versoes:[{n:1, arquivo:await S.arquivo(arquivo), nota:'', data:now(), capa:c}], feedbacks:[]};
      return S.put(t); },
    async novaVersao(id, {arquivo, nota}){ const t=await S.get(id); if(!t) return;
      const c=await capa(arquivo);
      t.versoes.push({n:ultima(t).n+1, arquivo:await S.arquivo(arquivo), nota:String(nota||'').slice(0,2000), data:now(), capa:c}); if(c) t.capa=c; return S.put(t); },
    async meus(aluno){ return sort((await S.list()).filter(t=>t.aluno===aluno)); },
    async todos(){ return sort(await S.list()); },
    async vitrine(){ return sort((await S.list()).filter(t=>t.vitrine&&t.destaque)); },
    /* versão que aparece na vitrine (a escolhida pelo professor) */
    versaoVitrine:t=>t.versoes.find(x=>x.n===t.destaqueVersao)||ultima(t),
    get:id=>S.get(id),
    async autorizar(id, sim){ const t=await S.get(id); if(!t) return; t.vitrine=!!sim; if(!sim) t.destaque=false; return S.put(t); },
    async destacar(id, sim, nota){ const t=await S.get(id); if(!t) return; if(sim&&!t.vitrine) throw new Error('sem-autorizacao'); if(sim&&!t.destaque) t.destaqueVersao=ultima(t).n; /* a vitrine mostra a versão que o professor escolheu, não uma mais nova sem revisão */
      t.destaque=!!sim; if(!sim) t.destaqueVersao=null; if(nota!=null) t.destaqueNota=String(nota).slice(0,280); return S.put(t); },
    async feedback(id, {versao, video, texto, marcas}){ const t=await S.get(id); if(!t) return;
      t.feedbacks.push({id:uid('f'), versao:versao||ultima(t).n, data:now(), video:video?await S.arquivo(video):null, texto:String(texto||'').slice(0,4000), marcas:(marcas||[]).map(m=>({t:+m.t||0, texto:String(m.texto||'').slice(0,500), desenho:m.desenho||null})).sort((a,b)=>a.t-b.t), visto:false});
      return S.put(t); },
    async apagarFeedback(id, fid){ const t=await S.get(id); if(!t) return; t.feedbacks=t.feedbacks.filter(f=>f.id!==fid); return S.put(t); },
    async visto(id){ const t=await S.get(id); if(!t||!novos(t)) return t; t.feedbacks.forEach(f=>f.visto=true); return S.put(t); },
    apagar:id=>S.del(id),
  };
})();
