# Iara Santos — Advocacia Previdenciária

Site estático em React, TypeScript e Vite. Inclui página inicial, Aposentadorias, BPC e retorno para rotas inexistentes. A identidade de 23/11/2026 usa o vinho `#653D3D`, o marfim `#F3EDDF` e a nova logomarca fornecida, com composição editorial e prioridade para o celular. Nenhuma publicação foi realizada nesta etapa.

## Instalação e execução

Requer Node.js 22.12+ e npm. Validado com Node 24.

```sh
npm ci
npm run dev
```

Abra a URL exibida pelo Vite. Para conferir o build de produção:

```sh
npm run typecheck
npm run build
npm run preview -- --port 5183 --strictPort
```

O build gera `dist/`. React Router atende `/`, `/aposentadorias`, `/bpc` e o retorno `*`. `vercel.json` conserva o fallback de SPA necessário para acessar e atualizar URLs internas. Em outro host estático, configure fallback para `index.html`.

## Editar conteúdo, fotografia e OAB

**`src/data/site.ts`** centraliza textos, dados profissionais, serviços, dúvidas, etapas do atendimento, imagens, links, mensagem do WhatsApp e metadados. O link WhatsApp é derivado do número e da mensagem usando `encodeURIComponent`.

O retrato original fica em `public/images/iara-santos.png`. Os derivados de 360, 480, 640 e 1050 px usam transparência e compressão de alta qualidade; `srcSet` e `sizes` permitem ao navegador selecionar a resolução adequada. A aparência, o rosto e a roupa não foram editados. Para substituir a fotografia:

1. Preserve o arquivo original, sua transparência e sua proporção.
2. Ajuste caminhos, dimensões e texto alternativo de `professional.portrait` na configuração central.
3. Execute `node scripts/prepare-responsive-media.mjs` se estiver usando o mesmo caminho de origem.
4. Confira o enquadramento da face e do cabelo em 320, 360, 390, 768 e 1440 px, inclusive com densidade 2× e 3×. A máscara atua na base da composição.

Preencha `professional.oab` somente com o registro correto, incluindo UF. Enquanto estiver vazio, nenhum número ou aviso de pendência será exibido.

## Nova logomarca e cores

A referência original está preservada em `assets/brand/referencia-original.png`. A marca foi preparada por separação determinística entre as duas cores da referência, sem redesenhar ou regenerar letras. Os mestres transparentes em marfim/vinho e o recorte do monograma estão na mesma pasta. Os WebP de 192, 384 e 768 px ficam em `public/images/marca-iara-*`; o favicon usa o monograma original. Os arquivos da marca anterior foram preservados, mas não são renderizados.

`brandAssets`, em **`src/data/site.ts`**, define caminhos, dimensões, texto alternativo e tamanhos responsivos. O cabeçalho e o rodapé usam a marca clara; a assinatura do Sobre usa vinho. Para reproduzir os derivados:

```sh
node scripts/prepare-brand.mjs
npm run test:assets
```

Para substituir a marca, preserve a nova fonte em `assets/brand/`, ajuste no script as cores e a região do monograma se a composição mudar, e atualize dimensões/caminhos em `brandAssets`. Essa extração é específica para a referência de duas cores. Confira a legenda, os traços finos e a transparência no navegador; prefira o arquivo vetorial oficial caso a profissional o disponibilize.

Os tokens de cor e degradê estão no início de `src/editorial.css`; as cores base do Tailwind ficam em `src/styles.css`. Os arquivos originais das artes e do retrato não mudaram: o tratamento cromático discreto das ilustrações é feito por CSS e não afeta a fotografia ou a marca.

## Composição e ilustrações

- `src/styles.css`: fontes locais, Tailwind e estilos de base.
- `src/editorial.css`: sistema responsivo único, degradês, tipografia, espaçamento e composições.
- Serviços aparecem em lista vertical até tablet e em duas colunas no desktop.
- Os três princípios do atendimento usam uma seção horizontal ilustrada. No desktop com altura suficiente, a rolagem vertical percorre os painéis enquanto a seção permanece fixa temporariamente. No celular, em janelas baixas ou com movimento reduzido, a navegação é horizontal nativa por toque, arraste, botões e teclado. A roda e o toque não são interceptados globalmente.
- O atendimento tem três etapas com resumos e ilustrações sempre visíveis; os detalhes abrem de forma independente.
- As oito artes existentes foram mantidas entre as páginas. Os originais estão em `assets/originals/`.
- As três novas ilustrações ficam em `assets/generated/`, com derivados em `public/images/atendimento-*.webp`. Os prompts e a origem estão em [docs/ilustracoes-mobile.md](docs/ilustracoes-mobile.md).
- A abertura tem entrada breve sem tela de espera. As seções e artes entram uma vez ao rolar. `prefers-reduced-motion` cancela os movimentos, inclusive quando alterado durante a sessão.
- A barra de rolagem usa a paleta da marca e as dimensões nativas do navegador. `src/components/ScrollProgress.tsx` mostra o progresso sob o cabeçalho, sem interferir em toque, roda ou teclado. A aparência da barra nativa também depende do sistema operacional.
- Avaliações e seu item do menu aparecem somente quando `site.reviews.items` possui relatos reais autorizados. Uma avaliação é estática; várias podem usar o componente de arraste preservado. Não há relatos de teste no conteúdo publicado.

