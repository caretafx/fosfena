/* Fosfena · plano do Curso de Nuke, módulo NK101 (Fundamentos do Nuke). O Curso de Flame é outro curso, com plano próprio.
   Fonte única do organograma: o painel do admin (admin.html) e a versão para ver no chat usam este arquivo.
   status: 'feito' | 'agora' | 'proximo' | 'depois'. O painel deixa mudar o status; a mudança fica salva no navegador.
   topicos viram o último nível da árvore (caixas pequenas). */
window.NK101_PLANO = {
  curso: 'Curso de Nuke',
  code: 'NK101',
  titulo: 'Fundamentos do Nuke',
  atualizado: '2026-11-25',
  fases: [
    {
      id: 'f1', titulo: 'Começando no Nuke', sub: 'Gravado',
      nodes: [
        { id: 'nk101-a01', n: 1, titulo: 'Como instalar o Nuke', status: 'feito', dur: '9:59',
          topicos: ['Download e instalação', 'Licença e 1ª abertura'] },
        { id: 'nk101-a02', n: 2, titulo: 'Iniciando o Nuke', status: 'feito', dur: '19:49',
          topicos: ['Node Graph, Viewer e Properties', 'Criar e ligar nodes', 'Salvar e versionar'] }
      ]
    },
    {
      id: 'f2', titulo: 'Para os ansiosos', sub: 'Primeiros exercícios, gravados',
      nodes: [
        { id: 'nk101-a03', n: 3, titulo: 'Primeiro apagamento', status: 'feito', dur: '40:13',
          topicos: ['Tracker4 no plano', 'Roto e RotoPaint', 'FrameHold: clean plate', 'CornerPin2D e Merge'],
          nodes: ['Read', 'Tracker4', 'Roto', 'RotoPaint', 'FrameHold', 'CornerPin2D', 'Merge2', 'Write'] },
        { id: 'nk101-a04', n: 4, titulo: 'Primeira tela', status: 'feito', dur: '26:25',
          topicos: ['Tracker nos cantos', 'Keyer e FilterErode', 'Copy e Premult', 'Grade e HueCorrect'],
          nodes: ['Reformat', 'Tracker4', 'CheckerBoard2', 'Keyer', 'FilterErode', 'Roto', 'HueCorrect', 'Copy', 'Premult', 'Merge2', 'Write'] }
      ]
    },
    {
      id: 'f3', titulo: 'Projeto básico', sub: 'Do Projeto_aulas_v02.nknc', fonte: 'Projeto_aulas_v02.nknc',
      nodes: [
        { id: 'nk101-a05', n: 5, titulo: 'Projetão inicial', status: 'agora', pendente: true,
          topicos: ['Pastas do projeto', 'Imagens de apoio (6 jpg)', 'Sequência EXR Shot_04_5F'] },
        { id: 'nk101-bas-resto', titulo: 'Demais aulas do projeto', status: 'proximo', pendente: true,
          topicos: ['Sai dos backdrops do .nknc'] }
      ]
    },
    {
      id: 'f4', titulo: 'Fechamento do NK101', sub: 'Depois do projeto básico',
      nodes: [
        { id: 'nk101-prova', titulo: 'Prova final do módulo', status: 'depois', topicos: ['Todas as aulas', 'Aprovação com 70%'] },
        { id: 'nk101-entrega', titulo: 'Entrega do aluno', status: 'depois', topicos: ['Refazer um plano do zero', 'Correção na comunidade'] }
      ]
    }
  ]
};

/* Roteiros das videoaulas do NK101, do básico ao avançado. Cada aula alterna técnica (T) e exercício (E).
   Aulas já gravadas: estrutura sugerida a partir do título e dos scripts, para revisar contra a gravação. */
