# Redesign premium MTP — relatório de entrega

Revisão local de 04/11/2026. Branch: `codex/redesign-mtp-premium`. Base: `0d5d67fd9b308840a1653f9bf7509c54e7c8fba3`, correspondente à `main` remota consultada na auditoria. Não houve push, merge ou deploy.

## Auditoria e escopo

O repositório correto foi localizado em `Documents/GitHub/landing-page-enfermeira`, limpo, na branch `feat/hero-stills-and-density`. README, arquitetura, documentação de restauração, código, assets e testes existentes foram lidos. Os 12 testes anteriores e a formatação passaram antes da implementação. Produção foi inspecionada no Chrome em 1440 × 1000 e 390 × 844, com capturas preservadas.

Problemas encontrados: identidade anterior azul, marca tipográfica provisória em vez do MTP, conteúdo de trajetória repetido, cards semelhantes entre seções, regras CSS acumuladas, vídeo disparado pelo scroll e fontes TTF volumosas. Não havia `AGENTS.md` específico, documentos OPERATIONS/DECISIONS ou TypeScript nesse repositório. O projeto BioPlaca de origem do chat não foi modificado.

## Direção visual e decisões

- **Amarelo mel `#E6B83F` protagonista:** hero e contato; ameixa `#493B59` em textos, apresentação e rodapé; lilás `#B49AC8` como contraponto; marfim `#FAF7F0` para leitura.
- **Composição editorial:** tipografia Cormorant Garamond/Manrope, fotografia em arco com contorno deslocado, detalhe floral secundário e ritmo alternado entre superfícies. O detalhe floral não substitui nem modifica o monograma.
- **Hero estável:** fotografia existente, CTA visível, localização e identificação profissional. O vídeo é secundário e depende de ação explícita.
- **Serviços:** quatro linhas numeradas, acordeões com teclado e toque, uma expansão por vez e mensagem específica de WhatsApp.
- **Apresentação e formação unificadas:** narrativa e lista de marcos; todos os dados institucionais existentes preservados sem sugerir endosso.
- **Diferenciais:** separadores no desktop; lista vertical no mobile, sem repetir cards.
- **Jornada:** três passos ligados por SVG horizontal/vertical; desenho progressivo sem controlar o scroll do visitante.
- **Contato:** canais existentes, sem formulário nem coleta de dados clínicos.
- **Arquitetura estática preservada:** GSAP core + ScrollTrigger locais; sem React, Next, Tailwind, Three.js ou bundler. Native details, dialog e Web Animations API resolvem as interações pontuais.

## Marca e fotografia: origem verificável

O anexo `exec-894d05fb-0954-49a3-8f3c-a5f7dc33e66a.png` é um PNG RGBA de 1797 × 875, com monograma preto sobre transparência. No fundo escuro do chat, parecia vazio. Seu original integral está em `public/assets/brand/mtp-original.png`.

SHA-256 do original: `4077fa848360835f300fd47491dbcbafa881e792e56575695f64a2b9759eff51`.

A preparação técnica removeu somente margens transparentes (área útil: x=423, y=103, 986 × 677), aplicou as cores oficiais ao RGB preservando alpha e gerou versões compactas, favicon e imagem de compartilhamento. Não houve redesenho, reconstrução generativa ou vetorização. Variantes:

- `mtp-plum.png`, `mtp-ivory.png`, `mtp-honey.png`: aplicação principal sobre fundos adequados.
- `mtp-*-compact.png`: versões de 210px para header, assinatura e rodapé.
- `favicon.png`: 64 × 64.
- `social.png`: 1200 × 630, monograma ameixa sobre mel.

A hero usa `enfermeira-portrait.webp`, conversão WebP de qualidade 88, sem redimensionamento, retoque ou modificação facial, de `enfermeira-poster.jpg` (720 × 1280). É o poster do projeto anterior à restauração generativa documentada, não um novo original de câmera verificado. SHA-256 do poster: `742ff73b18c422383e781e37ff20a182baf2f76e7102a5b38f618351b8ea5ac5`. A conversão reduz aproximadamente 176 KiB para 62 KiB.

As duas imagens restauradas, o still final anterior e os vídeos mobile/desktop foram preservados integralmente. Nenhuma ferramenta de geração de imagem foi utilizada neste redesign.

As nove fontes TTF foram preservadas e convertidas em WOFF2 com FontTools/Brotli, mantendo latim e extensões, pontuação, euro e setas. Os WOFF2 totalizam aproximadamente 184 KiB; o navegador carrega apenas os pesos usados. A conversão é um passo já concluído de preparação de assets, não uma dependência adicional do build.

## Skills e referências

Foram consultados os diretórios locais de skills e o cache de plugins. `design-dna`, `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`, `gsap-plugins`, `animation-principles` e `motion-art-direction` não foram encontrados. Não se presumiu sua presença nem foram instalados pacotes de skills.

Aplicadas:

- **Sites:** fluxo local, preservação da stack, orientação para sites de apresentação e prévia/QA. O pedido explícito de não publicar prevaleceu sobre o fluxo padrão de hospedagem.
- **Superpowers — verification-before-completion:** evidência de comandos e testes antes das afirmações de conclusão. Encontrada no cache local do plugin.

