# Iara Santos — Advocacia Previdenciária

Site estático de apresentação profissional, implementado no workspace com React, TypeScript e Vite. Página inicial completa, páginas de aposentadorias e BPC e retorno para endereços inexistentes. **Nenhum deploy foi realizado.**

## Executar localmente

Requer Node.js 22.12+ (validado com Node 24) e npm.

```sh
npm ci
npm run dev
```

Abra a URL exibida pelo Vite, normalmente `http://127.0.0.1:5173`.

```sh
npm run typecheck   # TypeScript
npm run build       # TypeScript e build em dist/
npm run preview     # Prévia local do build
```

As versões exatas estão em `package.json` e `package-lock.json`. A interface usa React Router, Tailwind CSS 4, Motion e Lucide React. Cormorant Garamond e Manrope são servidas localmente em WOFF2, via Fontsource, com `font-display: swap`; suas licenças OFL estão nos respectivos pacotes. Nenhuma chamada ao Google Fonts é necessária.

## Editar conteúdo

**`src/data/site.ts`** centraliza textos, serviços, FAQs, dados profissionais, configurações da foto, links, mensagem do WhatsApp e metadados das páginas. O link de contato é derivado do número e da mensagem usando `encodeURIComponent`.

O plugin local em `vite.config.ts` também preenche os metadados do HTML e o contato sem JavaScript a partir desse mesmo arquivo, tanto no desenvolvimento quanto no build.

- `src/components/`: cabeçalho, contato, rodapé, FAQ e elementos compartilhados.
- `src/pages/`: início, serviços e página de retorno.
- `src/styles.css`: paleta, tipografia, composição, máscara do retrato e ajustes responsivos.
- `public/favicon.svg`: assinatura tipográfica IS provisória, facilmente substituível.

Não existem formulários, envio de e-mail, autenticação, banco de dados, analytics ou armazenamento de dados de visitantes. Os links externos abrem outra aba, com `noopener noreferrer`. O contato é exclusivamente pelo WhatsApp; Instagram é apenas um link para o perfil.

## Retrato e logotipo

O retrato fornecido foi integrado em `public/images/iara-santos.png` (1050 × 1498 px). O PNG já possuía canal alfa e foi copiado sem modificar seus pixels. O logotipo enviado está em `public/images/iara-santos-logo.png`, com fundo removido pela ferramenta de edição de imagens. Ele aparece na seção Sobre e no rodapé (neste último, com apresentação monocromática por CSS). O cabeçalho conserva a assinatura tipográfica compacta para manter a leitura e os controles confortáveis em telas pequenas.

1. Salve o retrato fornecido pela advogada em `public/images/iara-santos.webp` (ou `.png`). Preserve o canal alfa e a proporção original.
2. Em `src/data/site.ts`, preencha `professional.portrait.src` com `/images/iara-santos.webp` e `width`/`height` com as dimensões reais.
3. O componente troca automaticamente a composição tipográfica pelo retrato. O CSS usa `object-fit: cover`, alinhamento superior e máscara opaca até 74% da altura, com transição para transparência na base e apenas nos extremos laterais. No celular, o retrato fica abaixo do contato, em uma composição de altura limitada. O rosto permanece fora das faixas de transição.
4. Confira rosto, transparência, espaço ao redor e enquadramento em 375, 768 e 1440 px. Ajuste `.portrait-composition` e `.hero-portrait` se necessário, sem alterar rosto, cabelo, expressão ou roupa.

Para futuras substituições, prefira WebP com alfa, exportado do original com boa qualidade e aproximadamente 1000–1400 px de largura. Nesta versão foi mantido o PNG original de aproximadamente 1,6 MB para preservar integralmente a imagem fornecida. Se a URL da imagem falhar, a interface retorna à composição tipográfica. Caminhos, dimensões e textos alternativos de retrato e logo ficam em `src/data/site.ts`.

## Preencher a OAB

Em `src/data/site.ts`, substitua a string vazia de `professional.oab` pelo registro correto, incluindo UF, **apenas após confirmação**. O rodapé acrescenta o prefixo `OAB`. Enquanto o campo estiver vazio, nenhum número ou aviso de pendência é exibido publicamente.

## Rotas e hospedagem futura

Rotas: `/`, `/aposentadorias`, `/bpc` e fallback `*`. O Vite atende rotas diretas durante desenvolvimento e prévia. `vercel.json` já define build, pasta `dist` e rewrite para `index.html`, preservando assets e favicon. Em outra hospedagem estática, configure o mesmo fallback de SPA. Não use um servidor de arquivos sem fallback para testar atualização de rotas internas.

Título e descrição mudam por rota. O HTML inicial também contém metadados, idioma `pt-BR`, favicon e contato alternativo sem JavaScript. Não foi inventado domínio ou URL canônica. Por ser SPA, robôs que não executam JavaScript recebem os metadados iniciais; uma futura necessidade de prévias sociais exclusivas por serviço pode ser atendida com pré-renderização.

## Verificação

```sh
npx playwright install chromium
npm test
```

A suíte inicia um Vite local na porta 4173 e verifica:

- Número e mensagem de todos os links WhatsApp; ausência de OAB vazia.
- FAQ pelo teclado (Enter/Espaço).
- Menu mobile, Escape, retorno de foco e navegação por âncora.
- Contato flutuante dentro do espaço do cabeçalho mobile, separado da assinatura.
- Menu rolável em celular na horizontal e botão de contato fora da área de leitura no tablet.
- Páginas de serviço por acesso direto e atualização, retorno ao início e rota inexistente.
- Ausência de rolagem horizontal nas páginas em 375, 768 e 1440 px.
- Auditoria automatizada axe-core WCAG A/AA nessas larguras e com movimento reduzido.
- Capturas da abertura e da página completa em `test-results/` (pasta ignorada pelo Git).

As verificações automatizadas complementam a inspeção visual, sem substituir uma avaliação humana completa de acessibilidade. Os testes validam os destinos dos links; não enviam mensagens nem abrem conversas reais.

Na entrega inicial: TypeScript e build aprovados; **8 testes Playwright aprovados**, sem violações nas auditorias axe executadas. Capturas do Chromium em 375, 768 e 1440 px foram inspecionadas visualmente. A prévia integrada ao chat estava indisponível. A configuração Vercel está preparada, mas não foi validada em um deploy real, pois publicação não fazia parte desta etapa.

## Referência do conteúdo jurídico

Os textos fornecidos foram preservados. As informações sobre natureza assistencial, idade de 65 anos, deficiência, ausência de contribuição prévia, décimo terceiro e pensão foram conferidas na [página oficial do BPC do Ministério do Desenvolvimento Social](https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/beneficios-assistenciais/beneficio-assistencial-ao-idoso-e-a-pessoa-com-deficiencia-bpc). A página não divulga critérios financeiros numéricos, valores, prazos ou promessa de concessão. Confirme novamente em fonte oficial antes de ampliar o conteúdo.

## Pendências

- A foto do escritório e a referência de site não foram usadas nesta atualização; foram integrados o retrato e o logotipo enviados.
- Preencher OAB/UF quando o registro correto for informado.
- Publicação e verificação em hospedagem real ficam para uma etapa posterior, conforme solicitado.
