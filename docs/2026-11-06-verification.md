# Auditoria de entrega — 06/11/2026

Esta auditoria corresponde à especificação do objetivo e ao estado atual do projeto, não apenas à primeira versão.

| Item do objetivo | Evidência inspecionada |
| --- | --- |
| 1. Diagnóstico e preservação | Git inicialmente limpo em `4251902`; stack, npm, rotas e estilos examinados. Versão anterior executada e capturada em desktop/celular. `output/qa/baseline/diagnostic.json` confirmou fontes carregadas, tracking muito fechado e corpo/FAQ pequenos. Plano curto em `docs/2026-11-06-refresh-plan.md`. |
| 2. Cada imagem | Dez arquivos de produção examinados individualmente, duplicata comparada por SHA-256, captura de referência separada e outro retrato excluído. Originais preservados. Oito artes distintas aplicadas, com orientações e escala variadas. `docs/image-inventory.md` e `assets/inventory.json`. Dez comparações PNG/WebP em marrom/marfim inspecionadas. Zero diferenças no alfa/pixels visíveis do retrato sem perdas. |
| 3. Fontes e bordas | Somente Manrope/Baskervville carregadas no navegador, WOFF2 local. Corpo 16/17 px, FAQ 16 px. Palavras acentuadas visíveis nos títulos e controles. Bordas visíveis nos serviços, atendimento, FAQ, avaliações e contato. Escalas e estados revisados em três larguras. |
| 4. Ondas | Seis curvas SVG na inicial, variação espelhada, altura 83/43 px. Teste confirma preenchimento com cor computada idêntica à próxima seção, `aria-hidden` e `pointer-events:none`. Capturas de página inteira sem frestas ou overflow. Bordas internas preservadas. |
| 5. Faixa | Dois serviços reais e únicos. Cards com arte, título, descrição e link. Parte do próximo card visível em celular. Scroll snap e toque nativo; teste de swipe horizontal e rolagem vertical aprovado. Mouse com limiar de 8 px, captura e cancelamento ao sair antes de arrastar; regressão comprovada. Setas, Home/End e clique após arraste aprovados. Controles ocultos quando cabe no desktop. Sem loop ou autoplay. |
| 6. Animação | Sequência imediata da abertura (opacidade inicial 0,72), revelações únicas com intervalo nos cards, profundidade limitada a 6/5 px em duas artes, hover/foco com transform separado do reveal, estabilidade durante drag. FAQ altura/opacidade/indicador acompanha estado acessível. Entrada de serviços breve, histórico aprovado. Hook acompanha mudança de preferência em tempo real, teste comprova profundidade zerada. CSS reduzido elimina transições. |
| 7. Sociais | SVGs locais reconhecíveis de WhatsApp e Instagram, com nomes acessíveis em links de ícone. Destinos, número e mensagem exatos testados. Contato no espaço reservado do cabeçalho mobile/tablet, sem sobrepor FAQ ou leitura. |
| 8. Avaliações | Âncora e menu `#avaliacoes`, após FAQ/antes de Contato. `site.reviews.items: Review[]` vazio, frase exata, sem estrelas, autor, contagem ou setas fictícias. Testes com fixtures interceptadas apenas no navegador comprovam uma estática e múltiplas na faixa. README explica os campos. |
| 9. Escopo | `site.ts` mantém Iara, 10 anos, WhatsApp, Mossoró/RN/região, serviços e todos os textos jurídicos aprovados. OAB vazia permanece oculta. Contato sem formulário/e-mail e sem novos serviços/resultados. |
| 10. Verificações | `npm run typecheck`, `npm run build`, `npm test`: 17 testes aprovados. Auditorias axe WCAG A/AA nas quatro rotas em três larguras. Inicial inteira e páginas de serviço percorridas em 375/768/1440; fontes, imagens, ondas e enquadramentos inspecionados, sem overflow/erros JavaScript/HTTP/imagem quebrada. Acesso direto/refresh das duas páginas, menu, FAQ, âncoras, histórico, arraste, teclado e preferência de movimento testados. Revisão independente com três correções reproduzidas por regressões. |

## Limites explícitos

- Não existe script de lint no projeto, portanto nenhum lint foi declarado como executado.
- Os testes de navegador e toque usaram Chromium com emulação; não houve teste em aparelho físico, Safari/Firefox ou avaliação completa com leitor de tela.
- A foto identificável do escritório não estava disponível. Usou-se a paleta já confirmada e a captura de site somente para inspiração.
- Nenhuma publicação, envio de mensagem, alteração de conta ou deploy foi realizado. Rewrites Vercel preparados anteriormente continuam no projeto; não foram validados em hospedagem real nesta etapa.
