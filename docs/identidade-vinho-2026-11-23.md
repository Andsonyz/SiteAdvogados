# Identidade vinho e marfim — entrega de 23/11/2026

## Resultado

As quatro rotas receberam a identidade da nova marca: vinho `#653D3D`, marfim `#F3EDDF`, títulos Baskervville e textos/telefone Manrope. O cabeçalho exibe a marca real, a assinatura do Sobre usa sua variante vinho, o rodapé foi recomposto para acomodar a assinatura completa e o favicon usa o monograma fornecido. Controles, estados abertos, hover, foco, degradês, páginas de serviço e retorno de rota inexistente seguem o mesmo sistema.

O retrato original, as oito artes e as três ilustrações de atendimento foram preservados. As artes receberam menor escala e tratamento cromático discreto por CSS; a fotografia e a marca não recebem esse filtro. A máscara do retrato integra a base e, em navegadores compatíveis, a borda direita, preservando a região do rosto. Conteúdo profissional, OAB vazia/oculta, links e mensagem do WhatsApp não foram alterados. Não houve publicação.

## Fidelidade da marca

A referência de 1600 × 1135 px está em `assets/brand/referencia-original.png`. O recorte completo mede 1283 × 567 px, com respiro. A transparência foi extraída por projeção entre as duas cores originais, sem redesenhar ou regenerar letras. Mestres, monograma e manifesto estão em `assets/brand/`; derivados de 192/384/768 px estão em `public/images/marca-iara-*`.

Os três testes Node verificam presença de letras opacas e fundo transparente, proporção dos derivados e fidelidade de recomposição sobre o vinho original (erro médio inferior a 1,5 em escala de canal 0–255). A marca também foi conferida visualmente sobre o fundo vinho. No navegador, 1×/2×/3× selecionaram respectivamente 192/384/768 px no rodapé, nos dois motores, sem deformação detectada. Os arquivos da marca anterior continuam preservados como fontes, sem renderização na interface.

## Verificações executadas

| Verificação | Evidência e resultado |
| --- | --- |
| Baseline | TypeScript e 54 testes aprovados antes das mudanças; nove capturas de referência |
| TypeScript/build | `npm run build`, aprovado |
| Marca | `npm run test:assets`, três testes aprovados; marca nova nas quatro rotas e favicon com monograma real |
| Suíte completa | `npm test`, 60 testes aprovados: 30 Chromium e 30 WebKit |
| Interações | Menu, Escape, retorno de foco, âncoras, FAQ, etapas independentes, toque, teclado e navegação/histórico aprovados pela suíte |
| Primeira tela | Nome, área do retrato e CTA integralmente na tela em 360 × 640 e 390 × 844, nos testes e capturas |
| Texto/movimento | Texto a 200%, controle de paisagem e alteração de movimento reduzido durante a sessão aprovados |
| Zoom real de 400% | Chromium em perfil exclusivo: janela externa de 1280 px e viewport de 315 CSS px; quatro rotas sem overflow |
| Axe | Nenhuma violação detectada na matriz automatizada das quatro rotas e oito tamanhos da suíte |
| Produção | 88 combinações: quatro rotas × onze tamanhos × dois motores; sem overflow, imagens quebradas, fontes ausentes, deformação de marca, erro de destino de contato ou erro JavaScript |
| Identidade e preservação | Testes novos cobrem marca, estados vinho/marfim e presença das oito artes/três ilustrações |
| Hover e foco em produção | Dez verificações diretas de cores dos botões e foco por teclado em Chromium/WebKit, aprovadas |

Tamanhos da auditoria de produção: 320 × 568, 360 × 640, 375 × 812, 390 × 844, 412 × 915, 568 × 320, 639 × 900, 640 × 900, 768 × 1024, 1024 × 900 e 1440 × 900. Rotas `/`, `/aposentadorias`, `/bpc`, `/nao-existe`. Build servido localmente em `http://127.0.0.1:5184/`.

Revisão visual de páginas completas mobile/tablet/desktop, cabeçalho, abertura, contato, rodapé, aberturas de serviços e estados abertos de menu/atendimento/FAQ. Os testes verificam todos os tamanhos, mas isso não equivale a inspeção humana completa de cada captura.

## Contraste dos degradês

