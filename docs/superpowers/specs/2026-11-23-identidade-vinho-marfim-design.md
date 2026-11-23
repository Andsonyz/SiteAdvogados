# Iara Santos — identidade vinho e marfim

## Intenção e decisões confirmadas

Retrabalhar integralmente a aparência do site a partir da nova logomarca enviada pelo usuário. A direção permanece editorial, contemporânea, formal e acolhedora, com prioridade para o celular. O usuário escolheu preservar as artes jurídicas existentes, ajustando escala e integração à nova paleta; a marca e o retrato serão os protagonistas.

Referência: `C:/Users/anton/.codex/attachments/22ead345-fac6-48cf-9c97-1c9c8efcbb80/image-1.png`. A imagem contém uma nova assinatura com monograma IS, nome e “Advocacia e Assessoria Jurídica”. Essa assinatura substituirá a marca azul/dourada anterior em todas as ocorrências. A especialidade informativa do site continuará “Advocacia Previdenciária”.

## Abordagens consideradas

1. **Editorial com artes discretas — escolhida.** Reorganiza a identidade de todas as rotas, preservando fotografias, artes, conteúdo e interações. Mantém o contraste visual que o usuário já valorizou e aproveita a base acessível existente.
2. **Composição com menos artes.** Daria maior presença exclusiva à marca e ao retrato, mas reduziria as ilustrações atuais. Não foi escolhida pelo usuário.

## Sistema visual proposto

- Cores principais extraídas dos pixels da referência: vinho `#653D3D` e marfim `#F3EDDF`.
- Vinho mais profundo, aproximadamente `#43282D`, para texto, rodapé e extremos dos fundos escuros; tons claros derivados do marfim para áreas longas de leitura. Esses derivados são escolhas de implementação, sujeitos à verificação de contraste.
- Degradês discretos entre tons da mesma família, sem brilho, dourado nos controles ou fundos de vidro. Abertura, contato e rodapé escuros; corpo predominantemente claro.
- Baskervville nos títulos, Manrope no corpo, controles e telefone. As duas fontes já são locais. Títulos com escala editorial e corpo de aproximadamente 17 px em `rem`, entrelinha de 1,6.
- Divisórias finas, espaçamento consistente e pouca ornamentação. Não transformar todas as seções em cartões ou centralizar textos longos.
- Artes originais preservadas, menores no celular; integração por escala, respiro e tratamento cromático discreto de apresentação, sem mudar os arquivos originais. O retrato não será recriado ou alterado.

## Logomarca e arquivos

- Usar a nova marca fornecida, preservando desenho, proporções, letras e assinatura; não redesenhar ou regenerar por IA.
- Preparar recortes e derivados otimizados por processamento determinístico da imagem original, separando apenas o fundo uniforme quando necessário. Conferir bordas e letras contra o original.
- Marca completa no rodapé e na assinatura do conteúdo; versão adequada ao espaço do cabeçalho, sem tornar sua legenda uma informação necessária para navegar. Toda imagem da marca terá nome acessível.
- Criar favicon coerente a partir do próprio monograma fornecido. Preservar os arquivos anteriores como fontes, sem continuar exibindo a marca antiga.
- Novos caminhos e dimensões ficam em `src/data/site.ts`. Nenhuma nova biblioteca de interface é necessária.

## Composição por área

| Área | Resultado proposto |
| --- | --- |
| Cabeçalho | Nova logomarca à esquerda; navegação e contato à direita no desktop. No celular, marca, WhatsApp e menu com alvos de 44 px e altura compacta, aproximadamente 72–80 px. |
| Abertura | Fundo vinho, nome em marfim e retrato integrado à direita. No celular, nome e rosto juntos, apresentação e WhatsApp logo abaixo, seguidos pelas modalidades e experiência. Sem caixa rígida atrás da fotografia. |
| Sobre | Fundo marfim, título editorial e livros discretos; texto aprovado em coluna de leitura; assinatura com nova marca. |
| Áreas | Dois destaques separados por regras e respiro: fluxo vertical em celular/tablet, duas colunas no desktop. Imagens pequenas, descrições completas e links explícitos. |
| Atendimento | Três etapas numeradas; títulos e resumos sempre visíveis, detalhes independentes com as três ilustrações já existentes. |
| Dúvidas | Cabeçalho e estátua menores; perguntas alinhadas à esquerda, respostas acessíveis e aviso geral preservado. |
| Avaliações | Continuam ocultas enquanto a coleção estiver vazia. Não criar relatos. |
| Contato | Vinho e marfim, CTA claro, telefone Manrope, modalidades e Instagram. Centralização no celular; colunas e alinhamentos editoriais em telas maiores. Arte final em escala secundária. |
| Rodapé | Nova marca, identificação, localidade, Instagram e direitos. Composição centralizada no celular, horizontal onde houver espaço. |
| Aposentadorias e BPC | Mesmo sistema de cores, tipografia, marca e botões; aberturas compactas com contato próximo à introdução, conteúdo em leitura vertical, arte de apoio e retorno preservados. |
| Rota inexistente | Mesmo sistema visual, marca compartilhada, retorno à página inicial e WhatsApp. |

## Restrições e invariantes

- Manter React, TypeScript, Vite, React Router, Motion e Tailwind; conteúdo centralizado e tipado.
- Não alterar textos jurídicos ou acrescentar credenciais, áreas, preços, prazos, documentos obrigatórios, resultados, endereço ou depoimentos.
- OAB continua vazia e não aparece na interface.
- Todos os contatos preservam `https://wa.me/5584981363772` e a mensagem inicial existente; nenhuma mensagem será enviada nos testes.
- Manter FAQ, etapas, navegação, âncoras, rotas diretas e menu com Escape e retorno de foco.
- Não publicar nem fazer deploy. Preservar a configuração de hospedagem estática existente.

## Critérios de aceitação e validação

1. Nenhuma ocorrência visível da marca anterior; nova marca reconhecível, nítida e sem deformação nas quatro rotas.
2. Toda a interface adota vinho/marfim, incluindo estados abertos, hover, foco, páginas de serviço e 404. As artes preservadas não podem reintroduzir o caramelo como cor dos controles.
3. Nome, rosto e primeiro CTA integralmente visíveis em 360 × 640 e 390 × 844 com texto padrão. Com ampliação, alturas flexíveis e conteúdo utilizável.
4. Verificar 320, 360, 375, 390, 412, 568, 639, 640, 768, 1024 e 1440 px, incluindo paisagem; sem rolagem horizontal, sobreposição ou texto cortado. Revisar visualmente capturas mobile, tablet e desktop, além de menu, FAQ e etapas abertos.
5. Teclado, foco visível, alvos de 44 px, contraste mínimo de 4,5:1 para texto comum e 3:1 para texto grande; texto ampliado a 200% e preferência de movimento reduzido, inclusive alterada durante a sessão.
6. Executar TypeScript, build e suíte Playwright em Chromium e WebKit. Ajustar apenas testes que codifiquem a identidade antiga; preservar a cobertura de comportamento e acessibilidade. Conferir carregamento das imagens e fontes e os destinos de contato.
7. Conferir o build de produção em navegador e registrar capturas antes/depois, comandos, resultados e limitações reais. Não afirmar testes físicos ou desempenho em campo sem evidência.

## Decisões deixadas à implementação

Medidas exatas entre os limites definidos, tons derivados, recortes técnicos da marca, intensidade do tratamento cromático das artes e transições responsivas serão ajustados na revisão visual. Não há autorização para mudar dados profissionais, funcionalidades ou o desenho da nova marca.
