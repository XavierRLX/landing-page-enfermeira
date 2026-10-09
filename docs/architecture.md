# Arquitetura

## Visão geral

O site é inteiramente estático: não há servidor de aplicação, banco de dados ou formulário que armazene informações de pacientes. Links de WhatsApp abrem uma conversa com mensagem pré-preenchida; não enviam mensagens automaticamente.

## Estrutura

- `src/index.html`: HTML semântico, SEO básico e conteúdo editorial.
- `src/styles/main.css`: identidade visual e regras responsivas, sem framework CSS.
- `src/fonts.css`: mapeamento das fontes locais.
- `src/scripts/contact.js`: links de WhatsApp.
- `src/scripts/navigation.js`: menu mobile e teclado.
- `src/scripts/services.js`: cards abertos no desktop e acordeão mobile.
- `src/scripts/hero-video.js`: integração da animação.
- `src/scripts/main.js`: inicialização dos módulos.
- `public/assets/`: arquivos necessários ao site (fontes e vídeo otimizados).
- `scripts/build.mjs`: cópia de ativos para `dist/`, sem bundler.
- `tests/`: testes de integridade do build.
- `dist/`: saída gerada e ignorada pelo Git.

## Vídeo e scroll

No desktop, `currentTime` do vídeo é sincronizado ao progresso da rolagem. Os quadros independentes do MP4 de desktop ajudam a busca durante o scroll. O trecho da hero ganha altura adicional e seu conteúdo usa `position: sticky`.

No mobile, o vídeo menor começa quando o usuário rola e o elemento está visível; ele não usa scrubbing contínuo. Pausa quando sai da tela. Esta decisão evita buscar centenas de quadros durante interações de toque.

Respeitamos `prefers-reduced-motion`: a animação não inicia automaticamente se a preferência estiver ativa, e é possível controlar o movimento. A imagem `poster` aparece antes de o vídeo carregar.

## Publicação

O Cloudflare Pages deve executar `npm run build` e publicar a pasta `dist`. Não são necessárias variáveis de ambiente.

A configuração final de domínio e DNS fica a cargo do provedor de hospedagem. O repositório pode permanecer público, mas não deve receber segredos, credenciais nem dados de pacientes.

## Escopo clínico

Os textos comerciais e serviços devem ser revisados pela profissional antes do lançamento. Confirmar habilitação, registro profissional, escopo dos procedimentos, região e canais de contato. Não usar depoimentos, títulos ou credenciais inventados.
