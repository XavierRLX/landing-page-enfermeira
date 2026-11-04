# Arquitetura

## Escopo e publicação

Site estático em HTML, CSS e ES Modules. Não há backend, banco, formulários ou armazenamento de informações de pacientes. WhatsApp abre uma conversa com mensagem previamente preenchida; não envia mensagens nem confirma agendamentos. Cloudflare Pages publica `dist/` após build na `main`.

O redesign de novembro de 2026 é local, em branch dedicada. O estado publicado deve ser verificado separadamente; consulte [STATUS.md](STATUS.md).

## Conteúdo e estilos

- `src/index.html`: conteúdo, SEO, landmarks, detalhes nativos e diálogo de vídeo.
- `src/styles/tokens.css`: cores aprovadas, tipografia, largura, espaçamentos, foco e transições.
- `src/styles/main.css`: componentes e seções; substitui a folha anterior e suas sobreposições obsoletas.
- `src/styles/hero.css`: hero editorial, retrato e composição específica para mobile.
- `src/fonts.css`: WOFF2 locais, mantendo Cormorant Garamond e Manrope. Arquivos TTF originais preservados.

A marca é raster: alpha do PNG original preservado, recorte das margens transparentes e recoloração nas cores oficiais. Não há SVG fabricado. O retrato da hero é estático, sem geração ou alteração facial; o arquivo WebP deriva do poster existente. A proveniência está no [relatório](redesign-premium.md).

## Interações e aprimoramento progressivo

`contact.js` centraliza o destinatário e as mensagens específicas. Todos os links já têm `href` funcional no HTML, inclusive os de serviço, para falhas de JavaScript.

`navigation.js` controla o menu com `aria-expanded`, Escape, restauração de foco, fechamento ao navegar, sair com foco ou mudar para desktop. Um IntersectionObserver atualiza apenas a aparência do header; sua altura não muda. Sem JavaScript, uma regra `noscript` mantém os links principais visíveis.

`services.js` aprimora elementos `details/summary` com Web Animations API. Funciona por clique, toque, Enter e Espaço em todas as larguras. Uma única linha fica expandida; cliques rápidos cancelam a animação anterior. Sem scripts, o agrupamento nativo por `name` mantém a funcionalidade. Resize e mudança de preferência de movimento encerram animações pendentes. O uso localizado de altura na expansão é intencional: o conteúdo seguinte precisa se reposicionar; não há animação contínua de layout durante scroll.

`hero-video.js` mantém o vídeo fora da hero em um `dialog` nativo. Nenhum MP4 é baixado antes do clique. Os `source[data-src]` recebem `src` apenas na primeira abertura. A seleção mobile/desktop é preservada. O vídeo mantém velocidade normal e controles nativos; há indicação de que não possui áudio. Fechar, Escape ou ocultar a aba pausa a reprodução. Não há retomada automática. Falha de mídia é anunciada via `role=status`, e o diálogo sempre pode ser fechado.

## Movimento

GSAP 3.15.1 core + ScrollTrigger são copiados do pacote npm para `dist/vendor/`. A distribuição UMD é carregada como scripts clássicos `defer`, pois atribui propriedades globais e não pode executar em modo estrito como ES Module. O módulo `motion.js` é carregado de maneira independente das interações essenciais.

A timeline inicial coordena marca, título, texto, CTA, fotografia e detalhe gráfico. As seções usam pequenos deslocamentos, os marcos profissionais entram lateralmente, os índices têm variação de escala e a jornada desenha uma linha SVG. Não há scroll hijacking, pinning, loops nem troca automática do retrato. Os desenhos horizontal e vertical da jornada são controlados por CSS e permanecem corretos sem scripts.

`gsap.matchMedia` restringe a animação a `prefers-reduced-motion: no-preference`. Mudar a preferência reverte as animações e triggers. O CSS nunca esconde conteúdo esperando JS. `main.js` encerra observers, handlers e timelines em `pagehide` e reinicializa apenas no retorno persistido pelo bfcache.

Referências utilizadas: [matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>) e [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## Build e QA

`scripts/build.mjs` gera `dist/` de forma determinística a partir de `src/`, `public/` e dois arquivos de GSAP instalados pelo lockfile. A pasta gerada é descartável. Não há bundler nem framework.

`servir.py` serve somente `dist/`, com suporte a byte ranges para MP4. Por padrão usa loopback; `HOST=0.0.0.0` habilita a prévia na LAN explicitamente solicitada. O servidor local não representa compressão/cache de produção do Cloudflare.

Testes Node cobrem assets, importações, contatos e ciclo de vida do vídeo. Playwright cobre nove larguras, teclado, toque, falhas, reduced motion e axe. Capturas, traces e relatórios Lighthouse ficam em `artifacts/qa/` e não são versionados.

## Informações profissionais

Permanecem os quatro serviços existentes e os dados já confirmados pelo cliente na revisão de 09/10/2026: FABA, especialização neonatal no Ensino Einstein (Hospital Israelita Albert Einstein), atuação anterior no Hospital da Mulher Mariska Ribeiro, atuação atual informada no Hospital Municipal Raul Sertã e COREN-RJ 774772-ENF. As instituições são citadas exclusivamente como formação ou trajetória, sem logos ou endosso. Não foram acrescentadas credenciais, datas, duração de experiência, serviços ou alegações clínicas.
