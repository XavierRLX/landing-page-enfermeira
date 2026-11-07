# Maria Thereza Pugliese · Enfermagem domiciliar

Landing editorial estática em **HTML semântico, CSS e JavaScript ES Modules**, com fontes e assets locais. Identidade em amarelo mel, lilás, ameixa e marfim; logotipo MTP fornecido pelo responsável; retrato estático e contato direto pelo WhatsApp.

## Case de engenharia

**[Ver site publicado](https://maria-thereza-enfermagem.pages.dev/)** · **[Código-fonte](https://github.com/XavierRLX/landing-page-enfermeira)**

O desafio foi construir uma presença digital profissional com **identidade visual própria, performance, acessibilidade e manutenção simples**, sem introduzir React ou infraestrutura de backend quando uma arquitetura estática resolve o problema.

### Decisões técnicas

- **HTML semântico + CSS organizado por responsabilidade:** facilita evolução visual e favorece acessibilidade e indexação.
- **JavaScript ES Modules:** comportamentos isolados para menu, serviços, contatos, motion e mídia.
- **GSAP com carregamento controlado:** animações progressivas que respeitam `prefers-reduced-motion`, sem bloquear a leitura do conteúdo.
- **Vídeo sob demanda:** reduz o custo de carregamento inicial quando o visitante não solicita reprodução.
- **Build estático e deploy na Cloudflare Pages:** operação simples, sem credenciais de banco ou servidor de aplicação.
- **QA de interface:** verificações automatizadas de navegação, interação, responsividade, teclado e acessibilidade com Playwright/axe.

**Escopo:** site institucional estático; não é um sistema clínico, não gerencia pacientes e não exige autenticação.

## Prévia local

Requisitos: Node.js 22.19+ e Python 3.

```bash
npm ci
npm run dev
```

Abra **http://127.0.0.1:4173**. Para disponibilizar a prévia na rede local:

```bash
npm run dev:lan
```

Abra **http://127.0.0.1:4175** no Mac. No celular, use `http://IP-DO-MAC:4175`, conectado à mesma rede Wi-Fi. O IP pode mudar; firewall e isolamento de clientes no roteador podem impedir o acesso. O servidor expõe apenas `dist/`. Encerre com `Ctrl+C`.

## Validação

```bash
npm run check
npm run test:ui
node scripts/capture-preview.mjs
```

- `check`: formatação Prettier, build e testes Node.
- `test:ui`: Playwright com Chrome local, nove larguras, teclado, toque, vídeo, acessibilidade axe, movimento reduzido e fallbacks. Inicia o servidor automaticamente quando necessário.
- Sem Chrome, execute `npx playwright install chromium` e `PLAYWRIGHT_CHANNEL=chromium npm run test:ui`.
- As capturas exigem a prévia em execução na porta 4175. São gravadas em `artifacts/qa/`, ignorado pelo Git.
- O projeto não usa TypeScript nem possui lint independente; Prettier, testes Node e execução real no navegador são as verificações aplicáveis.

Para medir desempenho localmente:

```bash
npx lighthouse http://127.0.0.1:4175/ --chrome-flags='--headless' --output=html --output-path=artifacts/qa/lighthouse.html
```

## Estrutura

```text
src/index.html              Conteúdo, navegação, serviços e diálogo de vídeo
src/fonts.css               Fontes locais WOFF2
src/styles/tokens.css       Paleta, tipografia, espaçamento e estados
src/styles/main.css         Seções, componentes e responsividade
src/styles/hero.css         Composição da hero e enquadramento do retrato
src/scripts/contact.js      Mensagens e destinatário do WhatsApp
src/scripts/navigation.js   Menu acessível e estado do header
src/scripts/services.js     Acordeões nativos com expansão suave
src/scripts/hero-video.js   Vídeo secundário, carregado somente por clique
src/scripts/motion.js       Timeline GSAP e ScrollTrigger, com reduced motion
src/scripts/main.js         Inicialização e limpeza, incluindo bfcache
public/assets/              Marca, fotografias, vídeos e fontes
scripts/build.mjs           Cópia para dist/, incluindo GSAP local
scripts/capture-preview.mjs Capturas com assets lazy e reveals concluídos
tests/                      Integridade, comportamento e navegador
```

GSAP é a única dependência de produção; apenas o core e ScrollTrigger são distribuídos, sem CDN ou bundler. Playwright, axe, Lighthouse e Prettier são ferramentas de desenvolvimento. Não há React, backend, banco, formulários, analytics ou coleta de dados de pacientes.

## Publicação

Produção existente: **https://maria-thereza-enfermagem.pages.dev/**.

O Cloudflare Pages está conectado a `XavierRLX/landing-page-enfermeira`. A branch `main` tem deploy automático. Build: `npm run build`; diretório: `dist`; Node.js: 22. Nenhum segredo é necessário.

**Redesign aprovado e publicado em 04/11/2026.** O código foi integrado por fast-forward à `main` (commit `d7fb4ae`), enviado ao GitHub e confirmado no site público da Cloudflare Pages. A branch `codex/redesign-mtp-premium` foi preservada; consulte [status](docs/STATUS.md) e [relatório do redesign](docs/redesign-premium.md).

## Conteúdo e origem dos assets

A marca MTP é o PNG transparente fornecido pelo usuário, com variantes derivadas sem redesenho ou vetorização. A hero usa uma conversão WebP do poster existente anterior à restauração generativa. Os retratos restaurados e os dois vídeos continuam preservados; detalhes em [origem dos retratos](docs/hero-image-restoration.md) e [decisões atuais](docs/redesign-premium.md).

Contatos, serviços, instituições e `COREN-RJ 774772-ENF` foram preservados a partir do conteúdo previamente confirmado no projeto. Isso não substitui uma conferência atual do registro e das informações pela profissional antes de publicar.

Retratos, marca e dados profissionais não têm autorização implícita para reutilização em outro produto. As fontes Cormorant Garamond e Manrope continuam locais; os TTF originais foram mantidos. GSAP conserva seus avisos e a referência à licença nos arquivos distribuídos.