As orientações de planejamento do Superpowers também foram lidas; a implementação seguiu as etapas já detalhadas no pedido, sem criar um processo adicional de aprovação. APIs de animação conferidas na documentação oficial de [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>) e [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## QA e correções

Verificações executadas:

- `npm run check`: formatação, build e 8 testes Node.
- `npm run test:ui`: 19 testes Playwright em Chrome, incluindo larguras 320, 360, 375, 390, 414, 430, 768, 1024 e 1440.
- Axe: nenhuma violação detectada nas regras WCAG A/AA incluídas, nas páginas desktop/mobile e no diálogo.
- Menu por teclado, Escape, foco nas âncoras e transição mobile/desktop.
- Toque em menu e serviços; Enter/Espaço, cliques rápidos e expansão/colapso.
- Destinatário e mensagem dos quatro links de serviço; telefone e e-mail preservados.
- Vídeo sem download/autoplay antes do clique, pausa ao fechar, Escape, erro de mídia e restauração de foco.
- Reduced motion inicial e alterado em tempo real; fallback sem JS e com falha no GSAP.
- Capturas com passagem por todas as seções, fontes e imagens visíveis carregadas; nenhum overflow horizontal.
- `npm audit`: zero vulnerabilidades na árvore instalada. Lighthouse fixado em 13.5.0, após 13.6.0 trazer advisories transitivos de desenvolvimento.
- `git diff --check`: sem erros de whitespace.

Correções encontradas durante QA: distribuição UMD de GSAP carregada inicialmente como ESM; overflow por largura mínima de títulos; corte no topo do retrato; pausa atrasada do vídeo no Escape; palavras coladas quando `br` era ocultado no mobile; títulos dos diferenciais quebrados em colunas estreitas. Cada problema foi corrigido antes da entrega. Os testes anteriores de autoplay foram substituídos pelo novo contrato explícito de reprodução manual.

Não há `npm run lint` independente nem compilação TypeScript nesta stack. A CI mantém `npm run check` e agora inclui Playwright/axe com Chromium; sua execução remota depende de um futuro push/PR e não foi apresentada como concluída.

## Desempenho comparado

Lighthouse 13.5.0, Chrome headless no mesmo Mac, perfil mobile padrão, servidor Python local sem compressão HTTP. A versão anterior foi construída a partir do SHA base em diretório temporário separado, sem alterar branches. Os números são medições de laboratório, não Core Web Vitals de usuários reais.

| Medida         | Antes — mobile | Redesign — mobile | Redesign — desktop |
| -------------- | -------------: | ----------------: | -----------------: |
| Performance    |             58 |                90 |                100 |
| Acessibilidade |             95 |               100 |                100 |
| Boas práticas  |            100 |               100 |                100 |
| SEO            |            100 |               100 |                100 |
| FCP            |          7,6 s |             2,2 s |              0,5 s |
| LCP            |         10,4 s |             3,3 s |              0,7 s |
| CLS            |          0,018 |             0,001 |                  0 |
| TBT            |           0 ms |              0 ms |               0 ms |

A pontuação mobile variou de 90 a 91 entre as rodadas; a tabela registra a última execução sobre o código final.

Transferência mobile: aproximadamente **1,67 MB → 400 KB**. O LCP mobile de laboratório ainda supera a referência de 2,5 s; reavaliar com cache/compressão reais após eventual publicação. Não há dados de campo de INP, nem autorização para implantação nesta etapa.

## Capturas e prévia

Arquivos locais em `artifacts/qa/` (ignorados pelo Git):

- `before-desktop.png`, `before-mobile.png`: produção anterior.
- `after-desktop.png`, `after-mobile.png`: página completa final.
- `after-desktop-hero.png`, `after-mobile-hero.png`: primeira dobra.
- `after-mobile-small.png`, `after-tablet.png`: 320 e 768px.
- `screenshots.json`: medidas, overflow, carregamento e ausência de requisições MP4.
- `lighthouse-before-mobile.report.html`, `lighthouse-after-mobile.report.html`, `lighthouse-after-desktop.report.html`: relatórios, com JSON correspondente.

Prévia no Mac: **http://127.0.0.1:4175/**. LAN observada na validação: **http://192.168.0.113:4175/**; celular na mesma rede. Ambas as URLs responderam a partir do Mac, o que não comprova alcance a partir de um aparelho físico. Reiniciar com `npm run dev:lan`; o endereço LAN pode mudar.

## Limites e revisão antes de publicar

- O usuário deve aprovar a direção visual. Não houve publicação, merge ou push.
- Testes em Chrome/Chromium com emulação de largura/toque; sem Safari, VoiceOver ou aparelho físico nesta entrega.
- Não há fonte vetorial da logo nem original de câmera externo. Usaram-se os arquivos disponíveis sem fingir maior resolução ou autenticidade de fonte.
- COREN, instituições, atuação atual, disponibilidade e região foram conferidos contra o conteúdo existente e seu histórico de confirmação, não contra uma consulta atual ao conselho ou documentação profissional. A profissional deve validar antes da publicação.
- O teste de WhatsApp valida URLs e mensagens; não houve envio de mensagem nem contato com a profissional.
- Open Graph aponta ao domínio de produção. O novo asset de compartilhamento só existirá nesse domínio após uma publicação autorizada.

## Mapa de arquivos modificados

- `src/index.html`, `src/fonts.css`, `src/styles/{tokens,main,hero}.css`: conteúdo, identidade, composição e tipografia.
- `src/scripts/{main,navigation,services,hero-video,motion}.js`: interação, acessibilidade e animação. `contact.js` foi reutilizado sem alteração.
- `public/assets/brand/`, `enfermeira-portrait.webp`, `font-*.woff2`: derivados dos assets existentes/fornecidos.
- `scripts/build.mjs`, `scripts/capture-preview.mjs`, `servir.py`: distribuição local e QA.
- `tests/`, `playwright.config.mjs`, `.github/workflows/ci.yml`: regressão e CI.
- `package.json`, `package-lock.json`, `.gitignore`: dependências fixadas, scripts e artefatos locais.
- `README.md`, `docs/architecture.md`, `docs/STATUS.md`, este relatório: execução, contratos e estado verificado.
