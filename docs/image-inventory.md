# Inventário e escolha das imagens — 06/11/2026

Todos os arquivos de produção abaixo foram abertos individualmente e examinados. Os oito novos originais estão preservados em `assets/originals/`; o retrato e o logo originais continuam em `public/images/*.png`. A captura de inspiração está em `assets/references/`, fora da pasta publicada.

As medidas abaixo são do original. Os derivados WebP, com dimensões reservadas no HTML, estão em `public/images/`. Medidas, tamanhos, SHA-256 e caixa de conteúdo (alfa >16) são reproduzíveis em `assets/inventory.json` por `node scripts/prepare-assets.mjs`. O script usa Sharp somente para conversão e redimensionamento: nenhuma arte nova foi gerada nesta atualização.

| Imagem analisada | Dimensões / inspeção | Aplicação |
| --- | --- | --- |
| Retrato transparente de Iara | 1050 × 1498, vertical; alfa real, rosto nítido, margem transparente à esquerda; PNG e WebP sem perdas comparados | Abertura, proporção preservada, corte superior com rosto completo, máscara apenas na base |
| Retrato transparente `(1)` | Mesmo tamanho e SHA-256 do anterior | Duplicata exata; escolhida a versão sem sufixo, sem duplicar requisições |
| Logo Iara Santos | 1363 × 1154; derivado WebP 512 × 433; fundo transparente; detalhes delicados | Sobre e rodapé; apresentação monocromática via CSS apenas no rodapé |
| Documento com relógio | 1536 × 1024, horizontal; desenho gráfico com realces âmbar, margem lateral ampla (conteúdo central), alfa real | Imagem ampla do card Aposentadorias, em superfície clara para preservar os traços escuros |
| Mãos acolhendo figuras humanas | 1536 × 1024, horizontal; arte gráfica com acolhimento e acessibilidade, alfa real | Imagem ampla do card BPC; superfície clara com contraste |
| Balões de conversa jurídica | 1536 × 1024, horizontal; arte gráfica com balança e linhas, alfa real | Composição de atendimento online, próxima às três etapas |
| Livros jurídicos com caneta-tinteiro | 1774 × 887, horizontal; couro e metal realistas e nítidos, pequena margem, alfa real | Composição ampla em Sobre; profundidade limitada a 6/5 px no desktop |
| Balança da Justiça em latão | 1312 × 1199, quase quadrada; textura realista e correntes finas, alfa real | Abertura da página Aposentadorias |
| Martelo em nogueira | 1774 × 887, horizontal; madeira realista, alfa real; base inteira preservada | Composição horizontal de orientação na página Aposentadorias; ilustração institucional, sem ampliar serviços |
| Justiça em bronze | 1024 × 1536, vertical; estátua e espada inteiras, halo âmbar suave incorporado ao original, alfa real | Composição vertical junto às Dúvidas e abertura do BPC |
| Conjunto de balança, livros e caneta | 1752 × 897, horizontal; composição única realista, alfa real; não desmembrada | Contato, em seção diferente daquela com livros isolados |
| Captura “Gold and Black Luxury Website…” | 736 × 1318, captura vertical de outro site | Somente inspiração para hierarquia, escala da fotografia e curvas; não publicada como ilustração |
| `FotoParaPerfil.original.png`, encontrado nos anexos | 840 × 840; foto de outra pessoa | Excluída: não é Iara nem referência do escritório |

Não foi localizada uma foto identificável do escritório nos anexos e assets disponíveis. A paleta confirmada no briefing foi mantida; nenhuma foto de local diferente foi apresentada como escritório de Iara.

## Verificação de transparência e nitidez

- Cada original e derivado foi composto sobre `#F4EDE3` e `#35251F` no Chromium. Comparações em `output/qa/final/alpha-*.png`. Na inspeção do PNG em preto, os canais parcialmente transparentes podem parecer borrados; a composição real nos dois fundos revelou os contornos corretos.
- Os três desenhos gráficos perdem contorno sobre marrom, razão para superfície clara nos cards e no atendimento. Peças de bronze/madeira mantêm definição em ambos os fundos. O halo da estátua faz parte da arte original e foi preservado.
- Nenhuma margem foi removida automaticamente; as composições usam `object-fit: contain` para não cortar correntes, espadas e bases. O retrato usa enquadramento superior e somente degradê inferior.
- A conversão sem perdas do retrato foi verificada sobre os dados RGBA decodificados: **zero diferenças no alfa e zero diferenças nos pixels visíveis**. Os dois arquivos recebidos e o PNG preservado também têm o mesmo SHA-256. Não houve alteração de rosto, roupa, cabelo, expressão ou identidade.
- Os oito derivados jurídicos somam aproximadamente 0,90 MB, frente a 10,67 MB dos PNG originais; carregam de forma preguiçosa. O retrato WebP tem aproximadamente 1,07 MB e prioridade alta, preservando qualidade integral.
