# Direção de Design — Adivinha o Ditado

## Três abordagens exploradas

### 1. Caderno de Provérbios
**Very Brief Intro:** Uma mesa de estudo contemporânea, inspirada em cadernos de notas e recortes de tipografia editorial. Torna cada ditado uma pequena descoberta linguística, com uma sensação calma e tátil.

**Probability:** 0.06

### 2. Estúdio de Palavras
**Very Brief Intro:** Uma estética de estúdio criativo com cartões tipográficos e detalhes gráficos de impressão. É energética sem ser infantil e faz da palavra em falta a protagonista visual.

**Probability:** 0.03

### 3. Azulejo Digital
**Very Brief Intro:** Um jogo luminoso que interpreta padrões geométricos de azulejaria portuguesa através de blocos, tons de azul e pequenos elementos ornamentais. A identidade é cultural, limpa e memorável.

**Probability:** 0.08

---

## Direção escolhida: Caderno de Provérbios

### Design Movement
Minimalismo editorial contemporâneo com referências subtis a um caderno de estudo e à tipografia de uma publicação literária.

### Core Principles
1. A palavra em falta é sempre o elemento de maior contraste e peso visual.
2. O progresso é comunicado com objetos familiares e inequívocos: pontos, vidas e estado do jogo.
3. Superfícies claras, textura discreta e margens generosas reduzem a carga visual.
4. A interface recompensa a atenção através de feedback curto, direto e caloroso.

### Color Philosophy
O marfim quente cria uma base de papel e evita o branco clínico. O carvão dá leitura editorial ao texto; o terracota, aplicado apenas em ações e estados de sucesso, transmite energia e conquista. O verde-oliva sinaliza progressos e respostas corretas sem competir com o conteúdo.

### Layout Paradigm
Uma composição vertical assimétrica, como uma página de caderno: cabeçalho compacto no topo, indicadores distribuídos em duas colunas e o provérbio como um grande bloco editorial com uma nota lateral. Em vez de cartões repetidos, a área central é uma folha única de leitura com uma linha de resposta integrada.

### Signature Elements
1. Linha de sublinhado terracota para materializar a palavra ausente.
2. Marcadores circulares de progresso desenhados como pontos de tinta.
3. Um pequeno monograma geométrico que combina aspas e um balão de fala.

### Interaction Philosophy
Cada ação deve parecer escrever uma resposta: foco nítido, botão com pressão breve e feedback explícito. A tecla Enter submete; os controlos permanecem grandes o suficiente para uso cómodo com o polegar.

### Animation
As transições têm duração entre 140 e 220 ms e usam um easing de saída firme. Ao acertar, o bloco do ditado eleva-se subtilmente e o indicador de pontuação atualiza; ao errar, o campo recebe um movimento curto lateral. As animações são desativadas para utilizadores que prefiram movimento reduzido.

### Typography System
**DM Serif Display** é usada para o provérbio e para a pontuação em destaque, preservando a dimensão literária. **DM Sans** serve para todos os controlos e metadados, com letras ligeiramente espaçadas em etiquetas. O provérbio usa escala fluida; as mensagens de estado mantêm uma escala menor e funcional.

### Brand Essence
**Adivinha o Ditado transforma provérbios em desafios rápidos para pessoas curiosas que gostam de brincar com a língua portuguesa.**

Personalidade: **curiosa**, **acolhedora**, **perspicaz**.

### Brand Voice
Os títulos soam como um convite inteligente; os CTAs são verbos curtos e claros; o microtexto celebra o raciocínio sem infantilizar o jogador.

Exemplos: “Completa o que a sabedoria começou.” e “A tua palavra fecha o ditado.”

### Wordmark & Logo
Um símbolo sem texto: duas aspas geométricas abertas que se unem a um pequeno traço inferior, sugerindo simultaneamente conversa, lacuna e sublinhado. O wordmark, quando escrito na interface, usa a combinação tipográfica definida, nunca uma fonte de sistema isolada.

### Signature Brand Color
**Terracota de Tinta — #C95337**. Um acento quente e próprio, usado em respostas, ações primárias e detalhes de descoberta.

## Style Decisions

- A área da palavra ausente, o campo de resposta e o botão de confirmação funcionam como um único gesto de escrita, com a terracota reservada para a descoberta e para a ação.
- O painel de jogo usa estrutura de folha de caderno: margem anotada, linhas discretas, pino de papel e notas laterais associadas a tinta, aspas e estudo.
- Elementos decorativos pertencem ao universo de papel, margens, tinta, aspas e sublinhados; nunca a ilustrações genéricas de produtividade.
- O lockup da marca comporta-se como uma pequena masthead editorial, combinando DM Serif Display, DM Sans e o símbolo de aspas-sublinhado.

## Revisão editorial — jornal impresso + digital

A interface passa a tratar o jogo como uma página de jornal contemporânea: regras horizontais, linha de edição, margens de anotação, masthead no rodapé e uma superfície mais plana substituem a sensação de cartão digital. A tecnologia aparece apenas onde é útil — campo de resposta, foco, estados e botão de verificação — enquanto a tipografia, o espaçamento e a textura preservam a leitura de papel.

A marginalia editorial é usada no desktop para transformar o espaço lateral em margem intencional; em ecrãs estreitos, a prioridade é manter o ditado e a ação de resposta claros, sem ruído ou scroll.