Valores calculados dos tokens efetivamente usados pelo build, considerando os extremos das superfícies claras e escuras. A auditoria axe complementa estas medições.

| Combinação | Pior relação |
| --- | ---: |
| Texto principal em fundo claro | 9,86:1 |
| Texto secundário em fundo claro | 4,95:1 |
| Título/texto claro em fundo escuro | 6,72:1 |
| Texto secundário em fundo escuro | 5,94:1 |
| Botão principal vinho/marfim | 7,86:1 |
| Foco em fundo claro/escuro | 6,81:1 / 6,72:1 |
| Bordas dos controles no cabeçalho | 5,01:1 |

## Desempenho em laboratório

Três execuções sequenciais de Lighthouse 13.6.0 no build atual, Chromium 158/Windows, sem a suíte e a matriz de capturas concorrendo. Perfil mobile: 412 × 823, densidade 1,75, rede simulada de aproximadamente 1,6 Mbps/150 ms e CPU 4×. Não houve avisos de execução.

| Execução | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 95 | 100 | 100 | 100 | 2,845 s | 0 | 88,5 ms |
| 2 | 95 | 100 | 100 | 100 | 2,944 s | 0 | 52 ms |
| 3 | 93 | 100 | 100 | 100 | 2,934 s | 0 | 113,5 ms |
| Mediana | **95** | **100** | **100** | **100** | **2,934 s** | **0** | **88,5 ms** |

A referência anterior de LCP ≤ 2,5 s continua não atingida neste laboratório. CLS ficou em zero. TBT não é INP de usuários reais; estas pontuações não comprovam conformidade integral de acessibilidade ou Core Web Vitals em campo. Os relatórios completos HTML/JSON estão em `output/identidade-vinho/lighthouse/`, incluindo `summary.json` com configuração e ambiente.

## Evidências e reprodução

- Antes: `output/identidade-vinho/before/home-{390,768,1440}.png`, páginas de serviços e logs dos testes RED.
- Depois: `output/identidade-vinho/after/chromium-home-{390,768,1440}.png` e equivalentes WebKit.
- Comparativo mobile: `output/identidade-vinho/after/comparison-mobile.png` (antes à esquerda, depois à direita).
- Estados abertos, recortes de abertura/contato/rodapé e marca em três densidades estão na mesma pasta.
- Matriz, fontes, destinos, erros e contraste: `output/identidade-vinho/after/report.json`.
- Estados hover/foco: `output/identidade-vinho/after/states.json`.
- Suíte: `output/identidade-vinho/playwright-final.log`.
- Zoom real: `output/identidade-vinho/zoom/report.json`, capturas e perfil isolado de auditoria; não foi alterado o perfil pessoal do usuário.
- Especificação e plano: `docs/superpowers/specs/2026-11-23-identidade-vinho-marfim-design.md` e `docs/superpowers/plans/2026-11-23-identidade-vinho-marfim.md`.

O README descreve instalação, substituição da fotografia, OAB e preparação da marca. `npm test` executa Playwright; `npm run test:assets` executa o runner Node. A pasta `output/` é local e ignorada pelo Git.

## Revisão independente e estado da entrega

Uma revisão independente, somente leitura, examinou o intervalo `53d287f..04d2703`, a especificação, os testes e as capturas. Não confirmou achados críticos, importantes ou menores. Conferiu também a marca em 3×, a referência, a abertura, o rodapé, o tablet e o menu aberto. O revisor não repetiu a suíte nem atestou dispositivos físicos, leitor de tela ou desempenho de campo.

A entrega permanece no checkout solicitado, branch local `feat/identidade-vinho-marfim`, sem push, merge ou publicação. Os bundles JS/CSS do último build mantiveram os mesmos hashes do build auditado. As limitações abaixo permanecem explícitas, sem pressupor equivalência entre emulação e uso real.

## Limitações

Validado em emulação; validação física em Android/iPhone e leitor de tela real pendentes. LCP ≤ 2,5 s e desempenho em campo não comprovados. Nenhuma mensagem foi enviada e nenhum deploy foi feito. Os avisos de Motion com movimento reduzido são esperados; houve mensagens de HMR no servidor de desenvolvimento durante a execução, sem falha na suíte final ou reprodução nas 88 combinações do build de produção.
