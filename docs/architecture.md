# Arquitetura

## Visão geral

O site é inteiramente estático: não há servidor de aplicação, banco de dados ou formulário que armazene informações de pacientes. Links de WhatsApp abrem uma conversa com mensagem pré-preenchida; não enviam mensagens automaticamente.

## Estrutura

- `src/index.html`: HTML semântico, SEO básico e conteúdo editorial.
- `src/styles/main.css`: identidade visual e regras responsivas existentes, sem framework CSS.
- `src/styles/hero.css`: refinamento da primeira dobra, isolado das demais seções.
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

## Vídeo e primeira rolagem

A Hero apresenta uma única mensagem principal, um CTA de WhatsApp e o vídeo em destaque, sem cartões e legendas sobre a imagem. Não há altura artificial ou seção fixada durante o scroll.

O primeiro evento de rolagem inicia a reprodução contínua do retrato (2×, como a experiência mobile aprovada). A posição da reprodução **não** está vinculada ao scroll: rolar de volta não reverte a animação e rolagens adicionais não a reiniciam. O botão permite pausar, retomar e repetir.

O navegador seleciona um MP4 otimizado para mobile em telas de até 800px, e um vídeo de maior qualidade no desktop. Duas imagens sobrepostas compartilham o enquadramento do vídeo e são controladas por `data-media-state`:

- `initial`: `enfermeira-poster.jpg` (720 × 1280), já existente, visível mesmo depois de carregar metadados.
- `video`: o evento `playing` revela o vídeo quando a reprodução começa de fato; o evento `play` sozinho não retira o retrato durante buffering.
- `final`: o evento `ended` oculta o vídeo e mostra `enfermeira-final.webp` (640 × 1138). O replay volta ao início e aguarda `playing` para revelar o vídeo.

A imagem final é decodificada antecipadamente. Se falhar ou ainda não estiver pronta, o retrato inicial permanece como fallback. Erro de mídia também restaura esse retrato e esconde o controle indisponível. Cada imagem tem descrição alternativa; apenas a camada visível fica disponível para leitores de tela. O vídeo e o controle mantêm suas descrições acessíveis.

O still final foi extraído aos 5,95 s do MP4 desktop de 6 s, via decodificação do Chromium e Canvas em resolução nativa, e convertido para WebP **lossless**. Não houve geração por IA, alteração de rosto, sharpening ou ampliação artificial. A versão estática elimina recompressão adicional e usa a fonte desktop inclusive no mobile; não recupera detalhes inexistentes no vídeo original. Para maior definição em telas Retina, seria necessária uma foto original da pose final em resolução superior.

A Hero usa duas colunas a partir de 641px e uma coluna abaixo disso. O desktop tem título de até 120px, retrato de até 620px, intervalo entre colunas de até 52px e fundo azul suave na metade direita. A altura acompanha o conteúdo, sem mínimo ligado à altura da janela. Em telas pequenas, o fundo permanece uniforme.

Com `prefers-reduced-motion`, não há reprodução automática: a pessoa pode iniciar manualmente. A animação pausa se a aba perder visibilidade e retoma quando volta. A reprodução não envia ou armazena dados.

## Publicação

O Cloudflare Pages deve executar `npm run build` e publicar a pasta `dist`. Não são necessárias variáveis de ambiente.

A configuração final de domínio e DNS fica a cargo do provedor de hospedagem. O repositório pode permanecer público, mas não deve receber segredos, credenciais nem dados de pacientes.

## Escopo clínico

Os textos comerciais e serviços devem ser revisados pela profissional antes do lançamento. Confirmar habilitação, registro profissional, escopo dos procedimentos, região e canais de contato. Não usar depoimentos, títulos ou credenciais inventados.
