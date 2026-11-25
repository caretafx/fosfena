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
          nodes: ['Read', 'Tracker4', 'Roto', 'RotoPaint', 'FrameHold', 'CornerPin2D', 'Merge2', 'Write'],
          roteiroFonte: 'Resumo tirado do script aula03_v01.nk',
          roteiro: [
            { t: 'Abertura', txt: 'O que é um apagamento (cleanup) e o plano que vamos limpar: vertical 2160×3840, 101 frames.' },
            { t: 'Read e organização', txt: 'Importar o footage, conferir formato e frame range, organizar o script com Dots.' },
            { t: 'Tracker4', txt: 'Trackear o plano no ponto do apagamento para o patch acompanhar a câmera.' },
            { t: 'Clean plate', txt: 'FrameHold num frame bom e RotoPaint (clone) para pintar o objeto fora.' },
            { t: 'Recolocar o patch', txt: 'CornerPin2D com os dados do tracker e Roto para limitar a área do patch.' },
            { t: 'Merge e Write', txt: 'Juntar o patch ao plano, revisar no Viewer e renderizar o .mov.' }
          ] },
        { id: 'nk101-a04', n: 4, titulo: 'Primeira tela', status: 'feito', dur: '26:25',
          topicos: ['Tracker nos cantos', 'Keyer e FilterErode', 'Copy e Premult', 'Grade e HueCorrect'],
          nodes: ['Reformat', 'Tracker4', 'CheckerBoard2', 'Keyer', 'FilterErode', 'Roto', 'HueCorrect', 'Copy', 'Premult', 'Merge2', 'Write'],
          roteiroFonte: 'Resumo tirado do script aula04_v01.nk',
          roteiro: [
            { t: 'Abertura', txt: 'Substituição de tela: o que precisa casar (movimento, luz, borda) e o plano de 65 frames.' },
            { t: 'Reformat e Tracker4', txt: 'Deixar em 1920×1080 e trackear os cantos da tela.' },
            { t: 'Tela provisória', txt: 'CheckerBoard posicionado com Transform para conferir o track antes da arte final.' },
            { t: 'Matte', txt: 'Keyer na tela, FilterErode e Blur para refinar, Invert e Roto para os dedos na frente.' },
            { t: 'Integração', txt: 'Grade e HueCorrect para a tela nova casar com a luz do plano.' },
            { t: 'Copy, Premult, Merge e Write', txt: 'Levar o alpha com Copy, Premult, compor sobre o plano e renderizar.' }
          ] }
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
