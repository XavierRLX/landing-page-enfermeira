# Destaque do Instagram — Sobre mim

**Marca:** MTP · Maria Thereza Pugliese / Pugliese Enfermagem  
**Formato:** 4 Stories estáticos, 1080 × 1920 px, retrato 9:16.  
**Objetivo:** apresentar a profissional, construir confiança, mostrar seus valores e convidar a acompanhar o perfil.  
**Status:** rascunho visual e editorial para validação da profissional, **não publicado**.

## Story 01 — Quem sou

**Chamada:** Olá, eu sou Maria Thereza Pugliese.

**Complemento:** Enfermeira. Acredito em um cuidado que acolhe, respeita e olha para cada pessoa.

**Direção de arte:** fotografia real da profissional com jaleco/uniforme branco e fundo lilás, sem alterar feições; marca MTP discreta; respiro amplo e hierarquia clara.

## Story 02 — Minha trajetória

**Chamada:** Conhecimento que se transforma em cuidado.

**Corpo:** Graduação em Enfermagem pela Faculdade Bezerra de Araújo. Especialização em Enfermagem Neonatal pelo Ensino Einstein. Vivência na rede pública de saúde.

**Direção de arte:** carrossel editorial tipográfico, sem foto obrigatória. Informações baseadas no texto existente da landing; **confirmar com Maria Thereza antes de publicar**.

## Story 03 — Meu compromisso

**Chamada:** O cuidado está nos detalhes.

**Corpo:** Conhecimento técnico. Atenção individualizada. Orientação e acolhimento. Responsabilidade e respeito.

**Direção de arte:** composição editorial de quatro compromissos; sem promessas clínicas ou testemunhos.

## Story 04 — Bem-vindo(a)

**Chamada:** Este espaço também é para você.

**Corpo:** Por aqui, compartilho informações sobre saúde, prevenção, cuidados de enfermagem e minha atuação profissional.

**CTA:** Acompanhe a Pugliese Enfermagem.

**Direção de arte:** encerramento institucional em ameixa e mel, com monograma MTP original. Não exibir @ não confirmado.

## Técnica e entrega

- Zona segura sugerida: preservar margens laterais de aproximadamente 90 px e manter títulos/CTAs afastados das interfaces superior/inferior dos Stories.
- A versão HTML em `sobre-mim.html` reutiliza a foto já presente no site **apenas como referência provisória**. A foto aprovada nesta conversa (uniforme branco/fundo lilás) ainda deve ser adicionada à pasta de assets do projeto antes da publicação.
- As fontes são carregadas dos mesmos arquivos locais usados na landing.
- Exportação: `node scripts/export-instagram-stories.mjs`. Saída: `artifacts/instagram/sobre-mim/{01-apresentacao,02-trajetoria,03-compromisso,04-convite}.png`.
- Design no GitHub é editável, mas a criação do destaque dentro do Instagram continua sendo manual: publicar os Stories e adicioná-los ao destaque `Sobre mim`.

## Verificações antes do go-live

- [ ] Nome, formação, especialização e trajetória aprovados por Maria Thereza.
- [ ] COREN, categoria e informações institucionais revisados conforme regras vigentes.
- [ ] Fotografia final uniforme branco/fundo lilás instalada e enquadrada no layout.
- [ ] Logo MTP original e paleta conferidos.
- [ ] Legibilidade avaliada em tela pequena (não apenas no desktop).
- [ ] Revisão ortográfica e revisão ética dos conteúdos.
- [ ] Aprovação visual explícita.
- [ ] Publicação e inclusão no destaque realizadas na conta profissional.

**Origem editorial:** `src/index.html`, bloco `#sobre` e `#formacao`, e `src/styles/tokens.css`.
