# Auditoria final — Iara Santos — 24/11/2026

O código da aplicação corresponde ao build usado nas verificações. A auditoria complementar acrescentou quatro testes à suíte, sem alterar a implementação. Os registros abaixo descrevem os resultados observados; não constituem garantia universal de ausência de defeitos ou conformidade integral.

## Requisitos e evidências

| Requisito | Evidência atual | Resultado |
|---|---|---|
| React, TypeScript, Vite, Router, Motion e conteúdo central tipado | package.json, src/data/site.ts, TypeScript/build em verify-final.log | Aprovado |
| Conteúdo profissional confirmado, OAB vazia/oculta e serviços restritos a aposentadorias/BPC | Configuração central; testes de contatos e ausência de OAB nas páginas | Aprovado |
| Retrato, artes, fontes locais, Manrope no telefone e identidade vinho/marfim | Runtime decodifica imagens das três páginas; testes de assets/fontes; capturas de produção | Aprovado |
| Entrada dos serviços pela direita, retorno pela esquerda, duração de 360 ms | Testes navigation-transition e quadros de produção | Aprovado |
| Histórico conhecido, entrada desconhecida imediata, recuperação das visitas conhecidas | Testes de Back/Forward e regressão RED→GREEN do POP desconhecido | Aprovado |
| Uma página ativa, cabeçalho/rodapé sem transformação, limpeza de estilos e navegações rápidas | Amostras reais dos frames e testes de navegação | Aprovado |
| Acesso direto, atualização e 404; configuração estática Vercel | Testes site/runtime, quatro rotas locais e vercel.json | Aprovado localmente; hospedagem não publicada |
| Menu, Escape/foco, FAQ, etapas independentes e links de serviço | Suíte completa Chromium/WebKit | Aprovado |
| Âncoras corretas com a seção horizontal fixada | Testes de navegação e 15 verificações de produção em horizontal-final/report.json | Aprovado |
| Rolagem horizontal, roda, retorno, arraste, teclado, toque emulado e janela baixa | Testes horizontal e auditoria de gestos de produção | Aprovado |
| Movimento reduzido inicial/dinâmico e interrupção por interação/resize | Testes de movimento + dez interrupções de animação pausada em produção | Aprovado |
| WhatsApp com número/mensagem corretos, nova aba isolada e origem preservada | Novo teste completion: destino interceptado localmente; window.opener nulo; página de origem continua em /bpc | Aprovado, sem acesso ao WhatsApp ou envio de mensagem |
| 320/360/375/390/412/568/768/1440 px, incluindo paisagem | Matriz de layout, axe e transição nos dois motores | Aprovado |
| Ausência de texto/controles cortados, inclusive quando overflow é recortado | Novo teste completion: limites de cada linha real de texto e controles, quatro rotas × oito tamanhos × 100%/200% × dois motores | Aprovado |
| Ampliação de 400% | Zoom real Chromium: quatro rotas em 315 CSS px, sem overflow | Aprovado |
| Acessibilidade automatizada e teclado | Axe em quatro rotas/oito tamanhos/dois motores; testes de teclado e foco | Sem violações detectadas; ressalva WebKit Windows abaixo |
| Build, inicialização e integridade | 120 testes de navegador na verificação completa + quatro complementares, quatro testes runtime, um startup real, três assets, TypeScript e git diff --check | Aprovado |
| Desempenho de laboratório, três medições mobile | Lighthouse 13.6.0 no build de produção atual | Metas de LCP/CLS atingidas |
| README, instruções de conteúdo/foto/OAB, relatórios e capturas | README e relatórios vinculados | Entregues |
| Nenhum deploy nesta etapa | Trabalho local, sem comandos de publicação | Preservado |

## Resultados de laboratório e registros

| Medição | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 100 | 100 | 100 | 1,543 s | 0 | 38 ms |
| 2 | 100 | 100 | 100 | 100 | 1,529 s | 0 | 39 ms |
| 3 | 100 | 100 | 100 | 100 | 0,760 s | 0 | 38 ms |
| Mediana | 100 | 100 | 100 | 100 | 1,529 s | 0 | 38 ms |

Configuração completa nos relatórios JSON: mobile 412×823, DPR 1,75, RTT 150 ms, rede 1.638,4 Kbps, CPU 4×, throttling simulado. Esses resultados não comprovam INP em campo ou Core Web Vitals no percentil 75.

- [Verificação completa: 120 testes](../output/route-transition/verify-final.log).
- [Quatro testes complementares](../output/route-transition/completion-final.log): os testes iniciais de popup precisaram selecionar o ícone mobile visível e aguardar a montagem real. O aplicativo não foi alterado para acomodá-los.
- [Capturas e auditoria da transição](transicao-lateral-2026-11-24.md).
- [Gestos/âncoras em produção](../output/route-transition/horizontal-final/report.json).
- [Lighthouse: resumo/configuração](../output/route-transition/lighthouse/summary.json) e relatórios [1](../output/route-transition/lighthouse/run-1.report.html), [2](../output/route-transition/lighthouse/run-2.report.html), [3](../output/route-transition/lighthouse/run-3.report.html).
- [Identificação dos arquivos verificados](../output/route-transition/completion-audit.json): SHA-256 e confirmação de que os arquivos de entrada da aplicação não mudaram depois do build.

## Limites explícitos

Validado em emulação; validação física em Android/iPhone e leitor de tela pendentes. O WebKit de automação no Windows omite links do Tab por padrão; os testes complementam a avaliação com foco explícito nesses links. A experiência de Safari físico não foi declarada validada.

Não houve publicação nem teste da infraestrutura de hospedagem. OAB continua vazia até informação correta. Nenhuma pendência de implementação ou falha funcional foi identificada nos cenários executados; testes adicionais futuros continuam possíveis.
