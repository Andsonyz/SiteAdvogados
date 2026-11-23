# Imagens, entrada e rolagem — 23/11/2026

Implementação local, sem publicação. Conteúdo profissional, retrato original, marca, fontes e destinos do WhatsApp foram preservados. O arquivo central continua `src/data/site.ts`; a OAB continua vazia e oculta.

## Diagnóstico e mudanças

- As artes carregavam, mas algumas estavam pequenas demais: livros em 77 × 38,5 px no celular de 390 px. Foram ampliadas e o filtro de apresentação ficou mais leve, preservando os oito arquivos originais e a proporção das imagens. Os valores `sizes` acompanham a escala maior dos serviços.
- As três ilustrações do atendimento existiam apenas dentro dos painéis fechados. Agora aparecem junto aos títulos e resumos. O botão expande somente o texto complementar, sem duplicar a imagem.
- `Reveal` não animava os blocos com `delay=0`. As entradas agora funcionam em todos os blocos que o utilizam; artes têm entrada e interação discreta no desktop.
- A abertura tem uma sequência breve para nome, retrato e apresentação, sem tela de espera ou bloqueio do contato. Não depende do carregamento do módulo Motion para apresentar conteúdo. Movimento reduzido desliga entradas e transições, inclusive ao alterar a preferência durante a sessão.
- A scrollbar usa vinho e marfim, preservando dimensões e comportamento nativos. Uma linha de leitura acompanha o progresso sob o cabeçalho. O cálculo usa eventos passivos, um quadro de atualização e ResizeObserver; não renderiza React a cada pixel. A aparência da scrollbar móvel depende do sistema operacional.
- A validação encontrou e corrigiu consumo de largura da scrollbar no WebKit, títulos espremidos com texto ampliado e foco programado que podia substituir a primeira interação do usuário. Navegações por âncoras nativas também preservam o foco correto.

## Evidências

| Verificação | Resultado |
| --- | --- |
| TypeScript e build de produção | Aprovados por `npm run build` |
| Suíte completa | **74 aprovados**, Chromium e WebKit, `npx playwright test --workers=1` |
| Arquivos da marca | **3 aprovados**, `npm run test:assets`; transparência e proporção preservadas |
| Matriz de produção | **88 combinações**, quatro rotas × onze tamanhos × dois motores; sem falhas de overflow, imagens, fontes, contatos ou erros JavaScript detectados |
| Axe | Sem violações detectadas nos cenários da suíte; não equivale a certificação de acessibilidade |
| Teclado e toque em emulação | Menu, Escape, foco, âncoras, FAQ, etapas e contatos aprovados |
| Primeira tela | Nome, retrato e CTA presentes em 360 × 640 e 390 × 844 |
| Texto ampliado | 200% de fonte; títulos do atendimento reorganizados sem fragmentar palavras desnecessariamente |
| Zoom real | 400% no Chromium: viewport de 315 CSS px em janela de 1280 px; quatro rotas sem rolagem horizontal |
| Movimento reduzido ao vivo | Zero animações em execução após ativação nos quatro cenários complementares de 390/1440 px e dois motores |
| Progresso | Atualização após scroll, teclado, troca de rota, resize e expansão de conteúdo |
| Revisão independente de código | Sem defeitos adicionais confirmados na leitura final; não substitui inspeção no navegador |

A matriz inclui 320 × 568, 360 × 640, 375 × 812, 390 × 844, 412 × 915, 568 × 320, 639 × 900, 640 × 900, 768 × 1024, 1024 × 900 e 1440 × 900. Rotas: `/`, `/aposentadorias`, `/bpc` e uma rota inexistente. As verificações de contato não enviaram mensagens.

Uma execução simultânea de auditorias foi interrompida por falta de memória. As rodadas seguintes foram executadas em sequência. Os testes de montagem e foco passaram a aguardar condições observáveis, incluindo o scroll automático do WebKit no quadro seguinte. Os testes finais não usaram tentativas automáticas para ocultar falhas.

## Desempenho e limites

Três medições Lighthouse 13.6.0, build local de produção, Chromium headless, perfil mobile de 412 × 823 com DPR 1,75, CPU 4× e rede simulada padrão. Resultados: desempenho **93 / 93 / 92**, mediana **93**; acessibilidade, boas práticas e SEO **100** nas três execuções. LCP: 3,163 / 3,172 / 3,192 s; mediana **3,17 s**. CLS: **0**. TBT mediano: **35,5 ms**.

**A meta de LCP de 2,5 s não foi atingida.** O retrato tem prioridade alta e descoberta no HTML inicial; ainda há trabalho no caminho de renderização inicial. TBT não comprova INP. Não houve medição em campo, teste com leitor de tela nem conferência em Android/iPhone físicos: **validado em emulação; validação física pendente**. Não declarar aprovação de Core Web Vitals a partir desses resultados.

## Capturas e reprodução

- [Antes: atendimento no celular](../output/motion-refresh/before/attendance.png)
- [Depois: abertura no celular](../output/motion-refresh/motion/chromium-opening-390.png)
- [Depois: atendimento no celular](../output/motion-refresh/motion/chromium-attendance-closed-390.png)
- [Depois: atendimento no desktop](../output/motion-refresh/motion/chromium-attendance-closed-1440.png)
- [Texto ampliado no WebKit](../output/motion-refresh/motion/webkit-attendance-text200.png)
- [Gravação da abertura e navegação](../output/motion-refresh/motion/mobile-demo.webm)
- [Matriz de produção](../output/motion-refresh/after/report.json), [estados e movimento](../output/motion-refresh/motion/report.json), [zoom](../output/motion-refresh/zoom/report.json), [Lighthouse](../output/motion-refresh/lighthouse/summary.json), [log dos 74 testes](../output/motion-refresh/playwright-final.log).

Com `npm run preview -- --port 5187 --strictPort` ativo, executar as auditorias em sequência:

```powershell
$env:QA_URL = 'http://127.0.0.1:5187'
$env:QA_OUTPUT = 'output/motion-refresh/after'
node scripts/identity-qa.mjs
node scripts/motion-qa.mjs
$env:QA_OUTPUT = 'output/motion-refresh/zoom'
node scripts/zoom-qa.mjs
```

Referências técnicas: [Motion — scroll animations](https://motion.dev/docs/react-scroll-animations) e [MDN — scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-color). Foram usados os princípios de animações pontuais e personalização da barra nativa; não foi acrescentada rolagem artificial.
