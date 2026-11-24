# Textos formais e navegação horizontal

**Pedido:** trocar os textos pelos da imagem fornecida e acrescentar uma experiência horizontal com imagens, integrada à identidade vinho/marfim. Sem publicação.

**Leitura da fonte:** JPEG de 411 × 1600 px. Títulos são legíveis; parágrafos, listas e rodapé não permitem transcrição integral segura, inclusive após OCR local. O usuário autorizou reescrever os trechos ilegíveis com linguagem formal e profissional. Nenhuma OAB ou oferta profissional será deduzida de pixels ilegíveis.

**Direção:** manter React/TypeScript/Motion, marca e retrato. Adaptar a referência Webflow em uma seção com três princípios do atendimento e artes existentes. No desktop, a rolagem vertical percorre painéis horizontais dentro de uma seção fixa temporariamente. Em celular, texto ampliado, janela baixa ou movimento reduzido, usar rolagem horizontal nativa por toque, botões e teclado. Não capturar a roda global nem bloquear o restante da página. Os dois serviços permanecem diretamente disponíveis na leitura vertical.

- [x] Testes de movimento horizontal, retorno, limites, toque/arraste, teclado, movimento reduzido e imagens.
- [x] Implementação de HorizontalJourney e adaptação mínima de DragRail para compartilhar a referência do viewport.
- [x] Substituição dos títulos legíveis e ajuste da abertura para a nova frase; parágrafos ilegíveis reescritos conforme autorização.
- [x] TypeScript, build, suíte existente atualizada, axe, revisão visual, capturas e relatório de pendências reais.

**Referências:** https://ix-horizontal-scroll.webflow.io/ (inspecionada em Chromium); https://motion.dev/docs/react-use-scroll; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type.

## Ajuste solicitado durante a execução: falta de memória no Vite

O usuário forneceu o erro real `memory allocation ... failed`. A indisponibilidade de memória virtual também foi observada no PowerShell e nos navegadores. A correção no projeto reduz a concorrência de Rolldown/Rayon antes de importar o Vite, utiliza as entradas individuais oficiais do Lucide e acrescenta diagnóstico sem alterar o Windows. Os testes passam a usar um worker por padrão.

`npm run verify` integra quatro testes do inicializador, um teste real de inicialização do Vite com cache reconstruído, TypeScript, build, arquivos da marca e a suíte completa de navegador. O diagnóstico não é uma garantia contra esgotamento posterior da memória por outros aplicativos. A execução aprovada do teste de inicialização ocorreu depois de o Windows voltar a disponibilizar aproximadamente 3 GB ou mais de memória até o limite de comprometimento.

Correções encontradas na validação da seção horizontal: separar a origem dos eventos em ambos os sentidos, preservar o intervalo anterior ao redimensionar, medir fora do ciclo do ResizeObserver e executar o alinhamento de navegação depois dos efeitos de layout do cabeçalho e da página. Os dez testes específicos passaram nos dois motores em `output/formal-horizontal/horizontal-fixed.log`.

**Conclusão local:** a verificação integrada passou; 84 testes de navegador, quatro do inicializador e três da marca. A matriz de produção passou nos 88 cenários; os gestos e o zoom real de 400% também passaram. Os dois casos de teclado foram ampliados e repetidos com sucesso. Três medições Lighthouse mobile: mediana 100 de desempenho, LCP 0,76 s e CLS 0. Evidências e limites em `docs/textos-horizontal-2026-11-24.md`. Validação física e leitor de tela permanecem não verificados; não houve deploy.
