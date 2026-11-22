# Redesign de Iara Santos — entrega de 22/11/2026

## Resultado e limites

Redesign mobile e desktop implementado no projeto existente. Nome e retrato compartilham a abertura, os serviços usam rolagem vertical no celular/tablet, o atendimento possui detalhes independentes e avaliações vazias não aparecem. As oito artes anteriores foram preservadas; três novas ilustrações editoriais foram adicionadas. A implementação está validada em emulação; validação física pendente.

Os testes funcionais e de layout passaram. A meta de LCP de 2,5 s ainda não foi atingida no laboratório: a mediana final foi 2,72 s. Leitor de tela real e aparelhos Android/iPhone não foram verificados. Portanto, este relatório não declara aprovação integral de acessibilidade ou de Core Web Vitals em produção.

## Composição antes/depois

Medições em 390 × 844 CSS px, com conteúdo padrão e detalhes fechados:

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Cabeçalho | aproximadamente 79 px | 71 px |
| Altura da abertura | aproximadamente 837 px | 531 px |
| Início da composição do retrato | aproximadamente 512 px do topo | 91 px do topo |
| Página completa | aproximadamente 6.550 px | 5.161 px |

A abertura ficou aproximadamente 37% mais curta, e a página, 21% mais curta, mantendo os textos profissionais aprovados. O botão de WhatsApp está integralmente na primeira tela em 360 × 640 e 390 × 844. As artes acompanham o conteúdo, com tamanhos compactos, e o fundo do retrato deixou de ser um retângulo separado.

## Evidência por critério

| Critério | Resultado | Evidência |
| --- | --- | --- |
| TypeScript e build | Aprovado | `npm run build`, que executa `tsc --noEmit` e Vite; saída de produção em `dist/` |
| Suíte de interação e regressão | Aprovado | `npm test`: **52 testes aprovados**, 26 por navegador, execução final de 2,6 minutos |
| Matriz de layout e axe | Aprovado no escopo automatizado | Chromium e WebKit; quatro rotas × oito tamanhos = 64 auditorias WCAG A/AA; nenhuma violação detectada pela ferramenta |
| Capturas no build de produção | Aprovado | `node scripts/mobile-qa.mjs`: 64 combinações, sem overflow, imagens quebradas ou erros JavaScript detectados; `output/mobile-redesign/final/report.json` |
| Nome, rosto e CTA na primeira tela | Aprovado | Testes de limites em 360 × 640 e 390 × 844, mais inspeção das capturas |
| Serviços | Aprovado | Dois blocos completos em lista até tablet; duas colunas no desktop; navegação para as páginas próprias |
| Atendimento expansível | Aprovado | Três controles independentes, Enter/Espaço/toque, estados ARIA, detalhes fechados fora da interação e três imagens carregadas |
| Menu, FAQ, âncoras e foco | Aprovado no escopo testado | Escape, retorno de foco, destino abaixo do cabeçalho e percurso por teclado; menu rolável em 568 × 320 |
| Texto ampliado | Aprovado | Texto a 200% em 320, 390 e 768 px, nas quatro rotas e com detalhes abertos; sem overflow |
| Zoom real de 400% | Aprovado em Chromium | `node scripts/zoom-qa.mjs`: janela externa de 1280 px, viewport de 315 CSS px após zoom, fonte raiz mantida em 16 CSS px; quatro rotas sem overflow |
| Toque e alvos | Aprovado em emulação | Menu, FAQ e detalhes por toque nos dois motores; alvos visíveis de ao menos 44 × 44 px; gesto vertical nativo via CDP no Chromium |
| Movimento reduzido | Aprovado | Troca da preferência durante a sessão, reset das artes e controles funcionais; abertura disponível sem animação de entrada |
| Imagens responsivas | Aprovado no escopo testado | Retrato seleciona 360/640/1050 px em densidades 1×/2×/3× a 390 px; fontes e imagens carregadas; fallback do retrato verificado |
| Contraste | Aprovado nas combinações avaliadas | `output/mobile-redesign/contrast.json`: texto principal 6,96:1; secundário 5,42:1; rótulos 5,11:1; botão 6,52:1; foco acima de 3:1; considerados extremos dos degradês |
| WhatsApp e dados profissionais | Aprovado | Número e mensagem codificada verificados nas três páginas; OAB vazia não exibida; nenhuma mensagem enviada |
| Meta de CLS ≤ 0,1 | Aprovado no laboratório | CLS zero nas três medições finais |
| Meta de LCP ≤ 2,5 s | **Não atingida** | Mediana de 2,717 s no ambiente e configuração abaixo |
| INP real ≤ 200 ms | Não verificado em campo | Amostra local de Event Timing chegou a 72 ms; não equivale a INP de usuários reais no percentil 75 |
| Leitor de tela real | Não verificado | A infraestrutura de Computer Use retornou indisponibilidade da conexão nativa. Semântica, estados ARIA e teclado foram verificados, mas não substituem leitura real |
| Android/Chrome e iPhone/Safari físicos | Não verificado | Não houve acesso a aparelhos físicos |
| Hospedagem e publicação | Não executado, conforme escopo | Configuração Vercel preserva assets, imagens, favicon, robots e fallback de SPA; nenhum deploy realizado |

