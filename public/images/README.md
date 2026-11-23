# Imagens da marca

**Marca atual (23/11/2026):** `marca-iara-marfim-{192,384,768}.webp` e `marca-iara-vinho-{192,384,768}.webp`, derivados da nova referência preservada em `assets/brand/`. Configuração em `brandAssets` no arquivo central. Preparação: `node scripts/prepare-brand.mjs`; validação: `npm run test:assets`. Não houve redesenho ou regeneração por IA. O favicon usa o monograma da mesma fonte.

Os arquivos `iara-santos-logo.*` abaixo são históricos e foram mantidos como fontes; não aparecem mais no site.

- `iara-santos.png`: retrato original 1050 × 1498, PNG com alfa, copiado sem alteração dos pixels.
- `iara-santos-logo.png`: logo fornecido, com fundo removido pela ferramenta image_gen, 1363 × 1154, PNG com alfa.
- `iara-santos.webp`: derivado sem perdas, com pixels visíveis e alfa idênticos aos do PNG.
- `iara-santos-logo.webp`: derivado histórico 512 × 433 da marca anterior.
- Outras artes WebP: originais em `assets/originals/`; uso e inspeção em `docs/image-inventory.md`.

As configurações estão em `site.professional.portrait` e `site.professional.logo`, em `src/data/site.ts`.
As artes jurídicas ficam no objeto `artwork` no mesmo arquivo.
Ao substituir, informe as dimensões reais e confira o enquadramento em 375, 768 e 1440 px.
