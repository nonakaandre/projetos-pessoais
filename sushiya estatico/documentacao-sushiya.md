# Documentação — Sushiya Menu Guide

> Documento de alinhamento. Serve pra gente não ficar redecidindo as mesmas coisas a cada conversa. Atualizo conforme o projeto avança.

---

## 1. O que é o projeto

Uma página única (one-page) que explica a dedicação do Sushiya com cada produto e ensina o cliente a aproveitar melhor cada ingrediente (ex: por que o shoyu Kikkoman, como usar com cada prato).

**Não é** um cardápio de pedidos. Não tem preço, não tem "adicionar ao carrinho". É conteúdo institucional/educativo, acessado via QR code:
- impresso e enviado junto com o pedido do delivery
- fixado nas mesas do salão

**Stack atual:** HTML + CSS + JS puro, hospedado no GitHub Pages.
URL atual: `nonakaandre.github.io/projeto-sushiya` (mantido por enquanto — domínio próprio fica pra depois).

---

## 2. Princípios de conteúdo (copywriting)

O texto que já existe (Quem somos, Peixes, Shoyu) acerta o tom — vamos manter essa linha pras seções novas:

- Frases curtas. Quebra de linha como recurso de ritmo (estilo "verso").
- Tom técnico-poético: explica o porquê técnico sem soar como manual.
- Estrutura por seção: **o que é → por que importa → como aproveitar na prática.**
- Cada seção deve ser lida em menos de 30 segundos. Cliente está esperando o delivery chegar ou já sentado pra comer — não vai ler um texto longo.
- Sem jargão de marketing vazio ("experiência única", "sabor incomparável"). O texto atual já evita isso bem.

---

## 3. Mapa de seções

| Seção | Status |
|---|---|
| Quem somos | ✅ Pronto |
| Peixes | ✅ Pronto |
| Shoyu | ✅ Pronto (botão "Continuar..." sem destino — ver §6) |
| Arroz | 🔲 A escrever |
| Nigiri | 🔲 A escrever |

### Briefing — Arroz (pra validar antes de escrever o texto final)
- O que é: tipo de arroz usado, ponto de cozimento, têmpero (vinagre, açúcar, sal — proporção como diferencial).
- Por que importa: arroz é metade do nigiri/sushi, não é "enchimento" (frase que já aparece comentada no HTML — pode reaproveitar a ideia).
- Como aproveitar: temperatura ideal de consumo (nem gelado, nem quente), por que não usar muito shoyu nele.

### Briefing — Nigiri
- O que é: a técnica do corte e da modelagem à mão (formato, pressão, proporção peixe/arroz).
- Por que importa: equilíbrio entre os dois elementos é o que define a qualidade.
- Como aproveitar: dica prática de como comer (de um bocado só, virado pro peixe tocar o shoyu primeiro, etc).

**Me confirma esses dois pontos antes de eu escrever o texto final**, pra não gastar tokens fazendo copy em cima de briefing errado.

---

## 4. Diretrizes visuais (clean & elegante)

Estilo atual já está alinhado com o pedido — vamos preservar:

- **Paleta:** fundo escuro `#0C0B1A`, texto branco, vermelho do kanji da logo como único acento de cor.
- **Tipografia:** Clash Display (fonte display, carregada via Fontshare CDN).
- **Layout:** seções alternando texto + imagem, bastante respiro (padding generoso), sem poluição visual.
- **Princípio geral:** menos elemento na tela, mais espaço em branco (ou "em preto", nesse caso). Isso já está sendo seguido.

---

## 5. Diagnóstico técnico (o que encontrei no código atual)

Pontos pra corrigir durante a implementação, em ordem de impacto:

1. **`sea-food.jpg` pesa 25MB.** Isso sozinho pode deixar o carregamento lento em rede móvel — crítico pro caso de uso (QR code no delivery). Vamos comprimir e converter pra WebP (igual ao `kikkoman.webp`). Meta: cada imagem abaixo de ~200KB.
2. **Sem preview ao compartilhar o link** (Open Graph/meta tags). Se alguém mandar o link pelo WhatsApp em vez de escanear o QR, hoje aparece sem título/imagem — fica menos profissional. Fácil de corrigir, vale a pena.
3. **Botão "Continuar..." na seção Shoyu não leva a lugar nenhum** (`href="#"`). Precisa decidir: remove o botão, ou cria conteúdo extra pra ele linkar.
4. **`<button>` dentro de `<a>`** na seção Shoyu — aninhamento de elemento interativo dentro de outro não é válido em HTML5. Fácil de ajustar.
5. **Fonte Clash Display só carrega o peso "Regular"**, mas o CSS usa `font-weight: bold` em vários lugares — o navegador faz um "bold falso" (synthetic bold), que fica menos nítido. Se quiser nitidez total, precisamos do arquivo da fonte em peso Bold também.
6. **Rodapé com "© 2024"** — atualizar pra dinâmico (ano atual via JS) ou pelo menos pra 2026.
7. Bloco de texto antigo comentado no HTML (linhas 46–58) — código morto, pode ser removido na limpeza final.

Nenhum desses é estrutural — são ajustes pontuais, dá pra resolver tudo numa passada só de implementação.

---

## 6. QR Code

- **Destino:** a URL do GitHub Pages (atualizar se o domínio mudar no futuro).
- **Uso:** impresso em (a) etiqueta/folha enviada com o pedido do delivery e (b) suporte de mesa no salão.
- **Especificação pra impressão:**
  - Tamanho mínimo recomendado: 2,5 cm x 2,5 cm pra leitura confiável de perto (mesa/embalagem).
  - Manter "quiet zone" (margem em branco ao redor) — sem isso o leitor erra.
  - Contraste alto: QR preto sobre fundo branco lê melhor que QR colorido sobre fundo escuro, mesmo que o site seja dark.
  - Gero o arquivo em SVG (escala sem perder qualidade — importante pra impressão) e também um PNG de alta resolução como alternativa.
