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
- O atendimento tem três etapas com resumos sempre visíveis e detalhes que abrem de forma independente.
- As oito artes existentes foram mantidas entre as páginas. Os originais estão em `assets/originals/`.
- As três novas ilustrações ficam em `assets/generated/`, com derivados em `public/images/atendimento-*.webp`. Os prompts e a origem estão em [docs/ilustracoes-mobile.md](docs/ilustracoes-mobile.md).
- Avaliações e seu item do menu aparecem somente quando `site.reviews.items` possui relatos reais autorizados. Uma avaliação é estática; várias podem usar o componente de arraste preservado. Não há relatos de teste no conteúdo publicado.

Baskervville e Manrope são locais, em WOFF2, com `font-display: swap` e licença OFL nos pacotes Fontsource. O telefone usa Manrope 600 e algarismos alinhados/tabulares. Não existem formulários, e-mail, autenticação, banco de dados, analytics ou armazenamento de dados de visitantes. O contato é exclusivamente pelo WhatsApp; Instagram é um link para o perfil.

## Verificar a implementação

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

## Conteúdo profissional e limites

Os textos jurídicos aprovados foram preservados. Antes de ampliar critérios de benefícios, confirme em fonte oficial, como a [página do BPC no MDS](https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/beneficios-assistenciais/beneficio-assistencial-ao-idoso-e-a-pessoa-com-deficiencia-bpc). Não são exibidos endereço, credenciais, valores, prazos ou resultados não confirmados.

Título, descrição, favicon e idioma pt-BR estão configurados, sem inventar domínio canônico. O HTML inicial traz metadados e contato alternativo sem JavaScript; a interface é uma SPA. Publicação, verificação em hospedagem real e a OAB correta continuam para etapa posterior.
