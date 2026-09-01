-- =========================================================
-- SUSHIYA — Schema do banco (Supabase / Postgres)
-- Copie todo este arquivo e cole no SQL Editor do seu
-- projeto Supabase (https://app.supabase.com > SQL Editor
-- > New query), depois clique em "Run".
-- =========================================================

-- 1) Tabela com os itens do cardápio
create table public.itens (
  id          bigint generated always as identity primary key,
  nome        text not null,
  descricao   text,
  categoria   text not null,
  preco       numeric(10,2) not null default 0,
  foto        text,
  tipo        text not null default 'fixo' check (tipo in ('fixo', 'novidade')),
  ativo       boolean not null default true,
  validade    date,
  criado_em   timestamptz not null default now()
);

-- 2) Liga a segurança por linha (Row Level Security)
alter table public.itens enable row level security;

-- 3) Qualquer pessoa pode LER o cardápio (é público, lido via QR Code)
create policy "leitura publica do cardapio"
  on public.itens for select
  using (true);

-- 4) Só quem estiver logado (o admin) pode criar, editar ou excluir itens
create policy "admin pode inserir itens"
  on public.itens for insert
  to authenticated
  with check (true);

create policy "admin pode atualizar itens"
  on public.itens for update
  to authenticated
  using (true);

create policy "admin pode excluir itens"
  on public.itens for delete
  to authenticated
  using (true);

-- =========================================================
-- 5) FOTOS — depois de rodar o SQL acima, crie o espaço de
-- armazenamento das fotos pela interface (não dá pra criar
-- um bucket por SQL):
--
--   Painel Supabase > Storage > New bucket
--   Nome do bucket: fotos
--   Marque a opção "Public bucket"
--
-- Depois, volte aqui no SQL Editor e rode o bloco abaixo
-- para definir quem pode ler/enviar/excluir fotos:
-- =========================================================

create policy "leitura publica das fotos"
  on storage.objects for select
  using (bucket_id = 'fotos');

create policy "admin pode enviar fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos');

create policy "admin pode atualizar fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos');

create policy "admin pode excluir fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos');
