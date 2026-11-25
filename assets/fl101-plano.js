/* Fosfena · plano do Curso de Flame, módulo FL101 (Fundamentos do Flame). Curso separado do Curso de Nuke.
   Proposta inicial: nada gravado ainda, tudo 'planejado' para o Mauricio ajustar. Mesmo formato do nk101-plano.js. */
window.FL101_PLANO = {
  curso: 'Curso de Flame',
  code: 'FL101',
  titulo: 'Fundamentos do Flame',
  atualizado: '2026-11-25',
  proposta: true,
  fases: [
    {
      id: 'fl-f1', titulo: 'Começando no Flame', sub: 'Planejado',
      nodes: [
        { id: 'fl101-a01', n: 1, titulo: 'Instalar e abrir o Flame', status: 'planejado',
          topicos: ['Versões e licença', 'Primeira abertura', 'Criar projeto e usuário'] },
        { id: 'fl101-a02', n: 2, titulo: 'Interface e organização', status: 'planejado',
          topicos: ['Workspace, libraries e reels', 'MediaHub: importar mídia', 'Player e atalhos'] }
      ]
    },
    {
      id: 'fl-f2', titulo: 'Para os ansiosos', sub: 'Primeiros exercícios no Flame',
      nodes: [
        { id: 'fl101-a03', n: 3, titulo: 'Primeiro apagamento no Flame', status: 'planejado',
          topicos: ['Batch com Clip e Render', 'Paint para limpar', 'Tracker no patch'] },
        { id: 'fl101-a04', n: 4, titulo: 'Primeira tela no Flame', status: 'planejado',
          topicos: ['Action com Perspective Grid', 'Planar tracker', 'Master Keyer nos dedos'] }
      ]
    },
    {
      id: 'fl-f3', titulo: 'Batch e Action', sub: 'A base do módulo',
      nodes: [
        { id: 'fl101-a05', n: 5, titulo: 'Batch: o node graph do Flame', status: 'planejado',
          topicos: ['Nodes, pipes e schematic', 'Iterações e versões', 'Render e Write File'] },
        { id: 'fl101-a06', n: 6, titulo: 'Action: compositing 3D', status: 'planejado',
          topicos: ['Media, surfaces e eixos', 'Câmera e luz', 'Blend modes'] },
        { id: 'fl101-a07', n: 7, titulo: 'Keying e cor', status: 'planejado',
          topicos: ['Master Keyer', 'GMask Tracer', 'Colour Correct e Colour Warper'] },
        { id: 'fl101-a08', n: 8, titulo: 'Tracking', status: 'planejado',
          topicos: ['Point tracker', 'Planar tracker', 'Stabilize'] },
        { id: 'fl101-a09', n: 9, titulo: 'Timeline e conform', status: 'planejado',
          topicos: ['Sequências e timeline FX', 'Conform básico', 'Batch FX'] }
      ]
    },
    {
      id: 'fl-f4', titulo: 'Fechamento do FL101', sub: 'Depois de Batch e Action',
      nodes: [
        { id: 'fl101-prova', titulo: 'Prova final do módulo', status: 'planejado', topicos: ['Todas as aulas', 'Aprovação com 70%'] },
        { id: 'fl101-entrega', titulo: 'Entrega do aluno', status: 'planejado', topicos: ['Um plano completo no Batch', 'Correção na comunidade'] }
      ]
    }
  ]
};

