/* Fosfena · ícones dos cursos.
   Nuke: logo oficial da Foundry dentro de uma moldura na cor do curso.
   Flame: ícone oficial do Autodesk Flame (assets/logos/flame.png) dentro de uma moldura na cor do curso.
   Uso: FosEmblema('nk' | 'fl', tamanho_em_px, classe_extra) devolve o <svg> pronto. */
(function(){
  let n=0;
  /* Nuke: logo oficial da Foundry (marca monocromática do Simple Icons, assets/logos/nuke.svg), em branco, sem alterar o desenho;
     só a moldura em volta usa a cor do curso. */
  const NUKE_PATH="M12.293.004c6.625.162 11.865 5.664 11.703 12.29-.162 6.625-5.664 11.865-12.29 11.703C5.081 23.835-.159 18.333.003 11.707l.001-.025C.18 5.066 5.678-.158 12.293.004zm0 1.238c-5.941-.164-10.89 4.52-11.054 10.461s4.52 10.89 10.461 11.054c5.941.164 10.89-4.52 11.054-10.461l.001-.025c.15-5.932-4.53-10.866-10.462-11.029zm5.842 8.302h2.4c.976 0 .682-.873.682-.873a9.587 9.587 0 0 0-2.111-3.431l-.005.011a10.052 10.052 0 0 0-3.355-2.329.612.612 0 0 0-.894.622c-.044.802-.142 2.395-.142 2.395s.016.769-.627.769c-.813.011-1.489-.044-1.489-.044a2.314 2.314 0 0 1-1.255-.545L8.868 3.511a1.09 1.09 0 0 0-1.407-.196 9.758 9.758 0 0 0-4.713 5.384c-.256.714.333.806.731.806h6a2.086 2.086 0 0 1 1.68.627c.785.824 1.331 1.369 1.331 1.369s.48.54 1.26 1.358c.431.459.632 1.089.545 1.713 0 0-.295 5.744-.295 6-.027.398.038.993.769.775a9.756 9.756 0 0 0 5.618-4.424 1.091 1.091 0 0 0-.12-1.418l-2.471-2.607a2.303 2.303 0 0 1-.496-1.282s-.022-.682.033-1.489c.044-.643.802-.583.802-.583zm-2.362 1.374c-.475.469-1.484.229-2.22-.545-.736-.775-.924-1.801-.45-2.254.475-.453 1.502-.239 2.239.536.737.774.906 1.794.431 2.263z";
  const NK=id=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset="1" stop-color="#FF8A3D"/></linearGradient></defs>
    <rect x="3" y="3" width="58" height="58" rx="16" fill="rgba(255,181,71,.12)" stroke="url(#${id})" stroke-width="2"/>
    <g transform="translate(14 14) scale(1.5)"><path d="${NUKE_PATH}" fill="#F4F2EC"/></g>`;
  /* Flame: ícone oficial do Autodesk Flame ("FLM", enviado pelo Mauricio), sem alterar o desenho;
     só a moldura em volta usa a cor do curso. */
  const FLAME_SRC=(document.currentScript&&document.currentScript.src||'').replace(/emblemas\.js.*$/,'logos/flame.png')||'assets/logos/flame.png';
  const FL=id=>`<defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#5CC8FF"/><stop offset="1" stop-color="#B48CFF"/></linearGradient></defs>
    <rect x="3" y="3" width="58" height="58" rx="16" fill="rgba(155,107,255,.12)" stroke="url(#${id})" stroke-width="2"/>
    <image href="${FLAME_SRC}" x="11" y="11" width="42" height="42" preserveAspectRatio="xMidYMid meet"/>`;
  window.FosEmblema=(k,size,cls)=>{ const id='em'+k+(++n); return `<svg class="emb emb-${k} ${cls||''}" viewBox="0 0 64 64" width="${size||40}" height="${size||40}" aria-hidden="true" focusable="false">${(k==='fl'?FL:NK)(id)}</svg>`; };
})();
