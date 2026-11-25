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
