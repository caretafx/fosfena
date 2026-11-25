/* Fosfena · sessão da prévia (sem servidor). Papéis: 'admin' (professor) ou 'aluno'.
   Use FosfenaSessao.get() / .isAdmin() / .exigir('admin') em qualquer página.
   Isto NÃO é segurança: o código é público. O login real virá com o backend. */
(function(){
  const KEY='fosfena-sessao';
  const CONTAS={ admin:{senha:'admin', papel:'admin', nome:'admin'}, user1:{senha:'user1', papel:'aluno', nome:'user1'} };
  function get(){ try{ const s=JSON.parse(localStorage.getItem(KEY)||'null'); if(!s) return null;
    if(!s.papel) s.papel = (s.email==='admin') ? 'admin' : 'aluno';   /* sessões antigas */
    if(!s.nome) s.nome = String(s.email||'aluno').split('@')[0];
    return s; }catch(e){ return null; } }
  function entrar(usuario, senha){
    const u=String(usuario||'').trim(), k=u.toLowerCase();
    if(CONTAS[k]){ if(senha!==CONTAS[k].senha) return {erro:'Senha incorreta.'}; return salvar({email:k, nome:CONTAS[k].nome, papel:CONTAS[k].papel}); }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u)) return {erro:'Digite um e-mail válido.'};
    if(!senha) return {erro:'Digite sua senha.'};
    return salvar({email:u, nome:u.split('@')[0], papel:'aluno'});
  }
  function salvar(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} return {sessao:s}; }
  function sair(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  function isAdmin(){ const s=get(); return !!s && s.papel==='admin'; }
  /* Redireciona se não houver sessão, ou se a página pedir um papel que a sessão não tem. */
  function exigir(papel){ const s=get(); if(!s){ location.replace('login.html'); return false; } if(papel && s.papel!==papel){ location.replace('aluno.html'); return false; } return true; }
  window.FosfenaSessao={get, entrar, sair, isAdmin, exigir};
})();
