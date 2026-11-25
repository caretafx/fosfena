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
      id: 'f3', titulo: 'Projeto básico', sub: 'Do Projeto_aulas_v03.nknc, do básico ao avançado', fonte: 'Projeto_aulas_v03.nknc',
      nodes: [
        { id: 'nk101-a05', n: 5, titulo: 'Projeto, fotos e shots', status: 'agora', topicos: ['Pastas e Read', 'Fotos & Shots', 'Viewer e Alt+E'] },
        { id: 'nk101-a06', n: 6, titulo: 'O que é uma imagem?', status: 'proximo', topicos: ['Cores aditivas e canais', 'Por que o chroma é verde', 'Canal alpha e masking'] },
        { id: 'nk101-a07', n: 7, titulo: 'Resoluções e tamanhos', status: 'proximo', topicos: ['Diferença de tamanhos', 'Reformat e Crop', 'Cuidado no Merge'] },
        { id: 'nk101-a08', n: 8, titulo: 'Nodes essenciais: Merge', status: 'proximo', topicos: ['A e B, atalho M', 'Operações em RGB e RGB+Alpha', 'Stencil e ChannelMerge'] },
        { id: 'nk101-a09', n: 9, titulo: 'Nodes de Transform', status: 'proximo', topicos: ['Transform e Mirror', 'CornerPin', 'Crop e Reformat'] },
        { id: 'nk101-a10', n: 10, titulo: 'Nodes de desfoque', status: 'proximo', topicos: ['Atalho B', 'Principais blurs', 'O blur afeta o alpha'] },
        { id: 'nk101-a11', n: 11, titulo: 'Nodes essenciais para as cores', status: 'proximo', topicos: ['Contrast, Saturation, Hue, Lift', 'Gain, Gamma, Whitepoint, Blackpoint', 'Gamma × Ganho'] },
        { id: 'nk101-a12', n: 12, titulo: 'Nodes de alpha e clone', status: 'proximo', topicos: ['Principais nodes', 'Atalhos'] },
        { id: 'nk101-a13', n: 13, titulo: 'Pré-multiplicação', status: 'proximo', topicos: ['O que é e a matemática', 'Concatenação: grade antes do premult', 'Bordas integradas'] },
        { id: 'nk101-a14', n: 14, titulo: 'Keying', status: 'proximo', topicos: ['Uso do Keyer', 'Matte e despill', 'Integração'] },
        { id: 'nk101-a15', n: 15, titulo: 'Nodes de criação', status: 'proximo', topicos: ['Noise: chuva, poeira, atmosfera', 'LightWrap', 'VolumeRays (godrays)'] }
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
    'nk101-a05': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Abrir o projeto básico e conhecer o material que vamos usar no módulo.', passos: [
      T('O projeto', 'As pastas Footages, Nuke/Script, precomp, assets e Output, e como o script está dividido em seções.'),
      T('Fotos & Shots', 'Ler as fotos (Fazenda, Flores, Paisagem, Sala, Tigre, Universo, PNG de exemplo) e a sequência EXR Shot_04_5F.'),
      T('Viewer e atalhos', 'Ligar o Viewer, trocar de input e usar Alt+E para mostrar e esconder as linhas laranjas.'),
      E('Exercício', 'Abrir o projeto, ler todas as fotos e o shot, e conferir cada uma no Viewer.') ] },
    'nk101-a06': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Entender do que uma imagem é feita antes de mexer nela.', passos: [
      T('Cores aditivas', 'RGB: como vermelho, verde e azul formam todas as cores na tela.'),
      T('Canais de uma imagem', 'Separar e ver cada canal no Viewer.'),
      T('Por que o chroma key é verde', 'Verde e azul são cores "puras"; o verde se destaca da pele e é a cor mais clara do espectro visível, o que facilita o recorte.'),
      T('Canal alpha', 'Um canal binário de contém e não contém, que permite recortar a imagem; exemplo de masking.'),
      E('Exercício', 'Separar os canais de uma foto e criar uma máscara simples para recortar uma parte dela.') ] },
    'nk101-a07': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Evitar o erro mais comum de iniciante: juntar imagens de tamanhos diferentes.', passos: [
      T('Diferença de tamanhos', 'Comparar imagens de resoluções diferentes no mesmo script.'),
      T('O problema no Merge', 'O ColorWheel em 4K_DCP com uma imagem menor dá um resultado estranho no "over".'),
      T('Reformat e Crop', 'Como corrigir o tamanho; o Transform raramente é usado para isso.'),
      E('Exercício', 'Ativar e desativar o Reformat do exemplo e depois corrigir os tamanhos das fotos do projeto para o formato do projeto.') ] },
    'nk101-a08': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Dominar o Merge, o node que aparece em todo script.', passos: [
      T('A e B', 'A é o foreground (em cima) e B o background (embaixo); atalho M para criar.'),
      T('Operações em RGB', 'Testar as operações do Merge só nas cores.'),
      T('Operações em RGB+Alpha', 'Como o alpha muda o resultado; o Stencil subtrai o A do B e recorta pelo alpha.'),
      T('Alpha influencia o RGB', 'Por isso trabalhamos o alpha separado; usar ChannelMerge para não estragar a imagem.'),
      E('Exercício', 'Compor duas fotos testando over, stencil e mask, e explicar a diferença no resultado.') ] },
    'nk101-a09': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Mover, espelhar e encaixar imagens.', passos: [
      T('Transform', 'Mover e animar de forma simples; parâmetros são chamados de knobs no Nuke.'),
      T('Mirror', 'Flipar na horizontal ou vertical (o Reformat também faz).'),
      T('CornerPin', 'Ajustar a perspectiva movendo os 4 vértices.'),
      T('Crop e Reformat', 'Cortar as bordas e mudar o tamanho para o formato do projeto.'),
      E('Exercício', 'Encaixar uma foto em perspectiva sobre outra com CornerPin e animar a entrada com Transform.') ] },
    'nk101-a10': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Usar desfoque sem estragar o recorte.', passos: [
      T('Atalho B e principais nodes', 'Os blurs mais usados e para que serve cada um.'),
      T('Exemplos', 'Repare nas cores dos nodes: eles também desfocam o recorte, ou seja, mexem no alpha.'),
      E('Exercício', 'Brincar e testar cada blur nas imagens do projeto e anotar o que cada um faz.') ] },
    'nk101-a11': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Falar a língua da cor e usar os nodes de cor com intenção.', passos: [
      T('Termos de composição das cores', 'Contrast, Saturation, Hue e Lift, com exemplos.'),
      T('Termos de color grading', 'Gain/Multiply, Gamma, Whitepoint, Blackpoint e Lift.'),
      T('Relação Gamma e Ganho', 'O Gamma mexe nos meios-tons; o Gain mexe mais nas altas luzes.'),
      E('Exercício', 'Casar a cor de uma foto com outra usando só Grade e ColorCorrect.') ] },
    'nk101-a12': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Criar e copiar alphas com segurança.', passos: [
      T('Principais nodes', 'Os nodes de alpha e de clone do backdrop, um por um.'),
      T('Atalhos', 'Os atalhos do backdrop para trabalhar mais rápido.'),
      E('Exercício', 'Levar o alpha de uma imagem para outra e limpar uma área com clone.') ] },
    'nk101-a13': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Entender o premult, a base de toda borda bem feita.', passos: [
      T('Premult explicado', 'O que acontece com o RGB quando multiplicamos pelo alpha.'),
      T('A matemática do premult', 'A conta por trás, com os exemplos do backdrop.'),
      T('Concatenação', 'O grade fica antes do premult; nunca inverta essa ordem.'),
      T('Por que isso importa', 'No cinema a tela é gigante: borda integrada é metade da integração; ajuste bordas numa imagem não pré-multiplicada.'),
      E('Exercício', 'Corrigir a borda de um recorte refazendo a ordem grade → premult e comparar antes e depois.') ] },
    'nk101-a14': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Primeiro recorte de fundo com Keyer.', passos: [
      T('Uso do Keyer', 'Como o Keyer gera o matte a partir da luminância ou de um canal.'),
      T('Refinar o matte', 'Juntar e limpar mattes, e cuidar das bordas.'),
      T('Composição', 'Premult e Merge sobre o novo fundo.'),
      E('Exercício', 'Recortar um elemento do shot e colocar sobre uma das fotos do projeto.') ] },
    'nk101-a15': { fonte: 'Tirado dos backdrops e notas do Projeto_aulas_v03.nknc', objetivo: 'Criar elementos do zero para dar vida ao plano.', passos: [
      T('Noise', 'Funciona como no After: chuva, poeira e atmosfera; exemplos de onda solar e chuva simples.'),
      T('LightWrap', 'Iluminar as bordas para integrar o elemento ao fundo.'),
      T('VolumeRays', 'Godrays para cenas de alto impacto; procure referências.'),
      E('Exercício', 'Juntar tudo: compor um elemento num fundo com LightWrap e criar uma atmosfera com Noise ou VolumeRays.') ] },
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