- Posso gerar o QR code já apontando pra URL atual assim que você validar este documento.

---

## 7. Hospedagem

- **GitHub Pages**, gratuito, já configurado, HTTPS automático. Suficiente pro volume de acesso esperado (baixo, vindo de QR code local).
- Domínio próprio fica em aberto pra decisão futura — não bloqueia nada agora.

---

## 8. Roadmap (ordem de execução sugerida)

1. ✅ Levantamento técnico e esta documentação
2. ✅ Briefing de Arroz e Nigiri validado (referências gerais sobre sushi, texto escrito do zero)
3. ✅ Texto final de Arroz e Nigiri escrito, no mesmo tom das seções existentes
4. ✅ Imagens otimizadas — `sea-food.jpg` caiu de 25,5MB para 87KB (WebP). Total da pasta `imagens/` foi de ~26,4MB para ~1MB
5. ✅ Pontos técnicos do §5 corrigidos (ver §10)
6. ✅ Meta tags Open Graph/Twitter Card adicionadas, com imagem de preview dedicada
7. ✅ QR code gerado (PNG alta resolução, SVG, e card pronto pra impressão com a identidade visual)
8. 🔲 **Você revisa os arquivos e publica** (passo a passo no §9)

---

## 9. Como publicar (passo a passo)

Os arquivos atualizados estão em `projeto-sushiya-atualizado/`. Pra colocar no ar:

1. Baixe a pasta `projeto-sushiya-atualizado/`.
2. No seu repositório local do `projeto-sushiya`, substitua `index.html`, `style.css`, `javascript.js` e a pasta `imagens/` pelos novos.
3. Commit e push pra branch `main`:
   ```
   git add .
   git commit -m "Otimiza imagens, adiciona seções Arroz e Nigiri, corrige bugs e adiciona meta tags"
   git push
   ```
4. O GitHub Pages atualiza sozinho em 1-2 minutos. Confere em `nonakaandre.github.io/projeto-sushiya`.

**Sobre o QR code:** estão em uma pasta separada (`qrcode/`), não fazem parte do site:
- `qrcode-sushiya.svg` — pra impressão profissional (gráfica), escala sem perder qualidade.
- `qrcode-sushiya.png` — alta resolução (1230x1230px), pra imprimir você mesmo.
- `card-qrcode-sushiya.png` — versão com a logo do Sushiya e uma chamada, pronta pra colar na mesa ou anexar no delivery sem precisar editar nada.

Os três já foram testados e o código escaneia corretamente, apontando pra `nonakaandre.github.io/projeto-sushiya`.

---

## 10. O que foi corrigido (detalhamento técnico)

- `sea-food.jpg` (25,5MB) → `sea-food.webp` (87KB), redimensionada de 7999x5333 para 900x600 — resolução mais que suficiente pro tamanho exibido na página.
- `sushiya-frete.jpeg` e `kikkoman.webp` também redimensionadas/recompactadas.
- `favicon.png` caiu de 139KB (1024x1024, tamanho desnecessário pra um favicon) para 2,4KB (64x64). Adicionei também um `apple-touch-icon.png` (180x180) pra quando alguém salvar o site na tela inicial do iPhone.
- Nav "Nossa missão" apontava pra `#missao`, mas a seção tinha `id="quem-somos"` — o link não funcionava. Corrigido (`id="missao"`).
- Botão "Continuar..." da seção Shoyu não levava a lugar nenhum e tinha um `<button>` indevidamente aninhado dentro de um `<a>` (inválido em HTML5). Virou um link direto pra página oficial da Kikkoman sobre fermentação natural.
- Bloco de texto antigo, comentado no HTML, removido.
- Rodapé com ano fixo (`© 2024`) agora atualiza sozinho via JavaScript.
- Adicionado `font-display: swap` na fonte, pra evitar texto invisível durante o carregamento.
- Adicionadas meta tags Open Graph e Twitter Card — agora, ao compartilhar o link (ex: WhatsApp), aparece título, descrição e uma imagem de preview, em vez de um link sem contexto.
- Adicionado `loading="lazy"` nas imagens abaixo da dobra, e atributos `width`/`height` em todas, pra evitar que o layout "pule" durante o carregamento.

---

## 11. Pendências que dependem de você

- **Fotos pra Arroz e Nigiri:** não inventei imagem genérica/IA pra essas seções — preferi deixar só com texto a usar uma foto que não é de verdade do produto de vocês (quebraria a proposta de autenticidade do site). Se vocês tiverem fotos do preparo do arroz e da montagem do nigiri, me manda que eu encaixo no mesmo padrão visual das outras seções.
- **Fonte Clash Display:** o CSS carrega o peso "Regular" direto do Fontshare. Não consegui testar esse link no meu ambiente (sem acesso de rede a esse domínio), então vale você abrir o site publicado e conferir se a fonte está carregando normalmente. Se um dia ela parar de carregar (Fontshare é um serviço de terceiro, fora do seu controle), o site cai pra uma fonte padrão do sistema — não quebra, só perde a identidade visual.

---

## 9. Decisões já tomadas (pra não perguntar de novo)

- Otimizar todas as imagens do projeto: **sim**.
- Seções Arroz e Nigiri: **escrever conteúdo completo** (não remover do menu).
- Hospedagem: **manter GitHub Pages** por enquanto, domínio próprio em aberto.
