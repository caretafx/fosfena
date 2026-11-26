/* Fosfena · emblemas próprios dos cursos (não são os logos oficiais da Foundry nem da Autodesk).
   Nuke: um pequeno node graph (dois nodes entrando num Merge e saindo para o Viewer), em âmbar e laranja.
   Flame: uma chama com faísca, em roxo e azul.
   Uso: FosEmblema('nk' | 'fl', tamanho_em_px, classe_extra) devolve o <svg> pronto. */
(function(){
  let n=0;
  const NK=id=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient></defs>
    <rect x="3" y="3" width="58" height="58" rx="16" fill="rgba(255,181,71,.08)" stroke="url(#${id})" stroke-width="2"/>
    <path d="M19 20.5C19 28 24 28 24 35M45 26.5C45 33 36 30 34 35M28 43.5V49" fill="none" stroke="url(#${id})" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="10" y="12" width="18" height="8.5" rx="2.5" fill="url(#${id})"/>
    <rect x="36" y="18" width="18" height="8.5" rx="2.5" fill="#18191C" stroke="url(#${id})" stroke-width="2"/>
    <rect x="17" y="35" width="22" height="8.5" rx="2.5" fill="url(#${id})"/>
    <rect x="19" y="49" width="18" height="6" rx="3" fill="none" stroke="url(#${id})" stroke-width="2"/>`;
  const FL=id=>`<defs><linearGradient id="${id}" x1="0" y1="1" x2=".4" y2="0"><stop offset="0" stop-color="#5CC8FF"/><stop offset="1" stop-color="#B48CFF"/></linearGradient></defs>
    <rect x="3" y="3" width="58" height="58" rx="16" fill="rgba(155,107,255,.1)" stroke="url(#${id})" stroke-width="2"/>
    <path d="M32 11c2 8 13 13 13 26a13 13 0 0 1-26 0c0-7 4-11 7-16 1 5 3 7 5 9 2-6 0-12 1-19z" fill="url(#${id})"/>
    <path d="M32 33c1 4 6 6 6 11a6 6 0 0 1-12 0c0-4 4-6 6-11z" fill="#18191C" opacity=".6"/>
    <path d="M47 14l1.2 3 3 1.2-3 1.2L47 22.4l-1.2-3-3-1.2 3-1.2z" fill="#CFEFFF"/>`;
  window.FosEmblema=(k,size,cls)=>{ const id='em'+k+(++n); return `<svg class="emb emb-${k} ${cls||''}" viewBox="0 0 64 64" width="${size||40}" height="${size||40}" aria-hidden="true" focusable="false">${(k==='fl'?FL:NK)(id)}</svg>`; };
})();
