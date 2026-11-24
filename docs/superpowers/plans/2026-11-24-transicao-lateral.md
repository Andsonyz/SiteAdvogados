# Transição lateral entre páginas — plano aprovado

Implementar o plano aprovado na conversa, no checkout existente, preservando o trabalho não commitado.

1. Criar testes de navegação que falhem antes da implementação: entrada pela direita, retorno pela esquerda, histórico, âncoras, interrupção e movimento reduzido.
2. Criar um componente compartilhado com Motion, duração de 360 ms e curva `[0.22, 1, 0.36, 1]`. Animar apenas o conteúdo principal, manter cabeçalho/rodapé, uma única página ativa e limpar transformações. Sem animação lateral no primeiro acesso, atualização, hash ou histórico desconhecido.
3. Rastrear posições das localizações durante a sessão. PUSH de serviços entra pela direita; retorno explícito à home pela esquerda; POP conhecido segue a ordem do histórico. Preservar foco, metadados e âncoras. Concluir imediatamente com interação, resize ou movimento reduzido.
4. Executar TypeScript, build, `npm run verify`, matriz visual em Chromium/WebKit (320–1440 px e paisagem), ampliação de texto e regressões da rolagem horizontal. Registrar capturas e limitações. Sem deploy.

Decisão de integração: Motion mini usa a mesma dependência existente e permite cancelar/concluir a transição sem depender do carregamento assíncrono de LazyMotion. A entrada independente da abertura não deve se repetir em retornos animados.
