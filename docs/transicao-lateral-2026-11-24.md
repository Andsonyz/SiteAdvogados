# Transição lateral — 24/11/2026

## Implementação

As páginas de serviço entram da direita, o retorno explícito à página inicial entra da esquerda e o histórico conhecido determina a direção de Voltar/Avançar. O conteúdo principal percorre uma largura de página em 360 ms, com desaceleração `[0.22, 1, 0.36, 1]`. Cabeçalho e rodapé ficam fora da transformação.

`src/components/PageTransition.tsx` mantém uma única página ativa e usa a entrada `motion/mini` da dependência já instalada. Nenhuma biblioteca foi adicionada. Acesso direto, atualização, navegação por âncoras e movimento reduzido não iniciam o deslocamento lateral. Interação por teclado, ponteiro, toque, roda e redimensionamento concluem o movimento. As transformações e `will-change` são removidos ao terminar.

A abertura mantém sua animação inicial no carregamento do documento. Nos retornos internos, ela não soma uma segunda entrada à transição lateral. Os textos, URLs, imagens e a paleta existentes foram preservados.

## Problemas encontrados e corrigidos

- O WebKit ajustava a rolagem nativa depois da montagem da seção horizontal fixada: a âncora Dúvidas inicialmente ficava em 105 px e terminava em -687 px. O foco continua imediato e único; a posição é reconciliada uma vez no próximo frame, com cancelamento se o visitante interagir. Diagnóstico em `output/route-transition/anchor-events.json` e `anchor-probe.json`.
- A revisão independente identificou que um POP desconhecido apagava as visitas já conhecidas. O registro agora é preservado; a posição desconhecida não recebe uma direção presumida. Ao regressar a uma visita conhecida, o movimento pode ser imediato, e a direção volta a ser conhecida nas navegações seguintes. A regressão reproduziu a falha antes da correção e passou nos dois motores depois dela.
- Testes que disparavam `click()` por JavaScript passaram a aguardar o commit da rota antes de testar uma interrupção. A animação de produção não foi prolongada para acomodar os testes.

## Evidências iniciais

- Baseline: 14 testes existentes de movimento aprovados.
- RED: o novo teste de entrada falhou antes da implementação, pela ausência de animação lateral.
- Correções de âncora, interação e sincronização: 10 testes focados aprovados em Chromium/WebKit.
- Regressão do histórico após visita desconhecida: falha observada, depois 2 testes aprovados em Chromium/WebKit.
- `npm run verify`: exit 0, TypeScript e build aprovados, 4 testes de runtime, 1 teste real de inicialização fria do Vite, 3 testes de assets e **120 testes de navegador aprovados** (84 anteriores + 36 da transição).
- Chromium e WebKit: 320×568, 360×640, 375×812, 390×844, 412×915, 568×320, 768×1024 e 1440×900. Os testes novos conferem deslocamento real, duração de 360 ms, ausência de overflow durante os frames, cabeçalho/rodapé sem transformação, um único h1 e limpeza de estilos.
- Axe: nenhuma violação detectada nas quatro rotas em oito tamanhos nos dois motores. Texto a 200%, menu, FAQ, etapas, serviços, contatos, imagens, âncoras, teclado e rolagem horizontal incluídos na suíte.
- Auditoria do build de produção: 12 estados intermediários com respectivas capturas finais, em 390/768/1440 px e dois motores. **10 interrupções de animação pausada aprovadas**, abrangendo teclado, ponteiro, roda, resize e mudança de movimento reduzido. Zero erros JavaScript ou respostas HTTP de erro detectados; zero imagens quebradas; telefone em Manrope.
- Revisão visual humana das capturas: entrada mobile/desktop, serviço final mobile/tablet/desktop, retorno mobile e página inicial completa mobile. Não foram observados cortes no estado final, sobreposições ou deformações. O conteúdo parcialmente fora da tela nos quadros intermediários corresponde ao deslocamento lateral previsto.
- `git diff --check` e `node --check scripts/route-transition-qa.mjs`: aprovados.
- Zoom real de 400% no Chromium de produção: quatro rotas em 315 CSS px, sem overflow horizontal. Perfil de teste isolado, com zoom restaurado ao concluir. [Relatório](../output/route-transition/zoom/report.json).

## Capturas e registros

- [Entrada mobile — quadro em 100 ms](../output/route-transition/visual/chromium-service-right-frame-390.png) e [estado final](../output/route-transition/visual/chromium-service-right-final-390.png).
- [Retorno mobile — quadro em 100 ms](../output/route-transition/visual/webkit-home-left-frame-390.png) e [estado final](../output/route-transition/visual/webkit-home-left-final-390.png).
- [Serviço desktop](../output/route-transition/visual/chromium-service-right-final-1440.png), [tablet](../output/route-transition/visual/webkit-service-right-final-768.png) e [página inicial completa mobile](../output/route-transition/visual/chromium-home-390.png).
- [Suíte completa](../output/route-transition/verify-final.log), [auditoria de produção](../output/route-transition/visual/report.json), [RED inicial](../output/route-transition/red.log), [RED do histórico](../output/route-transition/history-red.log) e [correção do histórico](../output/route-transition/history-green.log).

As capturas intermediárias pausam o quadro real da animação em 100 ms apenas para permitir inspeção reproduzível. A suíte percorre a animação sem pausa. Arquivos em `output/` são evidências locais ignoradas pelo Git. A [auditoria final complementar](auditoria-final-2026-11-24.md) acrescenta quatro testes, validação de limites reais dos textos/controles, contatos em nova aba e três medições Lighthouse do build atual. Desempenho em campo não foi comprovado.

## Limites

Validação física em Android/Chrome e iPhone/Safari e revisão com leitor de tela não foram realizadas. Emulação não substitui essas verificações. O WebKit para Windows instalado omite links na navegação Tab padrão; a suíte complementa a verificação com foco explícito nesses links, sem afirmar equivalência com Safari físico. A revisão independente foi de código, sem execução de navegador pelo revisor. Nenhuma mensagem foi enviada, nenhum deploy foi realizado e as alterações permanecem no checkout existente.