(function(){
  const T = (t, txt) => ({ tipo: 'tecnica', t, txt }), E = (t, txt) => ({ tipo: 'exercicio', t, txt });
  const R = {
    'nk101-a01': { fonte: 'Aula gravada: estrutura sugerida, revisar contra a gravação', objetivo: 'Sair da aula com o Nuke instalado, licenciado e a pasta do curso pronta.', passos: [
      T('O que é o Nuke', 'Onde ele entra no pipeline de VFX e por que é o padrão de compositing em cinema e séries.'),
      T('Versões', 'Nuke, NukeX, Nuke Studio e Non-Commercial: o que muda e qual usar no curso.'),
      T('Download e instalação', 'Conta na Foundry, download da versão e instalação no Windows.'),
      T('Licença', 'Login da licença, limites do Non-Commercial (resolução e arquivo .nknc).'),
      E('Exercício', 'Instalar, abrir o Nuke, criar a pasta do curso (footage, nuke/script, output) e salvar um script vazio como aula01_v01.') ] },
    'nk101-a02': { fonte: 'Aula gravada: estrutura sugerida, revisar contra a gravação', objetivo: 'Entender a interface e fazer o caminho completo: ler, mexer e renderizar.', passos: [
      T('Interface', 'Node Graph, Viewer, Properties e a barra de ferramentas.'),
      T('Read e Viewer', 'Importar uma imagem, navegar no Viewer (zoom, frames, canais RGBA).'),
      T('Nodes e pipes', 'Criar com Tab, ligar inputs, usar Dots e manter o script organizado.'),
      T('Project Settings', 'Formato, fps e frame range do projeto.'),
      T('Salvar e versionar', 'Padrão de nomes v01, v02 e o Write para renderizar.'),
      E('Exercício', 'Ler uma imagem, aplicar Grade e Transform e renderizar um JPG na pasta output.') ] },
    'nk101-a03': { fonte: 'Resumo tirado do script aula03_v01.nk', objetivo: 'Primeiro trabalho real: apagar um elemento de um plano com câmera em movimento.', passos: [
      T('Abertura', 'O que é um apagamento (cleanup) e o plano que vamos limpar: vertical 2160×3840, 101 frames.'),
      T('Read e organização', 'Importar o footage, conferir formato e frame range, organizar o script com Dots.'),
      T('Tracker4', 'Trackear o plano no ponto do apagamento para o patch acompanhar a câmera.'),
      T('Clean plate', 'FrameHold num frame bom e RotoPaint (clone) para pintar o objeto fora.'),
      T('Recolocar o patch', 'CornerPin2D com os dados do tracker e Roto para limitar a área do patch.'),
      T('Merge e Write', 'Juntar o patch ao plano, revisar no Viewer e renderizar o .mov.'),
      E('Exercício', 'Apagar um segundo elemento do mesmo plano sozinho, com o mesmo fluxo, e entregar o .mov.') ] },
    'nk101-a04': { fonte: 'Resumo tirado do script aula04_v01.nk', objetivo: 'Substituir a tela de um celular ou monitor de forma convincente.', passos: [
      T('Abertura', 'Substituição de tela: o que precisa casar (movimento, luz, borda) e o plano de 65 frames.'),
      T('Reformat e Tracker4', 'Deixar em 1920×1080 e trackear os cantos da tela.'),
      T('Tela provisória', 'CheckerBoard posicionado com Transform para conferir o track antes da arte final.'),
      T('Matte', 'Keyer na tela, FilterErode e Blur para refinar, Invert e Roto para os dedos na frente.'),
      T('Integração', 'Grade e HueCorrect para a tela nova casar com a luz do plano.'),
      T('Copy, Premult, Merge e Write', 'Levar o alpha com Copy, Premult, compor sobre o plano e renderizar.'),
      E('Exercício', 'Trocar o CheckerBoard por uma imagem ou vídeo seu e entregar o .mov final.') ] },
    'nk101-a05': { fonte: 'Rascunho a partir das pastas da aula 05; ajusto quando ler o Projeto_aulas_v02.nknc', objetivo: 'Voltar à base com calma: projeto organizado e os nodes essenciais, um de cada vez.', passos: [
      T('Estrutura do projeto', 'Pastas Footages, Nuke/Script, precomp, assets e Output, e por que cada uma existe.'),
      T('Formatos de imagem', 'JPG, PNG com alpha e sequência EXR: Read, frame range, colorspace e canais.'),
      E('Exercício', 'Importar as 6 imagens, o PNG de exemplo e a sequência Shot_04_5F, todas com o formato certo.'),
      T('Merge e alpha', 'Como o Merge (over) usa o alpha, Premult e Unpremult.'),
      T('Transform e Reformat', 'Posicionar, escalar e adaptar imagens de tamanhos diferentes ao formato do projeto.'),
      E('Exercício', 'Montar uma composição simples com as imagens (por exemplo, o tigre na paisagem) e renderizar.') ] },
    'nk101-prova': { fonte: 'Estrutura sugerida', objetivo: 'Confirmar que o aluno domina a base antes do NK102.', passos: [
      T('Revisão', 'Resumo rápido das técnicas do módulo, na ordem em que apareceram.'),
      E('Prova', 'Questões de múltipla escolha sobre todas as aulas, aprovação com 70%.'),
      E('Prática', 'Um mini plano com tracker, roto e merge para resolver em até 1 hora.') ] },
    'nk101-entrega': { fonte: 'Estrutura sugerida', objetivo: 'Fechar o módulo com um trabalho que vai para o portfólio.', passos: [
      T('Briefing', 'O plano da entrega, o que é esperado e como será avaliado.'),
      E('Entrega', 'Refazer um plano do projeto básico do zero, com script organizado e versionado.'),
      E('Correção', 'Enviar o render na comunidade e receber o retorno do professor.') ] }
  };
  window.NK101_PLANO.fases.forEach(f => f.nodes.forEach(n => { const r = R[n.id]; if (r) { n.roteiro = r.passos; n.roteiroFonte = r.fonte; n.objetivo = r.objetivo; } }));
})();
