# Maria Thereza — Enfermagem & Home Care

Landing page responsiva para divulgação de serviços de enfermagem domiciliar, criada com **HTML semântico, CSS moderno e JavaScript nativo**.

O destaque é uma Hero minimalista com retrato em vídeo que inicia a reprodução completa na primeira rolagem — sem controlar os quadros pelo scroll — em desktop e mobile.

> Projeto de apresentação profissional e engenharia de front-end. O conteúdo clínico e as informações comerciais devem ser validados pela profissional antes da divulgação definitiva.

## Destaques

- Visual editorial com identidade em azul de enfermagem, responsivo e acessível.
- Retratos estáticos antes e depois do vídeo, acionado uma única vez no primeiro scroll, com reprodução contínua e controle de pausar/repetir.
- Hero com fotografia ampliada, mensagens objetivas e apenas um CTA principal.
- Navegação mobile, cards de serviços e links para contato via WhatsApp.
- Suporte à preferência do sistema por movimento reduzido.
- Sem backend, banco de dados, serviços pagos ou dependências de produção.
- Pipeline de qualidade com formatação automática, testes e GitHub Actions.

## Tecnologias

**HTML5 · CSS3 · JavaScript (ES Modules) · Node.js (somente build e testes) · Cloudflare Pages**

Sem React, Next.js ou bundler: a solução estática atende aos requisitos com menor complexidade.

## Estrutura

```text
.
├── .github/workflows/ci.yml
├── docs/architecture.md
├── public/assets/            # Vídeos, stills e fontes
├── scripts/build.mjs         # Gera dist/
├── src/
│   ├── fonts.css
│   ├── index.html
│   ├── scripts/
│   │   ├── contact.js
│   │   ├── hero-video.js
│   │   ├── main.js
│   │   ├── navigation.js
│   │   └── services.js
│   └── styles/
│       ├── hero.css         # Composição minimalista da Hero
│       └── main.css
├── tests/static-site.test.mjs
├── package.json
└── servir.py                 # Servidor local de prévia estática
```

## Rodar localmente

Requisitos: Node.js 20+ e Python 3.

```bash
npm ci
npm run dev
```

Abra **http://127.0.0.1:4173**. O servidor de desenvolvimento oferece suporte a arquivos estáticos e vídeos.

Para validar o projeto:

```bash
npm run check
```

Esse comando verifica formatação, gera a pasta `dist/` e executa testes automatizados.

## Hospedagem: Cloudflare Pages

Site publicado: **https://maria-thereza-enfermagem.pages.dev/**.

O projeto Cloudflare Pages está conectado ao repositório `XavierRLX/landing-page-enfermeira`. A branch de produção é `main`, com deploy automático ativado: cada novo push nessa branch inicia um build e publica a versão resultante. O GitHub Actions continua responsável pelas verificações do repositório.

Configuração do build no Cloudflare Pages:

- **Framework preset:** None.
- **Root directory:** raiz do repositório.
- **Build command:** `npm run build`.
- **Build output directory:** `dist`.
- **Node.js:** 22 (`NODE_VERSION=22` no ambiente de build).

O site é estático e não requer banco de dados, backend ou variáveis secretas. Veja [a arquitetura](docs/architecture.md).

Para conectar futuramente um domínio `.com.br`, registre o domínio no Registro.br e adicione-o em **Cloudflare Pages → maria-thereza-enfermagem → Custom domains**. Siga as instruções de DNS apresentadas pelo Cloudflare para o domínio escolhido e aguarde a validação e emissão do certificado HTTPS. O domínio próprio ainda não está conectado.

## Conteúdo, imagem e atribuições

O vídeo e as imagens retratam a profissional e foram preparados para este projeto. Não reutilize retratos, identidade visual ou dados de contato sem autorização.

As famílias tipográficas utilizadas são **Cormorant Garamond** e **Manrope**; confira as condições de licença dos arquivos distribuídos antes de reutilizá-los em outro produto.

Este repositório público tem finalidade de demonstração técnica; a publicação do código não implica uma licença automática de reutilização comercial.
