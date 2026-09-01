# Cardápio Digital — Sushiya em Casa

Cardápio interno acessado por QR Code na mesa. Duas telas:

- **`index.html`** — o que o cliente vê (Novidades + Cardápio completo)
- **`admin.html`** — painel para vocês postarem itens, sazonais e fotos

Custo de hospedagem e banco de dados: **R$ 0**, usando os serviços gratuitos
indicados abaixo. O único custo é o domínio, que vocês já possuem.

---

## 1. Testar agora, sem configurar nada

Os arquivos já funcionam sozinhos em **modo demonstração**: dê duplo clique em
`index.html` ou `admin.html` para abrir no navegador. Os dados de exemplo
ficam salvos só no seu navegador (`localStorage`), então dá pra testar à
vontade — criar, editar e excluir itens no painel — antes de publicar de
verdade. Login do modo demonstração: botão "Entrar em modo demonstração",
sem necessidade de senha.

Quando estiver pronto para ir ao ar com dados reais, siga os passos abaixo.

---

## 2. Criar o banco de dados (Supabase — gratuito)

1. Crie uma conta grátis em **[supabase.com](https://supabase.com)** (não
   pede cartão de crédito).
2. Crie um novo projeto (escolha uma senha forte para o banco — guarde-a).
3. No menu lateral, vá em **SQL Editor → New query**, cole todo o conteúdo
   do arquivo `supabase-schema.sql` (está nesta mesma pasta) e clique em
   **Run**. Isso cria a tabela do cardápio e as regras de segurança.
4. Vá em **Storage → New bucket**, crie um bucket chamado `fotos` e marque
   a opção **Public bucket**. Volte ao SQL Editor e rode a segunda parte do
   `supabase-schema.sql` (as políticas de fotos, no final do arquivo).
5. Vá em **Authentication → Users → Add user** e crie o login de quem vai
   usar o painel (e-mail e senha). É esse e-mail/senha que será usado para
   entrar em `admin.html`.
6. Vá em **Settings → API** e copie dois valores: **Project URL** e
   **anon public key**.

## 3. Conectar o site ao banco

Abra o arquivo `js/config.js` e troque estas duas linhas pelos valores que
você copiou no passo anterior:

```js
const SUPABASE_URL = "COLOQUE_SUA_URL_AQUI";
const SUPABASE_ANON_KEY = "COLOQUE_SUA_CHAVE_ANON_AQUI";
```

Assim que esses valores forem preenchidos, o site sai do modo demonstração
automaticamente e passa a usar o Supabase de verdade.

## 4. Publicar o site (hospedagem gratuita)

A forma mais simples, sem precisar instalar nada:

1. Crie uma conta grátis em **[netlify.com](https://netlify.com)**.
2. Na página inicial do painel, arraste a pasta inteira do projeto (a pasta
   que contém `index.html`) para a área "Deploy manually".
3. Pronto — o Netlify já devolve um link público funcionando
   (algo como `nome-aleatorio.netlify.app`).

Alternativas equivalentes e também gratuitas: **Vercel** e **GitHub Pages**
(essa última exige um pouco mais de configuração via Git).

## 5. Usar o domínio próprio (cardapio.sushiyaemcasa.com.br)

No Netlify: **Site settings → Domain management → Add a domain**, digite
`cardapio.sushiyaemcasa.com.br`. O Netlify mostra um registro do tipo
**CNAME** para você cadastrar no painel de DNS de onde o domínio
`sushiyaemcasa.com.br` está registrado (o mesmo lugar onde vocês compraram o
domínio). Isso costuma levar de alguns minutos a poucas horas para
propagar.

Depois de definir o endereço final, atualize também a constante `MENU_URL`
em `js/config.js` — é ela que define para onde o QR Code aponta.

## 6. Gerar o QR Code para a mesa

No painel admin (`admin.html`), aba **QR Code**, o código já aparece pronto
com base em `MENU_URL`. Clique em **Baixar PNG** e mande imprimir (sugestão:
um suporte de acrílico pequeno por mesa, ou um adesivo no cardápio físico
atual).

## 7. Uso diário do painel

- **+ Novo item**: foto, nome, categoria, descrição e preço.
- **"Onde aparece"**: escolha "Novidade da semana" para entrar em destaque
  na tela inicial, ou "Cardápio fixo" para entrar na lista organizada por
  categoria.
- O interruptor ao lado de cada item liga/desliga sua visibilidade para o
  cliente sem precisar excluir — útil para um item que saiu do estoque
  temporariamente.

## Estrutura de pastas

```
index.html          → tela do cliente
admin.html           → painel administrativo
css/style.css        → cores, tipografia e estilos compartilhados
js/config.js         → chaves do Supabase e URL do cardápio (editar aqui)
js/data.js           → acesso aos dados (Supabase ou modo demonstração)
js/cardapio.js        → lógica da tela do cliente
js/admin.js          → lógica do painel
assets/               → logo e carimbo recortados do material enviado
supabase-schema.sql   → script de criação do banco de dados
```

## Limites do plano gratuito do Supabase

Mais que suficientes para um cardápio interno: 500 MB de banco de dados,
~1 GB de armazenamento de fotos, 5 GB de tráfego por mês. Único detalhe: um
projeto gratuito "pausa" se ficar **7 dias seguidos** sem nenhum acesso —
extremamente improvável com o restaurante em operação normal, mas se
quiserem manter uma garantia extra, posso configurar um "ping" automático
e gratuito (via GitHub Actions) para isso nunca acontecer.
