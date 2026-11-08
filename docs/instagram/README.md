# Instagram · MTP / Pugliese Enfermagem

Plano de comunicação e peças para o Instagram profissional da enfermeira **Maria Thereza Pugliese**. Materiais editoriais armazenados junto à landing, sem alterar seu código publicado.

## Posicionamento

- **Identidade:** manter o monograma MTP original e a linguagem visual da landing.
- **Marca editorial:** Pugliese Enfermagem; **profissional:** Maria Thereza Pugliese.
- **Objetivo misto:** educação em saúde + conexão com a profissional + apresentação ética dos serviços de enfermagem domiciliar.
- **Tom:** acolhedor, preciso, responsável, sem promessas de resultado ou sensacionalismo.
- **Público:** pacientes e familiares interessados em orientações gerais, prevenção e cuidados de enfermagem no Rio de Janeiro.
- **Canais:** Instagram (perfil, Stories, Reels, carrosséis), com contato apontando para a landing existente.

## Design system (extraído da landing)

| Token | Valor |
| --- | --- |
| Mel | `#E6B83F` |
| Lilás | `#B49AC8` |
| Ameixa | `#493B59` |
| Marfim | `#FAF7F0` |
| Lilás claro | `#EEE7F1` |
| Títulos | Cormorant Garamond |
| Texto | Manrope |

**Importante:** reutilizar `public/assets/brand/mtp-*.png` sem redesenhar o monograma. Fotografias devem ser da própria profissional e aprovadas por ela.

## Organização dos destaques

| Destaque | Conteúdo | Estado |
| --- | --- | --- |
| Sobre mim | Apresentação, trajetória, valores e convite | **Roteiro + modelo HTML criados; revisão visual pendente** |
| Cuidados | Orientações gerais com fontes verificadas | A planejar |
| Dicas | Curiosidades e mitos com fontes verificadas | A planejar |
| Serviços | Atuação domiciliar efetivamente prestada | A validar com a profissional |
| Dúvidas | Perguntas frequentes sem atendimento clínico por DM | A planejar |
| Contato | Região atendida, canal profissional e site | A confirmar |

## Produção do primeiro destaque

- [Roteiro e checklist de aprovação](destaques/sobre-mim.md)
- [Prévia HTML editável — 4 Stories](destaques/sobre-mim.html)
- Gerar as imagens PNG finais com `node scripts/export-instagram-stories.mjs` após `npm ci`.
- Os PNGs são exportados para `artifacts/instagram/sobre-mim/`, propositalmente fora do versionamento. O HTML é a fonte editável versionada.
- Antes da publicação, revisar texto, foto, vínculo profissional, COREN e conformidade com as normas vigentes do Cofen.

## Próximos passos

1. Substituir a fotografia usada provisoriamente na prévia pela versão aprovada: **uniforme branco + fundo lilás**. A imagem editada nesta conversa ainda não está no repositório.
2. Confirmar com Maria Thereza os dados profissionais mantidos na landing (formação, trajetória, COREN) e aprovar os quatro textos.
3. Gerar PNGs 1080 × 1920, fazer revisão de leitura em celular e publicar os quatro Stories na ordem.
4. Adicionar os Stories ao destaque `Sobre mim`; escolher capa padronizada com o monograma MTP.
5. Registrar as datas e métricas de alcance, conclusão e visitas ao perfil; iniciar `Cuidados`.

## Guardrails

- Nunca divulgar pacientes, prontuários, casos identificáveis, fotos clínicas ou dados pessoais sem a base legal e autorização adequadas.
- Não inventar formações, especialidades, autorizações, testemunhos ou resultados.
- Publicidade profissional requer identificação conforme a norma ética vigente e revisão da profissional responsável.
- Não tratar respostas gerais no Instagram como consulta/diagnóstico.
- O `@` definitivo ainda precisa ser confirmado; as peças não dependem de um nome de usuário não verificado.

**Status:** material editorial em desenvolvimento, **não publicado**. Branch de trabalho separada da `main`.