Tamanhos: 320 × 568, 360 × 640, 375 × 812, 390 × 844, 412 × 915, 568 × 320, 768 × 1024 e 1440 × 900. Rotas: `/`, `/aposentadorias`, `/bpc` e `/nao-existe`.

Na revisão visual foram examinadas capturas de celular, tablet, desktop, páginas de serviço, densidade 2×, detalhes abertos e FAQ. A automação cobre toda a matriz; isso não significa que cada captura recebeu uma auditoria humana completa.

## Desempenho: três execuções finais

Lighthouse **13.6.0**, build de produção servido em `http://127.0.0.1:5183/`, Chromium 158 em Windows. Perfil mobile padrão: 412 × 823, densidade 1,75, rede simulada de aproximadamente 1,6 Mbps/150 ms e CPU 4×. As execuções foram sequenciais, sem a suíte e a captura automatizada concorrendo com elas.

| Execução | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 87 | 100 | 100 | 100 | 2,708 s | 0 | 383 ms |
| 2 | 94 | 100 | 100 | 100 | 2,724 s | 0 | 167,5 ms |
| 3 | 96 | 100 | 100 | 100 | 2,717 s | 0 | 60 ms |
| Mediana | **94** | **100** | **100** | **100** | **2,717 s** | **0** | **167,5 ms** |

A primeira execução registrou aviso de que a CPU do ambiente era mais lenta que a referência do Lighthouse. As outras duas não registraram esse aviso. Os relatórios HTML/JSON, configurações e resumo estão em `output/mobile-redesign/lighthouse/release-*` e `release-summary.json`.

Na primeira rodada, antes da otimização, a mediana era 75 pontos, LCP de 4,42 s e TBT de 445 ms. Foram adicionados preload responsivo do retrato, preload das fontes, derivados menores das oito artes e do logotipo, carregamento separado dos recursos de animação e `robots.txt` válido. O JavaScript inicial caiu de aproximadamente 430 KB para 344 KB antes de gzip. As versões do retrato têm aproximadamente 36/56/89/201 KB, frente ao WebP anterior de 1,07 MB; o PNG original continua preservado.

O LCP melhorou, mas a meta de 2,5 s permanece não atendida neste laboratório. Antes de afirmar prontidão de desempenho em produção, é necessário resolver essa diferença e repetir as medições no ambiente de hospedagem real. Nenhuma pontuação aqui é prova de indexação ou de aprovação de Core Web Vitals em campo.

## Capturas e reprodução

- Antes: `output/mobile-redesign/before/hero-390.png` e `home-390.png`.
- Depois: `output/mobile-redesign/final/chromium-hero-390.png`, `chromium-home-390.png` e `chromium-home-1440.png`.
- Estados abertos: `chromium-attendance-open-390.png` e `chromium-faq-open-390.png` na mesma pasta.
- WebKit, demais rotas, larguras e densidades também estão na pasta `final/`.
- Zoom: `output/mobile-redesign/zoom/`; toque e Event Timing: `output/mobile-redesign/interactions.json`.
- Prompts, origem e caminhos das ilustrações: `docs/ilustracoes-mobile.md`.

O README contém instalação e comandos completos. A pasta `output/` é local e ignorada pelo Git. Para o teste de zoom, foi usado um perfil exclusivo de auditoria, sem alterar o perfil pessoal do usuário.

Durante algumas navegações rápidas no servidor Vite/WebKit foram registradas mensagens de rejeição tardia de importação de módulo; não houve falha na suíte final nem reprodução nas 64 combinações examinadas no build de produção. Os avisos de Motion com movimento reduzido são esperados nessa configuração de teste.
