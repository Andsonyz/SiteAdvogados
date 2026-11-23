# Identidade vinho e marfim — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar a identidade aprovada vinho/marfim e a nova marca a todo o site, preservando conteúdo, retrato, artes, acessibilidade e funcionalidades.

**Architecture:** Manter o React/Vite existente. Preparar a marca por processamento determinístico em Sharp; centralizar suas variantes no conteúdo tipado. Consolidar cores, composição e estados em `src/editorial.css` e nas regras base, sem nova biblioteca.

**Tech Stack:** React, TypeScript, Vite, React Router, Motion, Tailwind, Sharp e Playwright Chromium/WebKit já instalados.

**Spec:** `docs/superpowers/specs/2026-11-23-identidade-vinho-marfim-design.md`, aprovada pelo usuário em 23/11/2026.

## Global Constraints

- Cores principais: vinho `#653D3D`, marfim `#F3EDDF`; derivados sujeitos à verificação de contraste.
- Preservar os oito desenhos anteriores, as três ilustrações de atendimento e o retrato original. Não regenerar a marca ou a pessoa por IA.
- OAB vazia e oculta; textos e dados profissionais confirmados inalterados. WhatsApp e mensagem inicial preservados.
- Trabalhar no checkout aberto solicitado pelo usuário, em branch local própria; sem deploy, push ou merge.
- Nenhuma nova dependência de interface. Manter fontes locais Baskervville/Manrope.

## Review Focus

- Legenda da marca reduzida no cabeçalho: nome acessível e proporção correta, sem ampliar artificialmente letras.
- Bordas finas do monograma: transparência real, sem halo nem perda visível da assinatura em densidades altas.
- Transição 639/640 px e rodapé com marca mais larga: sem colisão ou rolagem horizontal.
- Texto ampliado e menu em paisagem: conteúdo e controle de contato alcançáveis por teclado/toque.
- Estados abertos e preferência de movimento alterada: nenhuma cor antiga ou movimento residual incompatível.

## Arquivos e responsabilidades

- `scripts/prepare-brand.mjs`: deriva marca completa clara/vinho, monograma e favicon a partir da imagem preservada em `assets/brand/`.
- `src/data/site.ts`: configuração tipada da nova marca, sem alterar texto profissional.
- `src/components/Shared.tsx`, `src/pages/Home.tsx`: aplicação da marca nos fundos adequados.
- `src/editorial.css`, `src/styles.css`, `index.html`: identidade, composição, cores de estados e cor do navegador.
- `tests/identity.spec.ts`, `tests/brand-assets.test.mjs`: regressões de identidade e fidelidade dos arquivos.
- `scripts/identity-qa.mjs`: matriz de produção, capturas, erros e imagens.
- `README.md`, `docs/identidade-vinho-2026-11-23.md`: instruções e evidências finais.

### Task 1: Marca fiel à referência em todas as rotas

**Interfaces:** produzir `brandAssets` tipado como variantes de `MediaAsset`; `site.professional.logo` aponta para a versão clara. `Brand({footer?: boolean})` continua com a mesma API. A assinatura do Sobre usa a versão vinho.

- [x] Criar teste browser `new identity replaces the old brand on every route`: imagem da marca no cabeçalho/rodapé com nome acessível correto, fontes novas e proporção preservada nas quatro rotas; nenhum `iara-santos-logo` antigo renderizado.
- [x] Rodar o teste em Chromium e observar a falha pela marca atual ausente no cabeçalho.
- [x] Criar testes Node para existência, alfa transparente e fidelidade de recomposição dos derivados à referência; observar falha antes dos arquivos novos.
- [x] Preservar a imagem de referência no projeto; implementar `prepare-brand.mjs` com extração alfa por projeção entre vinho/marfim, recorte com respiro e variantes WebP/PNG sem redesenhar letras. Gerar favicon a partir do monograma original.
- [x] Exportar `brandAssets`, atualizar `professional.logo` e usar imagens originais novas em `Brand`/Sobre. Dimensionar cabeçalho, assinatura e rodapé para a nova proporção.
- [x] Rodar testes Node, teste browser da marca e TypeScript; conferir os derivados visualmente e registrar os resultados. Commit local da tarefa.

### Task 2: Sistema editorial completo vinho/marfim

**Interfaces:** consumir os mesmos componentes e variantes de marca da Task 1. Tokens `--wine`, `--ivory`, `--ink`, `--muted`, `--rule`, `--gradient-dark`, `--gradient-light` e `--gradient-sand` governam estados e seções.

- [x] Adicionar teste `wine and ivory identity covers routes and open states`: tema do navegador vinho, CTA marfim/vinho, estados de menu/FAQ/atendimento e quatro rotas sem controles caramelo. Adicionar teste de preservação das oito artes e três ilustrações nas rotas e etapas.
- [x] Rodar o teste de paleta e observar falha com as cores antigas.
- [x] Consolidar todos os tons antigos em tokens vinho/marfim, incluindo foco, hover, menu, rodapé e 404. Remover o filtro que recriava a marca anterior.
- [x] Refinar a composição: cabeçalho com marca real e altura compacta; nome/foto juntos; variação de fundos e respiro; artes menores com cromatismo discreto; rodapé vertical no celular e colunas responsivas. Preservar alinhamentos já corrigidos.
- [x] Atualizar tema/favicons e configurações de imagens conforme dimensões reais. Conferir contrastes em extremos dos degradês, CTA, texto secundário e foco.
- [x] Executar testes de identidade, primeira tela, alinhamento, texto ampliado e movimento reduzido nos dois motores. Revisar capturas de celular/tablet/desktop e estados abertos; corrigir defeitos encontrados. Commit local da tarefa.

### Task 3: Auditoria de produção e entrega

**Interfaces:** usar os componentes finais e o build de produção; o script recebe `QA_URL` e grava evidências em `output/identidade-vinho/after/`.

- [ ] Implementar o script de auditoria: quatro rotas × onze larguras × dois motores; verificar overflow, imagens, proporções de marca, erros JavaScript e carregamento de fontes. Capturar páginas completas nas larguras-chave e estados abertos.
- [ ] Executar `npm run build`, `node --test tests/brand-assets.test.mjs` e a suíte Playwright inteira; resultados esperados: exit 0, nenhuma violação axe ou regressão funcional.
- [ ] Servir `dist` em porta local própria e rodar a matriz de produção. Conferir 1×/2×/3× para a marca, zoom/texto ampliado e navegação direta; inspecionar as capturas antes/depois.
- [ ] Atualizar README/inventário e relatório com dados reais, capturas, limites e instruções para substituir a marca. Sem afirmar aparelhos físicos ou desempenho em campo.
- [ ] Solicitar uma revisão final independente da branch; tratar falhas importantes, repetir apenas verificações afetadas e registrar decisões.
- [ ] Confirmar `git diff --check`, registrar commits locais, encerrar somente processos próprios e entregar o resultado no checkout solicitado, sem publicação.
