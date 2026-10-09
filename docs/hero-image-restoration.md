# Restauração dos retratos da Hero

## Motivo e origem

A extração anterior preservava a baixa resolução dos arquivos existentes. O usuário considerou insuficiente a qualidade das duas poses e informou não ter originais em resolução maior.

Fonte recuperada: `dist/assets/enfermeira.mp4` do commit `e2e9358`, blob `16ee854fcac090fcebd37b0406fef100281e4e3d`, com 720 × 1280 px e duração de 6,016 s. Quadros decodificados no Chromium/Canvas aos 0,001 s e 5,95 s, sem redimensionamento. Essa fonte antecede o vídeo desktop recomprimido para 640 × 1138 px.

Skill utilizada: `imagegen`, modo integrado `image_gen`, edição `identity-preserve`. Não foi utilizada API/CLI externa. A restauração reconstrói detalhes de forma generativa; não equivale a recuperar detalhes originais comprovados. A identidade e as poses foram usadas como invariantes nos prompts, mas pequenas diferenças de textura e traços continuam possíveis.

## Arquivos

- `public/assets/enfermeira-initial-restored.webp`: 941 × 1672 px, 207.492 bytes.
- `public/assets/enfermeira-final-restored.webp`: 941 × 1672 px, 226.938 bytes.

Os PNG gerados foram convertidos para WebP com qualidade 94, sem redimensionamento ou filtro adicional. A dimensão solicitada ao gerador era maior, mas a ferramenta retornou **941 × 1672 px**; esta é a resolução efetivamente entregue. Os assets anteriores permanecem no repositório para comparação e reversão. O HTML usa a nova imagem inicial também como poster.

## Prompt inicial

```text
Use case: identity-preserve. Edit target: the attached portrait, initial pose of a real nurse in a website Hero. Restore this exact photograph at high resolution, ideally 2160 x 3840 portrait 9:16. Only improve resolution and photographic microdetail: clear natural eyes, individual hair strands, subtle natural skin texture, crisp navy scrub fabric and stethoscope. Preserve the woman's EXACT facial identity, age, proportions, neutral closed-mouth expression, head tilt, gaze, pose with arms lowered, body silhouette, uniform, badge, stethoscope, lighting, colors, hospital corridor, framing and every object's position. This is a fidelity-focused restoration, NOT a reinterpretation, beauty edit, new portrait, or new pose. No facial reshaping, artificial makeup, exaggerated pores, sharpening halos, waxy skin, text, watermark or new elements. Keep background's existing optical blur, while making the person naturally detailed and clear. Output one full portrait only, same composition and aspect ratio as source.
```

Entrada: quadro inicial da fonte recuperada.

## Prompt final

```text
Use case: identity-preserve. Image 1 is the EDIT TARGET: a nurse with crossed arms and a gentle closed-mouth smile, final pose of a video. Image 2 is supporting reference only: the restored initial pose, for matching photographic detail, colors and identity. Restore ONLY image 1 as a high-resolution photographic portrait, ideally 2160 x 3840, exact 9:16 aspect ratio. Preserve image 1's exact facial identity, facial geometry, eyes, nose, lips, smile, gaze, head tilt, crossed arms, fingers, proportions, crop, navy scrubs, stethoscope, blank badge, lighting and hospital corridor arrangement. Keep the whole composition and object positions registered to image 1. Improve microdetail in eyes, individual hair strands, subtle realistic skin and navy fabric; remove low-resolution compression softness without halos. Match image 2's crisp photographic detail and neutral color. Do not copy image 2's pose or expression. No beauty retouch, face reshaping, enlarged eyes, altered mouth, makeup, waxy skin, over-sharpening, added elements, text, logos or watermark. Output a single restored FINAL portrait with arms crossed, not a comparison or collage.
```

Entradas: quadro final da fonte recuperada e restauração inicial como referência de tratamento.

## Validação

`npm run check` aprovado com 12 testes. Revisão no Chrome em 1440 × 1000 e 390 × 844, ambos com densidade 2×: imagens novas carregadas em resolução nativa, fluxo inicial → vídeo → final e replay concluídos, sem overflow ou erros de console. O layout e o controle do vídeo não foram alterados nesta correção. A definição do vídeo continua limitada ao MP4 existente.