/* Roteiros propostos para o FL101, do básico ao avançado. Cada aula alterna técnica (T) e exercício (E). */
(function(){
  const T = (t, txt) => ({ tipo: 'tecnica', t, txt }), E = (t, txt) => ({ tipo: 'exercicio', t, txt });
  const F = 'Roteiro proposto, para você ajustar';
  const R = {
    'fl101-a01': { objetivo: 'Ter o Flame rodando, com projeto e usuário criados.', passos: [
      T('O que é o Flame', 'Finishing e VFX de alto nível: onde o Flame entra em publicidade, séries e cinema.'),
      T('Família Flame e licença', 'Flame, Flare e Flame Assist; sistemas suportados e opções de licença para estudar.'),
      T('Instalação', 'Requisitos de máquina, instalação e primeira abertura.'),
      T('Projeto e usuário', 'Project Management: resolução, fps, profundidade de cor e preferências do usuário.'),
      E('Exercício', 'Criar o projeto FL101 em 1920×1080, 24 fps, e o seu usuário.') ] },
    'fl101-a02': { objetivo: 'Saber onde está cada coisa e organizar a mídia antes de compor.', passos: [
      T('Workspace', 'Media Panel, libraries, reels e desktop: como o Flame guarda tudo.'),
      T('MediaHub', 'Importar arquivos, formatos suportados e opções de cache.'),
      T('Player e atalhos', 'Revisar clips no Player e os atalhos que mais usamos.'),
      T('Tabs principais', 'Visão geral de Timeline, Batch e Tools.'),
      E('Exercício', 'Importar o footage do curso e organizar em uma library com um reel por aula.') ] },
    'fl101-a03': { objetivo: 'Primeiro resultado no Flame: um apagamento simples.', passos: [
      T('Batch mínimo', 'Abrir o Batch, ligar um clip e um Render node.'),
      T('Paint', 'Clone e Reveal no Paint node para limpar o elemento.'),
      T('Seguir o movimento', 'Tracker 2D no Action para o patch acompanhar a câmera.'),
      E('Exercício', 'Apagar um elemento de um plano com câmera em movimento e renderizar.') ] },
    'fl101-a04': { objetivo: 'Substituir uma tela usando as ferramentas próprias do Flame.', passos: [
      T('Action e media', 'Colocar a imagem nova como media no Action.'),
      T('Perspective Grid e planar', 'Encaixar a tela nos cantos e seguir com o planar tracker.'),
      T('Matte dos dedos', 'Master Keyer para o que passa na frente da tela.'),
      T('Integração', 'Colour Correct para casar luz e cor.'),
      E('Exercício', 'Trocar a tela de um celular e entregar o render.') ] },
    'fl101-a05': { objetivo: 'Dominar o Batch, que é o node graph do Flame.', passos: [
      T('Schematic e pipes', 'Como o Batch organiza nodes, inputs, outputs e contextos.'),
      T('Iterações', 'Salvar iterações, voltar versões e comparar resultados.'),
      T('Render e Write File', 'Render node, Write File, formatos de saída e fila de render.'),
      E('Exercício', 'Reorganizar o apagamento da aula 03 num Batch limpo, com iterações e Write File.') ] },
    'fl101-a06': { objetivo: 'Compor em 3D dentro do Action.', passos: [
      T('Media, surfaces e eixos', 'A hierarquia do Action e como cada elemento se move.'),
      T('Câmera e luz', 'Câmera 3D, luzes e sombras simples.'),
      T('Blend modes e outputs', 'Modos de mistura, saídas de comp e de matte.'),
      E('Exercício', 'Colocar um cartaz ou logo num plano, com câmera e luz casando.') ] },
    'fl101-a07': { objetivo: 'Fazer key e acertar a cor do plano.', passos: [
      T('Master Keyer', 'Key de fundo verde ou azul, refinando bordas e spill.'),
      T('GMask Tracer', 'Máscaras com tracking para isolar áreas.'),
      T('Colour Correct e Colour Warper', 'Correção primária e secundária para integrar o elemento.'),
      E('Exercício', 'Recortar uma pessoa do fundo verde e colocar num cenário novo, com a cor casando.') ] },
    'fl101-a08': { objetivo: 'Seguir e estabilizar qualquer movimento.', passos: [
      T('Point tracker', 'Tracking de um e de vários pontos, e como avaliar a qualidade.'),
      T('Planar tracker', 'Superfícies planas e áreas com pouca textura.'),
      T('Stabilize', 'Estabilizar, trabalhar parado e devolver o movimento.'),
      E('Exercício', 'Estabilizar um plano, pintar uma correção e recolocar o movimento original.') ] },
    'fl101-a09': { objetivo: 'Trabalhar como num finishing de verdade: da timeline à entrega.', passos: [
      T('Timeline', 'Sequências, versões e Timeline FX.'),
      T('Conform', 'Importar EDL ou XML e religar a mídia original.'),
      T('Batch FX', 'Abrir um Batch a partir da timeline e voltar com o resultado.'),
      E('Exercício', 'Conformar uma sequência curta, resolver um plano com Batch FX e exportar.') ] },
    'fl101-prova': { objetivo: 'Confirmar a base do Flame antes dos módulos avançados.', passos: [
      T('Revisão', 'Resumo das técnicas do módulo, na ordem em que apareceram.'),
      E('Prova', 'Questões de múltipla escolha sobre todas as aulas, aprovação com 70%.') ] },
    'fl101-entrega': { objetivo: 'Fechar o módulo com um plano completo no Batch.', passos: [
      T('Briefing', 'O plano da entrega e como será avaliado.'),
      E('Entrega', 'Um plano completo no Batch: tracking, key, cor e render.'),
      E('Correção', 'Enviar na comunidade e receber o retorno do professor.') ] }
  };
  window.FL101_PLANO.fases.forEach(f => f.nodes.forEach(n => { const r = R[n.id]; if (r) { n.roteiro = r.passos; n.roteiroFonte = F; n.objetivo = r.objetivo; } }));
})();