Baskervville e Manrope são locais, em WOFF2, com `font-display: swap` e licença OFL nos pacotes Fontsource. O telefone usa Manrope 600 e algarismos alinhados/tabulares. Não existem formulários, e-mail, autenticação, banco de dados, analytics ou armazenamento de dados de visitantes. O contato é exclusivamente pelo WhatsApp; Instagram é um link para o perfil.

## Verificar a implementação

```sh
npm run doctor
npm run verify
```

`verify` executa o diagnóstico de memória, os testes do inicializador, uma inicialização real do Vite com reconstrução do cache (`--force`), TypeScript, build, testes da marca e a suíte completa com um navegador por vez. `npm run verify:dev` permite repetir apenas o teste de inicialização, abertura e atualização das três páginas. A porta isolada 5191 deve estar livre para essa verificação.

`npm run dev` e o build configuram os pools nativos de Rolldown e Rayon com duas threads antes de carregar o compilador. Valores positivos definidos em `ROLLDOWN_WORKER_THREADS` e `RAYON_NUM_THREADS` são respeitados. Os ícones usam as entradas individuais oficiais do Lucide, evitando pré-processar todo o catálogo. Não é necessário alterar as dependências ou aumentar o heap do Node para aplicar essas mudanças.

Se aparecer `memory allocation ... failed`, `out of memory` ou erro de paginação, execute `npm run doctor`. No Windows, ele mostra RAM livre e memória disponível até o limite de comprometimento, que também depende do arquivo de paginação. A inicialização é interrompida quando a leitura encontra memória crítica; a leitura é apenas uma fotografia do momento e outros aplicativos ainda podem consumir recursos depois dela. Feche aplicativos não utilizados e confira nas configurações do Windows se a paginação é gerenciada pelo sistema. O projeto não altera configurações do sistema nem encerra outros programas. As tentativas anteriores chegaram a apenas 230–280 MB de memória virtual livre; essa situação também interrompeu navegadores e o próprio PowerShell.

```sh
npx playwright install chromium webkit
npm test
npm run test:assets
```

A suíte usa Chromium e WebKit, cobrindo interações, fontes, links, rotas, avaliações condicionais, imagens responsivas, movimento reduzido, texto a 200%, composição da primeira tela e auditorias axe WCAG A/AA. A matriz inclui 320×568, 360×640, 375×812, 390×844, 412×915, 568×320, 768×1024 e 1440×900.

Com a prévia de produção na porta 5183:

```sh
node scripts/mobile-qa.mjs
node scripts/zoom-qa.mjs
node scripts/interaction-qa.mjs
```

`QA_URL` pode apontar para outro endereço local. As capturas e os relatórios ficam em `output/mobile-redesign/`, ignorado pelo Git. O teste de zoom usa um perfil isolado do Chromium e altera o zoom real para 400%, restaurando-o ao terminar. Não modifica o perfil pessoal do usuário.

As medições Lighthouse usam a versão 13.6.0 em cache npm, sem adicionar dependências de interface. No PowerShell, após iniciar `npm run preview -- --port 5184 --strictPort`:

```powershell
$env:CHROME_PATH = node --input-type=module -e "import { chromium } from '@playwright/test'; process.stdout.write(chromium.executablePath())"
New-Item -ItemType Directory -Force -Path output/identidade-vinho/lighthouse | Out-Null
1..3 | ForEach-Object {
  npm exec --yes --package=lighthouse@13.6.0 -- lighthouse http://127.0.0.1:5184/ --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=html --output=json --output-path="output/identidade-vinho/lighthouse/run-$_" --quiet
}
```

