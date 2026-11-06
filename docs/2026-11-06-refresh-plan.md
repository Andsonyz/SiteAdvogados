# Atualização visual — 06/11/2026

Especificação: `C:/Users/anton/.codex/attachments/07a3c848-f612-492f-839b-9b60820302d9/goal-objective.md`.

## Diagnóstico

- Git limpo no início, commit `4251902`. React 19, TypeScript, Vite 8, npm/lockfile, Router 7, Motion 14, Tailwind 4 e Lucide. Sem script de lint existente.
- Conteúdo e WhatsApp em `src/data/site.ts`; três rotas e fallback em `src/App.tsx`; fontes locais em `src/styles.css`.
- Executada a versão atual no Chromium em 1440 e 375 px: fontes carregadas, sem erros JavaScript ou overflow. O problema de leitura não era fallback: Cormorant 400 com espaçamento de −6,4 px no desktop/−3,5 px no celular, corpo de 15/14 px e FAQ de 13/12 px. Capturas e diagnóstico em `output/qa/baseline/`.
- Oito artes novas dos Downloads examinadas individualmente, além do retrato e logo existentes e da captura de referência. Uma foto de perfil encontrada nos anexos mostra outra pessoa e foi excluída. Foto de escritório identificável não disponível; manter paleta confirmada.

## Plano de execução

1. Preservar os originais; derivar WebP com alfa para as oito artes e fotografias de produção. Registrar medidas, margem, transparência, uso e comparação sobre marfim/marrom em `docs/image-inventory.md`.
2. `site.ts`: acrescentar imagens tipadas e avaliações reais inicialmente vazias; conservar textos profissionais e jurídicos. Trocar Cormorant por Baskervville local, com Manrope 16–18 px para leitura.
3. Criar `Wave`, `DragRail`, `SocialIcons`, `Artwork` e `Reviews`. Atualizar Home, FAQ, serviços e contato com ondas, bordas e composições distintas. Motion para sequência da abertura, revelações, profundidade limitada, FAQ e entrada nas páginas.
4. Verificar comportamento real da faixa: toque horizontal e rolagem vertical, mouse com limiar de arraste, bloqueio de clique após gesto, setas/teclado e controles ocultos quando ambos os serviços couberem. Reutilizar a faixa apenas quando avaliações reais excederem o espaço.
5. Rodar TypeScript, build e suíte existente/ampliada. Percorrer todas as seções em 375/768/1440, auditar fontes/imagens/console/ondas, testar rotas diretas, histórico e movimento reduzido. Revisão final independente; corrigir achados. Documentar evidências e limitações; sem deploy.

## Resultado da execução

- Etapas 1–5 implementadas. Conteúdo profissional e FAQ preservados; avaliações vazias e nenhuma nova modalidade de serviço.
- TypeScript e build passaram. 17 testes aprovados, incluindo auditorias axe nas quatro rotas em 375/768/1440, toque nativo emulado, dados de avaliação restritos ao navegador de teste, histórico e fontes.
- Revisão independente encontrou três falhas: liberação do mouse fora da faixa, preferência de movimento alterada durante a sessão e conflito de transforms entre revelação e hover. Os três testes reproduziram as falhas antes da correção e passaram depois. Suíte inteira aprovada após as correções.
- Relatório de percurso completo das três páginas, sem erros JavaScript/HTTP, imagens quebradas ou overflow, e capturas em `output/qa/final/`. Ondas com cor idêntica à seção seguinte e sem intercepção de eventos.
- Pixels visíveis e alfa do retrato WebP idênticos ao PNG. Dez comparações de transparência sobre marrom e marfim inspecionadas.
- `README.md` e `docs/image-inventory.md` documentam edição, imagens e limites da verificação. Sem lint configurado, sem deploy, sem teste em aparelho físico ou leitor de tela completo. Foto do escritório não localizada; paleta confirmada preservada.
