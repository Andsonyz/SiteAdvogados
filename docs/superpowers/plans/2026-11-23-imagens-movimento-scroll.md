# Imagens, entrada e rolagem

> Execução: superpowers:executing-plans, no checkout solicitado pelo usuário.

**Objetivo:** concluir a apresentação das imagens e o movimento dentro da identidade já aprovada, sem publicar.

**Direção:** preservar vinho/marfim, retrato e artes originais. A entrada será integrada ao conteúdo, breve e sem tela de espera. Dar legibilidade visual às artes e mostrar as três ilustrações antes de expandir detalhes. Personalizar a barra nativa e acrescentar uma linha de progresso abaixo do cabeçalho, sem controlar o gesto de rolagem.

**Diagnóstico reproduzido:** as imagens existentes respondem e decodificam, mas livros têm 77 × 38,5 px em 390 px; as novas ilustrações são montadas apenas em painéis fechados; Reveal ignora entradas quando delay é zero; não existe entrada da abertura.

**Decisões de implementação:** ajustes dentro do pedido atual e do plano aprovado; sem nova biblioteca, fatos profissionais ou alteração do retrato. Redução de movimento cancela as animações inclusive durante a sessão. Conteúdo continua disponível se o módulo Motion demorar.

- [x] 1. Regressão das três ilustrações visíveis e das entradas; executar testes antes da mudança.
- [x] 2. Ajustar Attendance, Artwork, Reveal, abertura e dimensões responsivas. Manter conteúdo complementar fechado por botão semântico.
- [x] 3. Acrescentar ScrollProgress, barra nativa vinho/marfim e entrada CSS breve. Progresso deve reagir a rotas, resize e expansão sem renderizações React por pixel.
- [x] 4. Build, suíte Chromium/WebKit, assets, inspeção e capturas em celular/tablet/desktop, estados e movimento reduzido. Revisão independente final e relatório com limites reais.

**Riscos para validar:** foco sem cobertura; primeira tela em 360 × 640; expansão alterando comprimento e progresso; navegação direta com hash; troca dinâmica de preferência de movimento; nenhuma imagem distorcida ou rolagem horizontal.

**Referências técnicas:** [Motion](https://motion.dev/docs/react-scroll-animations), [MDN scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-color).

**Registro de execução:** quatro testes iniciais falharam pelos comportamentos ausentes; depois foram adicionadas regressões para ampliação de texto e foco. A rodada final teve 74 testes aprovados. Build e três testes de assets passaram. Matriz de produção: 88 combinações sem falhas. Movimento reduzido: zero animações em execução nos quatro cenários inspecionados. Zoom real de 400%: quatro rotas sem overflow.

**Decisões após validação:** retirar a largura fixa da scrollbar, que consumia espaço no WebKit; deixar a ilustração ceder espaço ao texto ampliado por container query; concluir foco/scroll antes da pintura e evitar repetição no StrictMode, comparando key, pathname e hash. Os testes esperam a montagem e a rolagem observável do navegador. Auditorias passaram a rodar sequencialmente após esgotamento de memória em uma execução simultânea.

**Limites:** mediana Lighthouse 93; LCP de 3,17 s acima da meta de 2,5 s; sem teste físico, leitor de tela ou métricas em campo. Ver relatório de entrega.
