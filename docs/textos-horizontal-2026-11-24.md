# Textos formais e rolagem horizontal — 24/11/2026

## Escopo e fonte dos textos

Referência fornecida: `2aafae9f-dce5-4170-b81f-35dec889082b.jpeg`, com 411 × 1600 px. A imagem foi examinada integralmente e por OCR local. Os títulos legíveis foram transcritos; o usuário autorizou reescrever os trechos ilegíveis com linguagem formal e profissional. Portanto, os parágrafos novos são uma adaptação editorial, não uma transcrição integral da imagem.

`src/data/site.ts` centraliza títulos, parágrafos, listas dos serviços, perguntas frequentes, contato, rodapé e os três princípios do atendimento. Permanecem os fatos confirmados: 10 anos de atuação, aposentadorias e BPC, atendimento online pelo WhatsApp e presencial em Mossoró/RN e região. OAB vazia, nenhum depoimento ou dado profissional inventado.

Os títulos da abertura, Sobre, áreas, atendimento, dúvidas e contato seguem a referência. A abertura foi recomposta para acomodar a nova frase sem afastar a fotografia e o primeiro contato no celular. A citação editorial no Sobre não representa depoimento de cliente.

As informações gerais sobre o BPC foram confrontadas com as fontes oficiais do [INSS](https://www.gov.br/inss/pt-br/noticias/como-pedir-beneficio-de-prestacao-continuada-bpc) e do [MDS](https://www.gov.br/mds/pt-br/acoes-e-programas/beneficio-de-prestacao-continuada-bpc/conheca-todos-os-detalhes-do-bpc). Não foram ampliados requisitos ou serviços profissionais.

## Experiência horizontal

`src/components/HorizontalJourney.tsx` apresenta três painéis ilustrados: Escuta antes da análise, Clareza em cada etapa e Acompanhamento próximo. São utilizadas artes existentes, com degradês vinho/marfim e tratamento cromático discreto. O retrato original não foi alterado.

- Desktop com espaço vertical suficiente: a rolagem da página percorre os painéis horizontalmente enquanto a seção permanece fixa temporariamente. Ao terminar, a leitura vertical continua.
- Celular, janela baixa ou movimento reduzido: rolagem horizontal nativa. Toque, arraste de mouse, botões e setas/Home/End do teclado permitem explorar os painéis.
- A seção não intercepta a roda ou o toque globalmente. Os serviços continuam completos na leitura vertical em celular e tablet.
- As imagens mantêm dimensões e versões responsivas. As animações existentes de abertura, seções e ilustrações foram preservadas.

A [referência Webflow](https://ix-horizontal-scroll.webflow.io/) foi aberta e inspecionada em Chromium. Foram aproveitados o percurso horizontal e a permanência temporária da seção, sem copiar sua identidade. Capturas: `output/formal-horizontal/reference/`. Apoio técnico: [scroll snap — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type) e [useScroll — Motion](https://motion.dev/docs/react-use-scroll).

## Correção da inicialização do Vite

O erro `memory allocation ... failed` foi reproduzido. Nas tentativas anteriores, o Windows chegou a apenas 230–280 MB de memória disponível até o limite de comprometimento. Também houve interrupção do PowerShell e dos navegadores. Portanto, aquelas execuções interrompidas não são evidência de aprovação.

Foram aplicadas duas reduções de trabalho: imports pelas entradas individuais oficiais do Lucide e limite inicial de duas threads em cada pool nativo de Rolldown/Rayon. O build passou de 2.502 para 486 módulos transformados. A configuração ocorre antes de importar o Vite, em `scripts/vite.mjs`; não é um aumento de heap do Node. As entradas individuais são documentadas pelo [Lucide](https://lucide.dev/guide/react/getting-started), e os controles dos pools nativos, pelo [Rolldown](https://github.com/rolldown/rolldown/blob/main/docs/guide/troubleshooting.md).

`npm run doctor` mostra o diagnóstico de memória. `npm run verify:dev` inicia um Vite isolado com `--force`, abre as três páginas, recarrega suas URLs e verifica erros e imagens. `npm run verify` reúne esse teste, os quatro testes do inicializador, TypeScript, build, os três testes da marca e os testes de navegador. O Playwright usa um worker por padrão.

O teste de inicialização foi aprovado depois de o Windows voltar a disponibilizar aproximadamente 3 GB ou mais até o limite de comprometimento. O projeto reduz consumo e detecta condições críticas; não pode garantir execução quando outros programas esgotam a memória do sistema. Nenhuma configuração do Windows foi alterada e nenhum aplicativo do usuário foi encerrado.

## Falhas encontradas e corrigidas

- ResizeObserver alterava o layout dentro de sua própria entrega de notificações. A medição passou para o próximo frame.
- O padding horizontal fazia Home parar a 4 px do início. O padding da faixa foi corrigido.
- Eventos gerados pela sincronização de scroll eram tratados como novas ações do usuário nos dois sentidos. Agora a origem das escritas é distinguida; isso também permite concluir a animação nativa acionada por Home/End.
- O redimensionamento usava a distância nova para verificar se a pessoa estava no percurso anterior. A posição é capturada antes de atualizar a geometria.
- O alinhamento inicial das âncoras ocorria antes da medição do cabeçalho e da expansão da seção. Os efeitos de navegação agora executam depois dos efeitos de layout da página.
- O teste antigo de avaliações vazias confundia a nova citação editorial com um depoimento. A verificação passou a usar o escopo da seção de avaliações.

A revisão independente encontrou os riscos de sincronização e redimensionamento antes da aprovação final. Os problemas foram corrigidos e os testes afetados foram repetidos.

## Evidências de validação local

| Critério | Resultado e evidência |
|---|---|
| Verificação integrada | Aprovada: `npm run verify`, com 84 testes de navegador, quatro do inicializador, três da marca, inicialização real do Vite, TypeScript e build. Log: `output/formal-horizontal/verify.log`. |
| Rolagem horizontal | Dez testes específicos aprovados nos dois motores. Avanço, retorno, Home/End, arraste, redução de movimento, redimensionamento e âncoras. Log: `horizontal-fixed.log`. |
| Matriz de produção | 88 cenários aprovados: quatro rotas × onze larguras × Chromium/WebKit. Sem overflow, imagens quebradas, distorção da marca, contatos incorretos, erros JavaScript ou falhas de contraste detectadas. Relatório: `after/report.json`. |
| Gestos | 15 verificações aprovadas no build de produção. Roda avança, sai da seção e retorna nos dois motores; botões por toque nos dois; gesto nativo horizontal e vertical por CDP no Chromium emulado. Relatório: `interactions/report.json`. |
| Texto e zoom | Texto a 200% aprovado na suíte; zoom real de 400% nas quatro rotas, com 315 CSS px úteis e sem overflow. Relatório: `zoom/report.json`. |
| Teclado e foco | Caso ampliado para percorrer todos os controles disponíveis, incluindo o rodapé. Os dois testes afetados foram repetidos e aprovados em `keyboard-complete-final.log`. No Chromium, links e botões são percorridos por Tab; no WebKit/Windows, os links recebem verificação de foco separada devido à preferência nativa descrita abaixo. |
| Acessibilidade automática | Axe sem violações detectadas nas quatro rotas e nos oito tamanhos definidos na suíte. Isso não é certificação integral de acessibilidade. |
| Contato e conteúdo | Número, mensagem codificada e destinos do WhatsApp preservados; Instagram correto; OAB vazia e oculta; nenhuma avaliação fictícia. Os testes não enviam mensagens. |
| Revisão visual | Capturas de 390, 768 e 1440 px examinadas, incluindo página inteira, retrato, painel horizontal e estados de menu, atendimento e FAQ. As outras larguras também foram medidas e capturadas na matriz. |

As onze larguras de produção são 320, 360, 375, 390, 412, 568, 639, 640, 768, 1024 e 1440 px. A suíte inclui paisagem 568 × 320. As versões 1×, 2× e 3× da marca e a seleção responsiva do retrato foram verificadas.

A primeira matriz de produção registrou dois erros de importação no WebKit durante substituições muito rápidas do documento. A instrumentação de rede confirmou `Load request cancelled` no módulo adiado de animações. A auditoria passou a aguardar o carregamento completo das requisições estáticas antes de substituir a página. Nenhum erro foi filtrado; a nova execução teve zero erros. Diagnóstico: `module-diagnostic.json`; resultado final: `production-matrix-final.log`.

O WebKit de automação no Windows omite links na navegação Tab por padrão. Essa preferência é discutida pelos [mantenedores do Playwright](https://github.com/microsoft/playwright/issues/5609). O teste não modifica a página para contornar a preferência: percorre os controles nativos e confirma separadamente que cada link pode receber foco visível. O atalho alternativo da discussão também foi experimentado, mas não incluiu os links nesta instalação Windows. Isso permanece uma diferença entre emulação e a conferência em Safari real.

## Desempenho em laboratório

Três execuções sequenciais de Lighthouse 13.6.0 sobre o build de produção local, em perfil mobile 412 × 823 px, DPR 1,75, throttling simulado, RTT de 150 ms, throughput de 1.638,4 Kbps e CPU 4× mais lenta:

| Execução | Desempenho | LCP | CLS | TBT |
|---|---:|---:|---:|---:|
| 1 | 100 | 0,766 s | 0 | 88,5 ms |
| 2 | 100 | 0,760 s | 0 | 49 ms |
| 3 | 100 | 0,757 s | 0 | 35 ms |
| Mediana | 100 | 0,760 s | 0 | 49 ms |

As quatro categorias receberam 100 nessas execuções. As metas de laboratório de LCP ≤ 2,5 s e CLS ≤ 0,1 foram atingidas. TBT não é INP; não há medição de INP em campo ou comprovação do percentil 75 dos acessos reais. Arquivos HTML/JSON e configuração completa: `output/formal-horizontal/lighthouse/`.

## Capturas e reprodução

- Antes: [abertura mobile](../output/motion-refresh/motion/chromium-opening-390.png) e [desktop](../output/motion-refresh/motion/chromium-opening-1440.png), da revisão anterior.
- Depois: [página mobile](../output/formal-horizontal/after/chromium-home-390.png), [abertura desktop](../output/formal-horizontal/after/chromium-hero-1440.png) e [tablet](../output/formal-horizontal/after/chromium-hero-768.png).
- Horizontal: [desktop](../output/formal-horizontal/interactions/chromium-desktop-panel-2.png) e [celular](../output/formal-horizontal/interactions/chromium-mobile-panel-2.png).
- [Menu mobile](../output/formal-horizontal/after/chromium-menu-open-390.png), [atendimento aberto](../output/formal-horizontal/after/chromium-attendance-open-390.png) e [FAQ aberto](../output/formal-horizontal/after/chromium-faq-open-390.png).

Para reproduzir: `npm run verify`. Com `npm run preview -- --port 5189 --strictPort`, execute os scripts `identity-qa.mjs`, `horizontal-qa.mjs` e `zoom-qa.mjs` com `QA_URL=http://127.0.0.1:5189`. `QA_OUTPUT` escolhe a pasta de cada relatório. As instruções de Lighthouse estão no README. As evidências em `output/` são locais e ignoradas pelo Git.

**Limites:** validado em emulação; validação física pendente. Android/Chrome e iPhone/Safari reais e leitor de tela não estavam disponíveis nesta revisão. Nenhuma publicação, envio de mensagem ou declaração de conformidade integral foi realizada.
