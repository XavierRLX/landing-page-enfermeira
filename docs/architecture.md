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

- `initial`: `enfermeira-initial-restored.webp` (941 × 1672), restaurada por IA, visível mesmo depois de carregar metadados.
- `video`: o evento `playing` revela o vídeo quando a reprodução começa de fato; o evento `play` sozinho não retira o retrato durante buffering.
- `final`: o evento `ended` oculta o vídeo e mostra `enfermeira-final-restored.webp` (941 × 1672). O replay volta ao início e aguarda `playing` para revelar o vídeo.

A imagem final é decodificada antecipadamente. Se falhar ou ainda não estiver pronta, o retrato inicial permanece como fallback. Erro de mídia também restaura esse retrato e esconde o controle indisponível. Cada imagem tem descrição alternativa; apenas a camada visível fica disponível para leitores de tela. O vídeo e o controle mantêm suas descrições acessíveis.

A primeira extração sem perdas não resolveu a nitidez percebida. Após esse feedback e a confirmação de que não havia originais externos, foram recuperados os quadros inicial e final do vídeo de 720 × 1280 px do commit `e2e9358`. Ambos passaram por restauração generativa com a ferramenta integrada `image_gen`, orientada a preservar identidade, pose e composição. Os resultados têm resolução real de 941 × 1672 px; não são fotografias originais de alta resolução, e os detalhes reconstruídos podem diferir da fonte. Os WebP de qualidade 94 têm aproximadamente 203 KiB e 222 KiB. Fontes anteriores permanecem preservadas. Origem, prompts e limites estão em [Restauração dos retratos](hero-image-restoration.md).

A Hero usa duas colunas a partir de 641px e uma coluna abaixo disso. O desktop tem título de até 120px, retrato de até 620px, intervalo entre colunas de até 52px e fundo azul suave na metade direita. A altura acompanha o conteúdo, sem mínimo ligado à altura da janela. Em telas pequenas, o fundo permanece uniforme.

Com `prefers-reduced-motion`, não há reprodução automática: a pessoa pode iniciar manualmente. A animação pausa se a aba perder visibilidade e retoma quando volta. A reprodução não envia ou armazena dados.

## Publicação

O Cloudflare Pages deve executar `npm run build` e publicar a pasta `dist`. Não são necessárias variáveis de ambiente.

A configuração final de domínio e DNS fica a cargo do provedor de hospedagem. O repositório pode permanecer público, mas não deve receber segredos, credenciais nem dados de pacientes.

## Escopo clínico

Os textos comerciais e serviços devem ser revisados pela profissional antes do lançamento. Confirmar habilitação, registro profissional, escopo dos procedimentos, região e canais de contato. Não usar depoimentos, títulos ou credenciais inventados.

## Conteúdo editorial — 09/10/2026

A página foi atualizada com o texto fornecido pelo responsável: atendimento no Rio de Janeiro — Capital; quatro serviços (medicamentos, curativos, pós-operatório e plantões); apresentação profissional; nova seção de formação e experiência; quatro diferenciais; três etapas de agendamento; contato e rodapé. As credenciais e a experiência são declarações fornecidas pelo usuário, sem verificação independente nesta alteração. A prévia mantém explicitamente a nota sobre instituições/titulação e `COREN-RJ [número a confirmar]`, conforme o texto recebido. A navegação inclui a seção de formação. Os quatro parágrafos da apresentação e a mensagem final dos serviços também aparecem no mobile.
