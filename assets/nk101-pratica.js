/* Fosfena · NK101 · gerado por gerar_pratica.py a partir das transcrições das aulas.
   Trechos (in/out) em segundos do vídeo de cada aula. Não edite à mão: rode o script de novo. */
/* Arquivo de vídeo de cada aula. Quando houver hospedagem, coloque a URL aqui (ex.: 'https://.../nk101-aula01.mp4').
   Com URL, o player da aula toca o vídeo real e o botão de dúvida abre o mesmo arquivo com #t=in,out. */
window.FOS_VIDEOS = window.FOS_VIDEOS || { 'aula-1': 'https://youtu.be/fFZRUfEX49o', 'aula-2': 'https://youtu.be/ivaORAiMvq8', 'aula-3': null, 'aula-4': null };
// Onde a aula começa de verdade em cada vídeo do YouTube. A aula 01 foi enviada com a vinheta antiga (a da mãozinha) embutida
// nos primeiros 1,73 s; como a vinheta agora roda no site, o vídeo entra logo depois dela. Se a aula for reenviada sem vinheta, apague a linha.
window.FOS_VIDEO_INICIO = { 'aula-1': 1.75 };
window.FOS_PROVAS = {
 "aula-1": [
  {
   "q": "Qual licença do Nuke a gente usa durante o curso?",
   "o": [
    "Nuke Indie",
    "Nuke Non-commercial",
    "NukeX",
    "Nuke Studio"
   ],
   "a": 1,
   "why": "A Non-commercial é gratuita: dá para aprender tudo sem pagar pela ferramenta.",
   "duvida": {
    "in": 37,
    "out": 65,
    "txt": "Bom, antes da gente mostrar como que é o Nuke, como que ele funciona, essas coisas, eu preciso falar um pouquinho mais sobre como é que vai ser esse curso, né? Bom, a gente vai iniciar aprendendo a utilizar a licença não comercial do Nuke, a gente vai trabalhar durante todo o curso, e aí assim que você estiver…"
   }
  },
  {
   "q": "Qual empresa faz o Nuke e onde você baixa?",
   "o": [
    "Adobe, na Creative Cloud",
    "Foundry, no site oficial (busque Foundry Nuke)",
    "Blackmagic, na loja da Microsoft",
    "Autodesk, no site deles"
   ],
   "a": 1,
   "why": "A Foundry é a empresa do Nuke. Busque “Foundry Nuke” e entre no site oficial.",
   "duvida": {
    "in": 127,
    "out": 140,
    "txt": "Bom, você vem no Google, qualquer navegador aí que você tiver, procura por Foundry Nuke, tá? Foundry é a empresa que faz o Nuke e Nuke é o software que a gente vai trabalhar aí durante toda essa jornada do curso, tá bom? Então você entra aqui no site, a gente já é redirecionado nesse link aqui, onde a gente já fala,…"
   }
  },
  {
   "q": "A licença não ativou de primeira. O que fazer?",
   "o": [
    "Reinstalar o Windows",
    "Voltar ao site e clicar em Try Now de novo",
    "Comprar a Indie",
    "Esperar uma semana"
   ],
   "a": 1,
   "why": "O site gera a licença de novo. Se ainda der problema, fale com o suporte.",
   "duvida": {
    "in": 208,
    "out": 231,
    "txt": "E aí, você pega o seu trial. É, eles vão te mandar um e-mail pra você validar a sua conta. E aí, se, é, deveria pro o seu Nuke já ser ativado de primeira, tá? Se ele der algum problema, você volta lá no site, dá um Try, é, Try Now. Aí, ele te dá a licença novamente, tá bom? Aí, se, se você tiver algum problema, você…"
   }
  }
 ],
 "aula-2": [
  {
   "q": "Quais são os três painéis principais do Nuke?",
   "o": [
    "Viewer, Node Graph e Properties",
    "Timeline, Layers e Effects",
    "Dope Sheet, Curve Editor e Viewer",
    "Scene Graph, Background Renderers e Viewer"
   ],
   "a": 0,
   "why": "Viewer para ver, Node Graph para trabalhar e Properties para ajustar os parâmetros.",
   "duvida": {
    "in": 276,
    "out": 341,
    "txt": "O Nuke, ele basicamente se divide em três painéis, tá? Basicamente. Lógico que ele tem mais painéis. Só que ele basicamente se consiste, né? Em três painéis. O painel do Viewer, tá? Que é esse painelzão aqui que eu tô desenhando dentro desse quadrado. O painel do Node Graph, que é onde a gente cria os nossos efeitos,…"
   }
  },
  {
   "q": "Você aumentou o gain (ganho) no Viewer. O que acontece com o render?",
   "o": [
    "Sai mais claro também",
    "Nada: o gain do Viewer só muda a visualização",
    "Fica em preto e branco",
    "Fica com metade da resolução"
   ],
   "a": 1,
   "why": "Gain, gamma e saturação do Viewer mudam só como você vê, não o que é renderizado.",
   "duvida": {
    "in": 644,
    "out": 673,
    "txt": "Esses aqui são informações de como você visualiza o que você está visualizando, né? Então assim, aqui eu posso aumentar o ganho do que eu tô visualizando. Então às vezes a imagem tá muito escurinha e eu quero deixar ela mais clara. Mas não necessariamente eu quero renderizar ela mais clara. Eu só quero visualizar ela…"
   }
  },
  {
   "q": "Com o mouse no Node Graph você aperta S. O que abre?",
   "o": [
    "As preferências do Viewer",
    "Os Project Settings (preferências do projeto)",
    "O painel de salvar",
    "O Scene Graph"
   ],
   "a": 1,
   "why": "O atalho muda conforme onde está o mouse: S no Viewer abre as opções do Viewer, S no Node Graph abre o projeto.",
   "duvida": {
    "in": 1055,
    "out": 1101,
    "txt": "Algumas dicas para vocês. Muito cuidado em onde você está com o mouse quando você executa os comandos, tá? Um dos comandos aqui que a gente usa bastante é o Tab. Se eu vier com o Tab aqui no NodeGraph, ele vai abrir os meus painéis de nodes, né? Quantos nodes eu tenho, etc. Agora, se eu vier, se eu tiver com o mouse…"
   }
  }
 ],
 "aula-3": [
  {
   "q": "Por que usar o FrameHold depois do RotoPaint?",
   "o": [
    "Para acelerar o render",
    "Porque a pintura só vale no frame em que foi feita, então congelamos esse frame",
    "Para estabilizar a câmera",
    "Para trocar o fps"
   ],
   "a": 1,
   "why": "Você pinta uma vez no frame 101 e o FrameHold segura esse frame durante toda a sequência.",
   "duvida": {
    "in": 1137,
    "out": 1178,
    "txt": "é, o RotoPaint ele tem um único probleminha que ele, se eu colocar qualquer outro frame ó, ele sai tá vendo? então ele só funciona a nossa pintura neste frame que eu tô usando tá vendo? então, eu posicionei, tá tudo limpinho, tá bonitinho eu vou chegar aqui no RotoPaint selecionar ele vou apertar a tecla tab eu vou…"
   }
  },
  {
   "q": "Você pintou no frame 101. Qual deve ser o reference frame do tracker?",
   "o": [
    "1",
    "50",
    "101",
    "Tanto faz"
   ],
   "a": 2,
   "why": "O reference frame precisa ser o frame da pintura, senão o patch descasa do movimento.",
   "duvida": {
    "in": 1293,
    "out": 1337,
    "txt": "eu vou chegar aqui no último frame e eu vou somente conferir, tá? é... o frame que eu holdei que tá feita a pintura é o 101 e o frame de referência é o 101 o que é esse frame de referência? é um conceito um pouco chato um pouco difícil de pegar de primeira mas é que, a partir deste frame que ele faz a alteração de…"
   }
  },
  {
   "q": "O Transform MatchMove ainda escorrega mesmo com mais pontos. Qual node resolve?",
   "o": [
    "Blur",
    "CornerPin",
    "Reformat",
    "Grade"
   ],
   "a": 1,
   "why": "A placa se dobra em perspectiva. Com 4 pontos, o CornerPin distorce o patch de forma planar.",
   "duvida": {
    "in": 2017,
    "out": 2140,
    "txt": "Bom, pessoal, fiz a adição aqui dos pontos. Só que mesmo assim, mesmo fazendo os pontos, ele chega até a aproximar um pouquinho, né? Ele aproxima... Parece que ele aproxima, não sei se é placebo. Mas parece que ele aproxima um pouquinho, mas ele ainda não está ficando perfeito. Acontece talvez porque é um planar, mas…"
   }
  }
 ],
 "aula-4": [
  {
   "q": "O footage é 4096 × 2160 e o projeto é HD. Qual node adapta a imagem?",
   "o": [
    "Transform",
    "Reformat",
    "Crop",
    "Grade"
   ],
   "a": 1,
   "why": "O Reformat leva a imagem para o formato do projeto, sem repetir o erro da aula passada.",
   "duvida": {
    "in": 119,
    "out": 149,
    "txt": "É... Ajeitar aqui, ó, full size format, vou colocar HD 1080p. E agora eu não vou cometer o erro da aula passada. A gente vai precisar, como essa filmagem aqui tá em 4096x2160, a gente precisa reformatar essa imagem. Então... Coloca aqui reformat. E aí, aqui, você pode trocar de width para height, tá? E pronto. Nossa…"
   }
  },
  {
   "q": "Qual operation do Keyer usar numa tela verde?",
   "o": [
    "Luminance Key",
    "Green Screen (ou Greenscreen Keyer)",
    "Red Keyer",
    "Saturation Key"
   ],
   "a": 1,
   "why": "Por padrão o Keyer usa luminância. Na tela verde, troque a operation para identificar pelo canal verde.",
   "duvida": {
    "in": 243,
    "out": 286,
    "txt": "Bom, eu vou tirar de... Ele tá operando, né? Ele tá identificando esse alfa, né? O que que ele mantém, o que que ele remove, através da luminância. O quão claro alguma coisa está. Mas não é isso que a gente precisa fazer aqui. A gente precisa recortar. A gente precisa fazer essa identificação através do canal verde,…"
   }
  },
  {
   "q": "Ficou uma borda esverdeada no recorte (spill). Qual node usamos para tirar?",
   "o": [
    "HueCorrect, abaixando o g_suppress",
    "Blur",
    "Reformat",
    "Merge em plus"
   ],
   "a": 0,
   "why": "O spill é o verde que vaza para as bordas. No HueCorrect você suprime o verde (g_suppress), com máscara só na tela.",
   "duvida": {
    "in": 575,
    "out": 680,
    "txt": "ele é chamado... Ele é chamado de Spill. É como se a gente fez o recorte, tá em cima do tom de verde, tá tudo certinho. Só que a cor verde, ela é uma das cores mais vibrantes dentro do espectro visível. E acontece que quando a gente usa ela pra tela, essas coisas é muito comum. O azul também acontece, mas é muito…"
   }
  }
 ]
};
// Prática: a aula 01 (instalação) não tem.
window.FOS_PRATICA = {
 "aula-2": [
  {
   "id": "a2-paineis",
   "etapa": "Painéis",
   "tipo": "escolha",
   "titulo": "Onde você trabalha?",
   "enunciado": "Você vai criar e conectar nodes. Em qual painel faz isso?",
   "opcoes": [
    "Viewer",
    "Node Graph",
    "Properties",
    "Dope Sheet"
   ],
   "certo": 1,
   "ok": "Isso. O Node Graph serve para trabalhar, o Viewer para ver e o Properties para ajustar.",
   "duvida": {
    "in": 276,
    "out": 341,
    "txt": "O Nuke, ele basicamente se divide em três painéis, tá? Basicamente. Lógico que ele tem mais painéis. Só que ele basicamente se consiste, né? Em três painéis. O painel do Viewer, tá? Que é esse painelzão aqui que eu tô desenhando dentro desse quadrado. O painel do Node Graph, que é onde a gente cria os nossos efeitos,…"
   }
  },
  {
   "id": "a2-viewer",
   "etapa": "Viewer",
   "tipo": "escolha",
   "titulo": "Ver mais claro sem mudar o render",
   "enunciado": "A imagem está escura e você só quer enxergar melhor, sem mudar o render. O que você mexe?",
   "opcoes": [
    "Um Grade no Node Graph",
    "O gain do Viewer",
    "O fps do projeto",
    "O formato no Project Settings"
   ],
   "certo": 1,
   "ok": "Certo. Gain, gamma e saturação do Viewer mudam só a visualização.",
   "duvida": {
    "in": 635,
    "out": 673,
    "txt": "Deixa eu fazer um quadradinho bonitinho. Esses aqui são informações de como você visualiza o que você está visualizando, né? Então assim, aqui eu posso aumentar o ganho do que eu tô visualizando. Então às vezes a imagem tá muito escurinha e eu quero deixar ela mais clara. Mas não necessariamente eu quero renderizar…"
   }
  },
  {
   "id": "a2-layout",
   "etapa": "Layout",
   "tipo": "escolha",
   "titulo": "Deixar o Nuke trabalhável",
   "enunciado": "Qual atalho organiza a interface no layout Large Viewer?",
   "opcoes": [
    "Shift + F3",
    "Alt + H",
    "Ctrl + S",
    "Tab"
   ],
   "certo": 0,
   "ok": "Isso. E em Preferences (Shift + S) > Startup Workspace você deixa o Large Viewer como padrão.",
   "duvida": {
    "in": 904,
    "out": 1036,
    "txt": "Antes de fechar essa videoaula, eu queria passar aqui com vocês para a gente configurar o Nuke de uma forma que ele fique trabalhável, tá? Eu tenho alguns... Spaces aqui que eu uso. Mas o que eu vou ensinar para vocês? Existe um atalho, que ele é o seguinte. É o Shift F3. Quando você clica ele, ele já vai reorganizar…"
   }
  },
  {
   "id": "a2-mouse",
   "etapa": "Atalhos",
   "tipo": "escolha",
   "titulo": "Cuidado com o mouse",
   "enunciado": "Você apertou Tab com o mouse em cima do Viewer. O que acontece?",
   "opcoes": [
    "Abre a busca de nodes",
    "O Viewer vai para o ambiente 3D",
    "Salva o projeto",
    "Nada"
   ],
   "certo": 1,
   "ok": "Isso. No Node Graph o Tab abre a busca de nodes; no Viewer, ele troca para o 3D.",
   "dica": "O mesmo atalho faz coisas diferentes conforme o painel em que está o mouse.",
   "duvida": {
    "in": 1055,
    "out": 1101,
    "txt": "Algumas dicas para vocês. Muito cuidado em onde você está com o mouse quando você executa os comandos, tá? Um dos comandos aqui que a gente usa bastante é o Tab. Se eu vier com o Tab aqui no NodeGraph, ele vai abrir os meus painéis de nodes, né? Quantos nodes eu tenho, etc. Agora, se eu vier, se eu tiver com o mouse…"
   }
  },
  {
   "id": "a2-props",
   "etapa": "Properties",
   "tipo": "escolha",
   "titulo": "Painéis de propriedades abertos",
   "enunciado": "Quantos painéis de propriedades o Maurício recomenda deixar abertos ao mesmo tempo?",
   "opcoes": [
    "1",
    "2",
    "10",
    "Ilimitado"
   ],
   "certo": 0,
   "ok": "Isso. Com 1, só aparece o node que você está mexendo.",
   "duvida": {
    "in": 1111,
    "out": 1171,
    "txt": "Esse carinha aqui, tá? O que ele é? Ele é... Deu, deve estar configurado aí como 10. Configura ele para 1, pelo amor de Deus. Isso aí é basicamente quantos nodes você consegue selecionar ao mesmo tempo. Então, se ele tem 10, eu posso ter vários nodes aqui, ó. Que ali, ele vai aparecer uma enxurrada, ó. Eu vou criando…"
   }
  }
 ],
 "aula-3": [
  {
   "id": "a3-projeto",
   "etapa": "Projeto",
   "tipo": "ordem",
   "titulo": "Preparar o projeto",
   "enunciado": "Antes de apagar a placa, deixe o script pronto. Clique na ordem.",
   "itens": [
    "Arrastar o ftg.mov para o Node Graph (vira um Read)",
    "Apertar S com o mouse no Node Graph",
    "Colocar 24 fps e criar o formato Vertical 1080 × 1920",
    "Salvar com Ctrl + S em nuke/script como aula03_v01"
   ],
   "duvida": {
    "in": 180,
    "out": 254,
    "txt": "O que você precisa fazer? Quais são os primeiros passos pra gente começar a fazer qualquer coisa aqui no Nuke? A gente precisa entrar nos Project Settings, né? A gente precisa configurar o nosso projeto. Pra gente fazer isso, eu venho com o mouse no Node Graph e aperto a tecla S, de salsicha. Você vem e identifica…"
   }
  },
  {
   "id": "a3-pintar",
   "etapa": "Pintar",
   "tipo": "grafo",
   "titulo": "Pintar e congelar o frame",
   "enunciado": "Ligue o footage até o FrameHold: a imagem passa por um Dot, vai para o RotoPaint e o resultado é congelado. Um node sobra.",
   "nodes": [
    {
     "id": "read",
     "label": "Read",
     "x": 40,
     "y": 30,
     "ins": [],
     "cor": "#E0A84E"
    },
    {
     "id": "dot",
     "label": "Dot",
     "x": 40,
     "y": 130
    },
    {
     "id": "rp",
     "label": "RotoPaint",
     "x": 260,
     "y": 130
    },
    {
     "id": "fh",
     "label": "FrameHold",
     "x": 480,
     "y": 230
    },
    {
     "id": "grade",
     "label": "Grade",
     "x": 480,
     "y": 30
    }
   ],
   "certo": [
    "read>dot",
    "dot>rp",
    "rp>fh"
   ],
   "h": 300,
   "dica": "O RotoPaint pinta sobre a imagem e o FrameHold segura o frame pintado.",
   "duvida": {
    "in": 1127,
    "out": 1178,
    "txt": "terminou de limpar agora a gente precisa fazer com que isso daqui se mantenha no vídeo e no mesmo movimento, tá bom? é, o RotoPaint ele tem um único probleminha que ele, se eu colocar qualquer outro frame ó, ele sai tá vendo? então ele só funciona a nossa pintura neste frame que eu tô usando tá vendo? então, eu…"
   }
  },
  {
   "id": "a3-quina",
   "etapa": "Tracker",
   "tipo": "escolha",
   "titulo": "Onde colocar o ponto de track?",
   "enunciado": "Você vai trackear a placa. Que tipo de ponto escolhe?",
   "opcoes": [
    "Uma área lisa, sem detalhe",
    "Uma quina bem definida",
    "O centro do letreiro",
    "Qualquer lugar"
   ],
   "certo": 1,
   "ok": "Isso. A caixa de dentro é o que ele procura; a de fora, onde ele procura.",
   "duvida": {
    "in": 1193,
    "out": 1265,
    "txt": "perfeito, ó Tracker é, com o nosso Tracker a gente vai selecionar aqui algum ponto, né? é, sempre que a gente vai selecionar ponto assim, Tracker, etc a gente precisa escolher ponto assim, com quinas eu não posso chegar aqui e o Tracker pra pegar essa área, por exemplo eu preciso pegar uma quina, tipo essa tá bom?…"
   }
  },
  {
   "id": "a3-ref",
   "etapa": "Reference frame",
   "tipo": "escolha",
   "titulo": "Qual é o reference frame?",
   "enunciado": "Você pintou o clean plate no frame 101. Qual reference frame o tracker precisa usar?",
   "opcoes": [
    "1",
    "50",
    "100",
    "101"
   ],
   "certo": 3,
   "ok": "Isso. O reference frame é sempre o frame da pintura.",
   "duvida": {
    "in": 1293,
    "out": 1337,
    "txt": "eu vou chegar aqui no último frame e eu vou somente conferir, tá? é... o frame que eu holdei que tá feita a pintura é o 101 e o frame de referência é o 101 o que é esse frame de referência? é um conceito um pouco chato um pouco difícil de pegar de primeira mas é que, a partir deste frame que ele faz a alteração de…"
   }
  },
  {
   "id": "a3-mask",
   "etapa": "Recortar",
   "tipo": "grafo",
   "titulo": "Recortar só a área pintada",
   "enunciado": "Com o Merge em operation mask, o patch fica só onde a Roto desenhou. Ligue A e B do Merge (mask).",
   "nodes": [
    {
     "id": "fh",
     "label": "FrameHold",
     "x": 40,
     "y": 40
    },
    {
     "id": "roto",
     "label": "Roto",
     "x": 300,
     "y": 40,
     "ins": []
    },
    {
     "id": "mg",
     "label": "Merge (mask)",
     "x": 170,
     "y": 190,
     "ins": [
      "B",
      "A"
     ]
    }
   ],
   "certo": [
    "fh>mg:0",
    "roto>mg:1"
   ],
   "h": 260,
   "dica": "A imagem pintada vai no B e a Roto, que é a máscara, vai no A.",
   "duvida": {
    "in": 1537,
    "out": 1597,
    "txt": "Eu vou lá no frame 101, visualizo e agora eu preciso entender. Por que? Porque eu fiz isso aqui, eu tirei o Madison AV, só que eu preciso tirar somente o Madison AV. Então eu vou precisar fazer uma máscara aqui. Aqui eu vou fazer a máscara da forma mais simples, que é com o Merge. E a gente vai colocar a operação dele…"
   }
  },
  {
   "id": "a3-clip",
   "etapa": "Formato",
   "tipo": "escolha",
   "titulo": "A Roto ficou toda preta",
   "enunciado": "O projeto está em HD e a imagem em 4K. No Merge mask a Roto ficou preta. O que você ajusta na Roto?",
   "opcoes": [
    "Clip To: no clip",
    "Opacity: 0",
    "Output: rgb",
    "Lifetime: single frame"
   ],
   "certo": 0,
   "ok": "Isso. Com o Clip To em no clip, a Roto deixa de ser cortada pelo formato do projeto.",
   "duvida": {
    "in": 1627,
    "out": 1681,
    "txt": "Só que aqui aconteceu uma coisa que é muito comum de acontecer aqui. Foi um erro aqui que eu mesmo cometi de tanto tempo que eu configuro o projeto automático. O nosso projeto está em Full HD, só que a nossa imagem está em 4K. Tá? O que é um problema. Então, quando a gente faz a Roto e ela fica preta assim com o Mask,…"
   }
  },
  {
   "id": "a3-over",
   "etapa": "Juntar",
   "tipo": "grafo",
   "titulo": "Colocar o patch por cima",
   "enunciado": "O patch passa pelo CornerPin para seguir o movimento e vai por cima (over) da imagem original. Depois, render no Write.",
   "nodes": [
    {
     "id": "patch",
     "label": "Merge (mask)",
     "x": 40,
     "y": 30
    },
    {
     "id": "cp",
     "label": "CornerPin",
     "x": 40,
     "y": 130
    },
    {
     "id": "dot",
     "label": "Dot original",
     "x": 300,
     "y": 30
    },
    {
     "id": "mg",
     "label": "Merge (over)",
     "x": 200,
     "y": 230,
     "ins": [
      "B",
      "A"
     ]
    },
    {
     "id": "wr",
     "label": "Write",
     "x": 440,
     "y": 230
    }
   ],
   "certo": [
    "patch>cp",
    "cp>mg:1",
    "dot>mg:0",
    "mg>wr"
   ],
   "h": 320,
   "dica": "Over é A por cima de B: o patch no A, a imagem original no B.",
   "duvida": {
    "in": 1403,
    "out": 1490,
    "txt": "Agora eu preciso pegar essa imagem que eu pintei, que está seguindo o movimento, e colocar ela em cima (over) da imagem original. A gente faz isso com o Merge, atalho M. Eu conecto o A no Transform MatchMove e o B no pontinho, na imagem original."
   }
  },
  {
   "id": "a3-cornerpin",
   "etapa": "Planar",
   "tipo": "escolha",
   "titulo": "O patch ainda escorrega",
   "enunciado": "Você trackeou 4 pontos, mas o Transform MatchMove ainda descola porque a placa se dobra em perspectiva. Qual node usar?",
   "opcoes": [
    "Blur",
    "CornerPin",
    "FrameHold",
    "Reformat"
   ],
   "certo": 1,
   "ok": "Isso. O CornerPin usa os 4 pontos e distorce o patch de forma planar.",
   "duvida": {
    "in": 2017,
    "out": 2140,
    "txt": "Bom, pessoal, fiz a adição aqui dos pontos. Só que mesmo assim, mesmo fazendo os pontos, ele chega até a aproximar um pouquinho, né? Ele aproxima... Parece que ele aproxima, não sei se é placebo. Mas parece que ele aproxima um pouquinho, mas ele ainda não está ficando perfeito. Acontece talvez porque é um planar, mas…"
   }
  }
 ],
 "aula-4": [
  {
   "id": "a4-reformat",
   "etapa": "Formato",
   "tipo": "grafo",
   "titulo": "Entrar no formato do projeto",
   "enunciado": "O footage é 4096 × 2160 e o projeto é HD. Ligue Read, Reformat e Dot, e leve a imagem para o Keyer. Um node sobra.",
   "nodes": [
    {
     "id": "read",
     "label": "Read",
     "x": 40,
     "y": 30,
     "ins": [],
     "cor": "#E0A84E"
    },
    {
     "id": "rf",
     "label": "Reformat",
     "x": 40,
     "y": 130
    },
    {
     "id": "dot",
     "label": "Dot",
     "x": 260,
     "y": 130
    },
    {
     "id": "key",
     "label": "Keyer",
     "x": 480,
     "y": 230
    },
    {
     "id": "tr",
     "label": "Transform",
     "x": 480,
     "y": 30
    }
   ],
   "certo": [
    "read>rf",
    "rf>dot",
    "dot>key"
   ],
   "h": 300,
   "dica": "O Reformat vem logo depois do Read.",
   "duvida": {
    "in": 119,
    "out": 208,
    "txt": "É... Ajeitar aqui, ó, full size format, vou colocar HD 1080p. E agora eu não vou cometer o erro da aula passada. A gente vai precisar, como essa filmagem aqui tá em 4096x2160, a gente precisa reformatar essa imagem. Então... Coloca aqui reformat. E aí, aqui, você pode trocar de width para height, tá? E pronto. Nossa…"
   }
  },
  {
   "id": "a4-operation",
   "etapa": "Keyer",
   "tipo": "escolha",
   "titulo": "Furar a tela verde",
   "enunciado": "O Keyer está identificando pela luminância. Para a tela verde, qual operation você escolhe?",
   "opcoes": [
    "Luminance Key",
    "Green Screen",
    "Red Keyer",
    "Saturation Key"
   ],
   "certo": 1,
   "ok": "Isso. Depois é puxar os controles: o de baixo escurece, o de cima clareia.",
   "duvida": {
    "in": 224,
    "out": 286,
    "txt": "E aí a gente pode apertar A, né? Tecla A do teclado com o mouse aqui no NodeGraph. Aqui é onde ele vai... Mostrar o nosso canal de alfa. O que que a gente tá mantendo e o que que a gente tá tirando. Tudo que tá em branco, a gente mantém. Tudo que tá em preto, a gente remove, tá bom? Bom, eu vou tirar de... Ele tá…"
   }
  },
  {
   "id": "a4-matte",
   "etapa": "Matte",
   "tipo": "grafo",
   "titulo": "Limpar a matte com uma Roto",
   "enunciado": "A Roto em volta do celular é invertida e somada à matte do Keyer. Depois a matte é erodida e ganha um Blur leve.",
   "nodes": [
    {
     "id": "key",
     "label": "Keyer",
     "x": 40,
     "y": 30
    },
    {
     "id": "roto",
     "label": "Roto",
     "x": 300,
     "y": 30,
     "ins": []
    },
    {
     "id": "inv",
     "label": "Invert",
     "x": 300,
     "y": 120
    },
    {
     "id": "mg",
     "label": "Merge",
     "x": 170,
     "y": 210,
     "ins": [
      "B",
      "A"
     ]
    },
    {
     "id": "er",
     "label": "FilterErode",
     "x": 400,
     "y": 210
    },
    {
     "id": "bl",
     "label": "Blur",
     "x": 400,
     "y": 300
    }
   ],
   "certo": [
    "key>mg:0",
    "roto>inv",
    "inv>mg:1",
    "mg>er",
    "er>bl"
   ],
   "h": 360,
   "dica": "A matte do Keyer vai no B, a Roto invertida no A.",
   "duvida": {
    "in": 1061,
    "out": 1170,
    "txt": "É... Bom... O que que a gente precisa fazer? O que a gente precisa fazer pra resolver isso? O Keyer... Eu posso fazer qualquer Keyer aqui. Existem algumas técnicas que vão ajudar. Mas posso tacar qualquer Keyer aqui, cara, que não vai ficar perfeito. Tá? O jeito seria fazer uma máscara. A mesma... A mesma técnica que…"
   }
  },
  {
   "id": "a4-copy",
   "etapa": "Recorte",
   "tipo": "grafo",
   "titulo": "Copy e Premult",
   "enunciado": "O Copy leva o alpha da matte para a imagem original e o Premult faz o alpha recortar o RGB.",
   "nodes": [
    {
     "id": "matte",
     "label": "Matte (Blur)",
     "x": 40,
     "y": 30
    },
    {
     "id": "dot",
     "label": "Imagem (Dot)",
     "x": 300,
     "y": 30
    },
    {
     "id": "cp",
     "label": "Copy",
     "x": 170,
     "y": 140,
     "ins": [
      "B",
      "A"
     ]
    },
    {
     "id": "pm",
     "label": "Premult",
     "x": 170,
     "y": 240
    }
   ],
   "certo": [
    "matte>cp:1",
    "dot>cp:0",
    "cp>pm"
   ],
   "h": 310,
   "dica": "No Copy, o A recebe quem tem o alpha (a matte) e o B a imagem.",
   "duvida": {
    "in": 420,
    "out": 537,
    "txt": "E aí depois você investiga como que ele tá funcionando, tá bom? Eu vou selecionar aqui o Keyer, vou apertar a tecla K pra criar o nosso Copy, tá? O atalho dele é a letra K. Eu vou linkar o A no Keyer e o B aqui nesse pontinho de antes, tá bom? Bom, eu tava visualizando o Alpha, eu deixei a minha tela preta e o resto…"
   }
  },
  {
   "id": "a4-spill",
   "etapa": "Spill",
   "tipo": "escolha",
   "titulo": "Bordas esverdeadas",
   "enunciado": "O recorte ficou bom, mas sobrou verde nas bordas (spill). Qual node usar?",
   "opcoes": [
    "HueCorrect (g_suppress)",
    "Blur",
    "Grade",
    "Reformat"
   ],
   "certo": 0,
   "ok": "Isso. E ligue a máscara dele na matte (invertida) para agir só na tela.",
   "duvida": {
    "in": 575,
    "out": 680,
    "txt": "ele é chamado... Ele é chamado de Spill. É como se a gente fez o recorte, tá em cima do tom de verde, tá tudo certinho. Só que a cor verde, ela é uma das cores mais vibrantes dentro do espectro visível. E acontece que quando a gente usa ela pra tela, essas coisas é muito comum. O azul também acontece, mas é muito…"
   }
  },
  {
   "id": "a4-under",
   "etapa": "Fundo",
   "tipo": "escolha",
   "titulo": "Imagem nova atrás da tela",
   "enunciado": "O CheckerBoard precisa aparecer atrás do celular recortado. Qual operation do Merge?",
   "opcoes": [
    "over",
    "under",
    "mask",
    "plus"
   ],
   "certo": 1,
   "ok": "Isso. Under coloca o A embaixo do B.",
   "duvida": {
    "in": 1275,
    "out": 1308,
    "txt": "E aí a gente pode colocar um checkerboard. Coloca aí. A gente vai colocar ele embaixo. Da nossa tela, né? Desse nosso recorte aqui. Então, na operação do nosso Node. Assim como a gente colocou Mask, né? Na videoaula passada. A gente vai colocar aqui em Under. Que é A embaixo de B. Under em inglês é embaixo, né? Então,…"
   }
  },
  {
   "id": "a4-seguir",
   "etapa": "Movimento",
   "tipo": "escolha",
   "titulo": "A imagem nova ficou parada",
   "enunciado": "O celular se mexe, mas o CheckerBoard ficou parado. O que você faz?",
   "opcoes": [
    "Cola uma cópia do Transform MatchMove do tracker no CheckerBoard",
    "Aumenta o Blur",
    "Troca o Merge para over",
    "Renderiza de novo"
   ],
   "certo": 0,
   "ok": "Isso. Para um encaixe perfeito, trackeie os 4 cantos e use CornerPin.",
   "duvida": {
    "in": 1386,
    "out": 1460,
    "txt": "Essa tela de celular. O único problema é que... O seu negócio tá movendo, né? O celular e a mask tá movendo. Só que o seu checkerboard aqui. Eu coloquei o Node checkerboard. Ele tá parado, né? Esse que é o grande do problema. Mas é fácil de resolver. Você copia aqui o Transform MatchMove. Cola ele, né? Aqui embaixo. E…"
   }
  }
 ]
};
