/* Fosfena · plano do módulo NK101 (Fundamentos do Nuke).
   Fonte única do organograma: o painel do admin (admin.html) e a versão para ver no chat usam este arquivo.
   status: 'feito' | 'agora' | 'proximo' | 'depois'. O painel deixa mudar o status; a mudança fica salva no navegador. */
window.NK101_PLANO = {
  code: 'NK101',
  titulo: 'Fundamentos do Nuke',
  atualizado: '2026-11-25',
  fases: [
    {
      id: 'f1', titulo: 'Começando no Nuke', sub: 'Gravado', cor: 'roxo',
      nodes: [
        { id: 'nk101-a01', n: 1, titulo: 'Como instalar o Nuke', status: 'feito', dur: '9:59',
          topicos: ['Download e instalação', 'Licença e primeira abertura'] },
        { id: 'nk101-a02', n: 2, titulo: 'Iniciando o Nuke', status: 'feito', dur: '19:49',
          topicos: ['Interface: Node Graph, Viewer e Properties', 'Criar, ligar e organizar nodes', 'Salvar e versionar o script'] }
      ]
    },
    {
      id: 'f2', titulo: 'Para os ansiosos', sub: 'Primeiros exercícios, já gravados', cor: 'ambar',
      nodes: [
        { id: 'nk101-a03', n: 3, titulo: 'Primeiro apagamento', status: 'feito', dur: '40:13',
          topicos: ['Read do plano vertical 2160×3840, 101 frames', 'Tracker4 no plano', 'Roto e RotoPaint para limpar', 'FrameHold para o clean plate', 'CornerPin2D e Merge do patch', 'Write em .mov'],
          nodes: ['Read', 'Tracker4', 'Roto', 'RotoPaint', 'FrameHold', 'CornerPin2D', 'Merge2', 'Write'] },
        { id: 'nk101-a04', n: 4, titulo: 'Primeira tela', status: 'feito', dur: '26:25',
          topicos: ['Reformat para 1920×1080', 'Tracker4 nos cantos da tela', 'CheckerBoard como tela provisória', 'Keyer e FilterErode para o matte', 'Roto, HueCorrect, Copy e Premult', 'Write de 65 frames'],
          nodes: ['Reformat', 'Tracker4', 'CheckerBoard2', 'Keyer', 'FilterErode', 'Roto', 'HueCorrect', 'Copy', 'Premult', 'Merge2', 'Write'] }
      ]
    },
    {
      id: 'f3', titulo: 'Projeto básico', sub: 'A base do módulo, tirada do Projeto_aulas_v02.nknc', cor: 'ciano', fonte: 'Projeto_aulas_v02.nknc',
      nodes: [
        { id: 'nk101-a05', n: 5, titulo: 'Projetão inicial: organizar o projeto', status: 'agora',
          topicos: ['Estrutura de pastas: Footages, Nuke/Script, precomp, assets, Output', 'Imagens de apoio: Fazenda, Flores, Paisagem, Sala, Tigre, Universo', 'Sequência EXR Shot_04_5F (frames 100 a 134)'],
          pendente: true }
      ]
    },
    {
      id: 'f4', titulo: 'Fechamento do NK101', sub: 'Depois do projeto básico', cor: 'giz',
      nodes: [
        { id: 'nk101-prova', titulo: 'Prova final do módulo', status: 'depois', topicos: ['Quiz com o conteúdo de todas as aulas', 'Aprovação com 70%'] },
        { id: 'nk101-entrega', titulo: 'Entrega do aluno', status: 'depois', topicos: ['Refazer um plano do projeto básico do zero', 'Enviar o render para correção na comunidade'] }
      ]
    }
  ]
};
