/* Fosfena · dúvidas anônimas e envios para revisão.
   Modo prévia: tudo fica no IndexedDB deste navegador (aluno e professor só se enxergam se usarem o mesmo navegador).
   Quando existir backend (ex.: Cloudflare Worker + D1 para os dados e R2 para os arquivos), só esta camada muda: as telas continuam iguais.
   Dúvidas: NÃO guardam nome nem e-mail do aluno. O aluno reconhece as próprias pelo id, que fica só no navegador dele (localStorage "fosfena-minhas-duvidas"). */
(function(){
  const DB='fosfena-revisao', MINE='fosfena-minhas-duvidas', INBOX='fosfena-chat-inbox';
  let dbp=null;
  function db(){ return dbp || (dbp=new Promise((ok,ko)=>{ const r=indexedDB.open(DB,1);
    r.onupgradeneeded=()=>{ const d=r.result; d.createObjectStore('duvidas',{keyPath:'id'}); d.createObjectStore('envios',{keyPath:'id'}); };
    r.onsuccess=()=>ok(r.result); r.onerror=()=>ko(r.error); })); }
  const rq=r=>new Promise((ok,ko)=>{ r.onsuccess=()=>ok(r.result); r.onerror=()=>ko(r.error); });
  async function all(store){ try{ const d=await db(); return await rq(d.transaction(store).objectStore(store).getAll()); }catch(e){ return []; } }
  async function get(store,id){ const d=await db(); return rq(d.transaction(store).objectStore(store).get(id)); }
  async function put(store,obj){ const d=await db(); return new Promise((ok,ko)=>{ const t=d.transaction(store,'readwrite'); t.objectStore(store).put(obj); t.oncomplete=()=>ok(obj); t.onerror=()=>ko(t.error); t.onabort=()=>ko(t.error); }); }
  async function del(store,id){ const d=await db(); return new Promise((ok,ko)=>{ const t=d.transaction(store,'readwrite'); t.objectStore(store).delete(id); t.oncomplete=()=>ok(); t.onerror=()=>ko(t.error); }); }
  const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  const mine=()=>{ try{ return JSON.parse(localStorage.getItem(MINE))||[]; }catch(e){ return []; } };
  const tc=s=>{ s=Math.max(0,Math.floor(s||0)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0'); };
  const parseTc=v=>{ const p=String(v||'').trim().split(':').map(Number); if(p.some(isNaN)||!p.length) return null; return p.reduce((a,n)=>a*60+n,0); };

  const api={
    tc, parseTc,
    /* ---- dúvidas (anônimas) ---- */
    async perguntar({aula, aulaTitulo, curso, tempo, texto}){
      const d={id:uid('d'), aula, aulaTitulo, curso:curso||'nuke', tempo:Math.max(0,Math.floor(tempo||0)), texto:String(texto).slice(0,2000), data:new Date().toISOString(), status:'nova', resposta:'', publicada:null};
      await put('duvidas',d); try{ const m=mine(); m.push(d.id); localStorage.setItem(MINE,JSON.stringify(m)); }catch(e){}
      return d; },
    async minhas(aula){ const ids=new Set(mine()); return (await all('duvidas')).filter(d=>ids.has(d.id)&&(!aula||d.aula===aula)).sort((a,b)=>b.data.localeCompare(a.data)); },
    async duvidas(){ return (await all('duvidas')).sort((a,b)=>b.data.localeCompare(a.data)); },
    async responder(id, resposta){ const d=await get('duvidas',id); if(!d) return; d.resposta=resposta; d.status=d.publicada?'publicada':'respondida'; d.respondidaEm=new Date().toISOString(); return put('duvidas',d); },
    /* publica no canal de dúvidas da comunidade sem nenhum dado do aluno: autor aparece como "Dúvida anônima" */
    async publicar(id, canal){ const d=await get('duvidas',id); if(!d) return;
      const t=Date.now(), qid='anon-'+d.id, x=`${d.aulaTitulo?`[${d.aulaTitulo} · ${tc(d.tempo)}] `:''}${d.texto}`;
      const msgs=[{canal, m:{id:qid, a:{name:'Dúvida anônima'}, t, x}}];
      if(d.resposta) msgs.push({canal, m:{id:qid+'-r', a:{name:'vfxstudio', role:'Professor'}, t:t+1000, x:d.resposta, r:qid}});
      try{ const box=JSON.parse(localStorage.getItem(INBOX)||'[]'); localStorage.setItem(INBOX, JSON.stringify(box.concat(msgs))); }catch(e){}
      d.publicada={canal, em:new Date().toISOString()}; d.status='publicada'; return put('duvidas',d); },
    apagarDuvida:id=>del('duvidas',id),
    /* mensagens publicadas pelo professor que a comunidade ainda não puxou */
    inbox(){ try{ const v=JSON.parse(localStorage.getItem(INBOX)||'[]'); localStorage.removeItem(INBOX); return v; }catch(e){ return []; } },
    /* ---- envios para revisão (identificados: o professor precisa saber de quem é para devolver o comentário) ---- */
    async enviar({aula, aulaTitulo, aluno, nota, arquivos}){
      const e={id:uid('e'), aula, aulaTitulo, aluno, nota:String(nota||'').slice(0,2000), data:new Date().toISOString(), status:'pendente', comentario:'',
        arquivos:[...arquivos].map(f=>({name:f.name, type:f.type, size:f.size, blob:f}))};
      return put('envios',e); },
    async meusEnvios(aluno, aula){ return (await all('envios')).filter(e=>e.aluno===aluno&&(!aula||e.aula===aula)).sort((a,b)=>b.data.localeCompare(a.data)); },
    async envios(){ return (await all('envios')).sort((a,b)=>b.data.localeCompare(a.data)); },
    async revisar(id, comentario, status){ const e=await get('envios',id); if(!e) return; e.comentario=comentario; e.status=status||'revisado'; e.revisadoEm=new Date().toISOString(); return put('envios',e); },
    apagarEnvio:id=>del('envios',id),
  };
  window.FosRev=api;
})();
