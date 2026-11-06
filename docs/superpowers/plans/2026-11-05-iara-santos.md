# Site Iara Santos — plano de implementação

**Objetivo:** implementar localmente a especificação completa fornecida na conversa.
**Arquitetura:** SPA estática React/TypeScript com React Router, Vite, Tailwind e Motion. Conteúdo tipado em `src/data/site.ts`; componentes compartilhados para navegação e contato; páginas inicial, serviços e retorno 404.
**Especificação:** briefing do usuário de 05/11/2026, que já define e aprova direção contemporânea, cores, tecnologias, estrutura, textos e ações. Não publicar.

## Decisões e restrições
- Trabalhar diretamente no workspace solicitado, inicialmente vazio, sem criar outra cópia.
- Nenhum retrato ou referência anexada está acessível no workspace/conversa. Preparar componente com máscara e configuração de imagem; usar composição tipográfica temporária, sem fotografia substituta ou informação de pendência na interface pública.
- OAB vazia e oculta até preenchimento. Sem fatos profissionais adicionais.
- Preservar integralmente textos fornecidos. Conteúdo BPC conferido no Ministério do Desenvolvimento Social; manter fonte no README.
- Fontes locais por pacotes Fontsource, sem chamadas a Google Fonts em produção.
- Sem formulário, armazenamento, autenticação, analytics ou envio de mensagens.

## Etapas
- [x] Base: dependências compatíveis, configuração TypeScript/Vite/Tailwind, fontes, metadados, favicon e fallback Vercel.
- [x] Conteúdo e experiência: arquivo central, cabeçalho acessível, abertura, sobre, serviços, etapas, FAQ, contato, rodapé e rotas. Retrato real permanece dependente do fornecimento do arquivo.
- [x] Verificação: testes de navegação/teclado, FAQ, WhatsApp, rotas diretas, movimento reduzido e larguras 375/768/1440; TypeScript, build e inspeção visual.
- [x] Entrega: README com instalação, comandos, fotografia, OAB, hospedagem e limites de validação.

## Foco da revisão
1. Menu fechado não pode manter links invisíveis focáveis; Escape deve devolver foco ao botão.
2. Âncoras devem funcionar da inicial e das páginas internas, inclusive pelo histórico do navegador.
3. A ausência de fotografia não pode gerar imagem quebrada; fotografia futura deve preservar rosto e proporção.
4. Conteúdo longo e zoom não podem causar rolagem horizontal ou sobreposição com o contato flutuante.
5. OAB vazia deve permanecer ausente da interface; URLs WhatsApp devem conservar número e mensagem exatos.

## Registro da execução
- `npm install`: dependências exatas e lockfile, auditoria sem vulnerabilidades na instalação.
- Corrigidos imports de fontes e ícone incompatíveis com as versões instaladas.
- Revisão visual identificou sobreposição de barra inferior; contato transferido para espaço reservado no cabeçalho mobile.
- Revisão independente encontrou sobreposição do botão no tablet e menu alto demais em orientação horizontal. Teste reproduziu CTA fora do viewport (y=356,75 para altura320), depois passou com menu rolável e contato no cabeçalho do tablet.
- `npm test`: 8/8 aprovados, incluindo axe WCAG A/AA em todas as rotas nas três larguras.
- Capturas reais do Chromium da abertura nas três larguras e páginas completas inspecionadas.
- Metadados do HTML inicial gerados da configuração central; rotas atualizam título/descrição no cliente.
- Nenhum commit, envio de mensagem ou deploy realizado. Sem retrato ou referências visuais disponíveis; integração e conferência dessa parte ficam pendentes.
