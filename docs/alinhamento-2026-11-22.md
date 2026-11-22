# Revisão de alinhamento — 22/11/2026

## Ajustes realizados

- Botões do WhatsApp: duas áreas laterais de mesma largura mantêm o texto realmente centralizado. Antes, a margem automática da seta deslocava o texto cerca de 48 px para a esquerda no botão da abertura a 390 px. O botão compacto do menu mantém sua composição de dois elementos.
- Contato abaixo de 640 px: título, introdução, telefone, modalidades, Instagram e arte final centralizados. O telefone continua em Manrope 600, com número e destino preservados.
- Rodapé abaixo de 640 px: conjunto de marca e identificação profissional centralizado, seguido por Instagram e direitos autorais centralizados. O conjunto pode se reorganizar quando o texto é ampliado.
- Página de aposentadorias: ilustração isolada centralizada enquanto o corpo usa uma coluna; volta ao alinhamento da coluna na composição desktop, a partir de 1024 px.
- Textos longos, perguntas, títulos editoriais e composição da abertura mantêm seus alinhamentos de leitura. A partir de 640 px, o contato e o rodapé retomam os alinhamentos das respectivas colunas.

As mudanças visuais desta revisão estão em `src/editorial.css`; conteúdo e links não foram alterados.

## Verificação

| Verificação | Resultado |
| --- | --- |
| TypeScript e build (`npm run build`) | Aprovados |
| Suíte completa (`npx playwright test`) | 54 testes aprovados, 27 por motor, Chromium e WebKit |
| Teste de centralização | Três rotas em 320, 360, 390, 568, 639, 640, 768, 1024 e 1440 px; desvio menor que 1 px nos elementos centralizados e nos textos dos botões |
| Regressões funcionais | Menu, FAQ, etapas, teclado, contato, rotas diretas, fontes, imagens, movimento reduzido e texto ampliado a 200% aprovados na suíte |
| Axe | Sem violações detectadas pela suíte nas quatro rotas e oito tamanhos configurados |
| Capturas de produção | 24 combinações de rota/largura, sem rolagem horizontal, imagens quebradas ou erros JavaScript |

Capturas: `/`, `/aposentadorias`, `/bpc` e `/nao-existe`, em 320, 390, 639, 640, 768 e 1440 px, altura de janela de 900 px. Build servido localmente em `http://127.0.0.1:5184/`. Revisão visual das capturas da abertura, contato, rodapé, corpo de aposentadorias e páginas completas de tablet/desktop, incluindo a transição de 639 para 640 px. As capturas também incluem as etapas abertas a 390 px.

## Evidências e reprodução

- Antes: `output/alinhamento/before/home-390.png` e `metrics.json`.
- Depois: `output/alinhamento/after/home-390.png`, `contact-section-390.png`, `site-footer-390.png`, `home-768.png` e `home-1440.png`.
- Métricas e erros: `output/alinhamento/after/metrics.json`.
- Log da suíte: `output/alinhamento/playwright.log`.
- Regressão: `tests/alignment.spec.ts`.

Com o build de produção servido na porta 5184, executar no PowerShell:

```powershell
$env:QA_URL = 'http://127.0.0.1:5184'
node scripts/alignment-qa.mjs
```

A pasta `output/` é local e ignorada pelo Git. O script registra falha se detectar imagens quebradas, erros JavaScript ou rolagem horizontal.

## Limites

Validado em emulação; validação física pendente. Não houve teste novo com leitor de tela nem nova medição Lighthouse nesta revisão de alinhamentos. Os resultados e limites de desempenho do redesign estão em `docs/validacao-mobile-2026-11-22.md`; a meta de LCP continua pendente. Nenhum deploy foi realizado.
