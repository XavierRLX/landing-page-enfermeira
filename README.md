# Maria Thereza — Enfermagem & Home Care

Landing page responsiva para divulgação de serviços de enfermagem domiciliar, criada com **HTML semântico, CSS moderno e JavaScript nativo**.

O destaque é um retrato em vídeo cujo progresso acompanha a rolagem da página no desktop (_scroll scrubbing_), com experiência adaptada e mais leve para dispositivos móveis.

> Projeto de apresentação profissional e engenharia de front-end. O conteúdo clínico e as informações comerciais devem ser validados pela profissional antes da divulgação definitiva.

## Destaques

- Visual editorial com identidade em azul de enfermagem, responsivo e acessível.
- Vídeo vertical com interação por scroll no desktop e versão otimizada no mobile.
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
├── public/assets/            # Vídeo, imagem poster e fontes
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
│   └── styles/main.css
├── tests/static-site.test.mjs
├── package.json
└── servir.py                 # Servidor local com suporte a HTTP Range
```

## Rodar localmente

Requisitos: Node.js 20+ e Python 3.

```bash
npm ci
npm run dev
```

Abra **http://127.0.0.1:4173**. O servidor de desenvolvimento oferece suporte à requisição HTTP Range, importante para navegação pelos quadros do vídeo.

Para validar o projeto:

```bash
npm run check
```

Esse comando verifica formatação, gera a pasta `dist/` e executa testes automatizados.

## Hospedagem gratuita: Cloudflare Pages

1. Conecte este repositório ao Cloudflare Pages.
2. Escolha a branch `main`.
3. **Build command:** `npm run build`.
4. **Build output directory:** `dist`.
5. Publique; em seguida, adicione um domínio personalizado na área de _Custom domains_.

O conteúdo funciona em hospedagem estática e não usa variáveis de ambiente. Veja [a arquitetura](docs/architecture.md).

## Conteúdo, imagem e atribuições

O vídeo e as imagens retratam a profissional e foram preparados para este projeto. Não reutilize retratos, identidade visual ou dados de contato sem autorização.

As famílias tipográficas utilizadas são **Cormorant Garamond** e **Manrope**; confira as condições de licença dos arquivos distribuídos antes de reutilizá-los em outro produto.

Este repositório público tem finalidade de demonstração técnica; a publicação do código não implica uma licença automática de reutilização comercial.