O relatório do redesign mobile anterior está em [docs/validacao-mobile-2026-11-22.md](docs/validacao-mobile-2026-11-22.md). Os resultados da identidade atual estão no relatório de 23/11 abaixo. Testes automáticos não substituem revisão com leitor de tela ou aparelho físico. As verificações de links não enviam mensagens.

A revisão posterior de centralização está em [docs/alinhamento-2026-11-22.md](docs/alinhamento-2026-11-22.md). `tests/alignment.spec.ts` verifica os alinhamentos de botões, contato e rodapé nas três páginas, incluindo os pontos de transição de 639/640 px e a largura de 1024 px. `scripts/alignment-qa.mjs` gera as capturas complementares em `output/alinhamento/` e aceita `QA_URL` (padrão: `http://127.0.0.1:5182`).

A auditoria da identidade atual está em [docs/identidade-vinho-2026-11-23.md](docs/identidade-vinho-2026-11-23.md). Com o build servido na porta 5184, `node scripts/identity-qa.mjs` confere as quatro rotas em onze larguras e dois motores, salva capturas e registra contraste, fontes, imagens e destinos do WhatsApp em `output/identidade-vinho/after/report.json`. Também aceita `QA_URL`.

A revisão posterior de imagens, entrada e rolagem está em [docs/imagens-movimento-scroll-2026-11-23.md](docs/imagens-movimento-scroll-2026-11-23.md). Em máquinas com pouca memória, execute `npx playwright test --workers=1` e as auditorias em sequência. `scripts/identity-qa.mjs` aceita `QA_OUTPUT` para manter relatórios de revisões diferentes. Com a prévia na porta 5187, `node scripts/motion-qa.mjs` gera capturas e uma gravação em `output/motion-refresh/motion/`; também aceita `QA_URL`.

A revisão de textos formais, seção horizontal e inicialização do Vite está em [docs/textos-horizontal-2026-11-24.md](docs/textos-horizontal-2026-11-24.md), com capturas antes/depois, resultados dos testes e limitações. `scripts/horizontal-qa.mjs` verifica roda, retorno, toque emulado, âncoras e janela baixa no build de produção. Use `QA_URL` e `QA_OUTPUT` para escolher a prévia local e a pasta das evidências.

## Transição entre páginas

O conteúdo principal entra pela direita ao abrir serviços e pela esquerda no retorno ao início. O histórico conhecido orienta Voltar/Avançar. A transição usa `motion/mini`, dura 360 ms e termina imediatamente com interação ou preferência por movimento reduzido. Cabeçalho e rodapé permanecem fora da área animada. Acesso direto, atualização e âncoras não iniciam o movimento lateral.

`tests/navigation-transition.spec.ts` cobre direções, histórico, interrupções e tamanhos de tela. Com `npm run preview -- --port 5189 --strictPort` em outro terminal, `node scripts/route-transition-qa.mjs` salva capturas e relatório em `output/route-transition/visual/`; aceita `QA_URL` e `QA_OUTPUT`. Os quadros intermediários são pausados em 100 ms somente para capturas reproduzíveis; os testes de navegação verificam a execução sem pausa. A auditoria também interrompe animações pausadas para comprovar que a interação as conclui, sem depender do término natural dos 360 ms.

O relatório desta entrega está em [docs/transicao-lateral-2026-11-24.md](docs/transicao-lateral-2026-11-24.md).

A [auditoria final](docs/auditoria-final-2026-11-24.md) relaciona cada requisito às evidências, incluindo quatro testes complementares em `tests/completion.spec.ts`, limites reais de textos/controles ampliados e abertura isolada do contato sem enviar mensagens. As novas medições Lighthouse e a conferência final da rolagem estão vinculadas nesse relatório.

## Conteúdo profissional e limites

Os títulos legíveis da referência de 24/11 foram incorporados. Os trechos pequenos demais para transcrição foram reescritos com autorização do usuário, em linguagem formal e dentro dos fatos profissionais confirmados. O conteúdo continua centralizado em `src/data/site.ts`. Antes de ampliar critérios de benefícios, confirme em fonte oficial, como a [página do BPC no INSS](https://www.gov.br/inss/pt-br/noticias/como-pedir-beneficio-de-prestacao-continuada-bpc). Não são exibidos endereço, credenciais, valores, prazos ou resultados não confirmados.

Título, descrição, favicon e idioma pt-BR estão configurados, sem inventar domínio canônico. O HTML inicial traz metadados e contato alternativo sem JavaScript; a interface é uma SPA. Publicação, verificação em hospedagem real e a OAB correta continuam para etapa posterior.
