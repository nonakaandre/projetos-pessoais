/* =========================================================
   DADOS — Sushiya Cardápio Digital
   Camada única de acesso a dados. As telas (index.html e
   admin.html) só chamam estas funções e não precisam saber
   se os dados vêm do Supabase ou do modo demonstração.
   ========================================================= */

const LOCAL_KEY = "sushiya_itens_demo";

// Itens de exemplo — substitua pelos itens reais pelo painel
// admin assim que o Supabase estiver configurado.
const SAMPLE_ITEMS = [
  { id: "s1", nome: "Temaki Skin", descricao: "Pele de salmão maçaricada, cream cheese e cebolinha. (exemplo)", categoria: "Novidade da semana", preco: 28.9, foto: null, tipo: "novidade", ativo: true, validade: null, criado_em: "2026-06-18" },
  { id: "s2", nome: "Nigiri Maçaricado de Atum", descricao: "Atum selado na hora com toque de shoyu reduzido. (exemplo)", categoria: "Novidade da semana", preco: 14.9, foto: null, tipo: "novidade", ativo: true, validade: null, criado_em: "2026-06-17" },
  { id: "s3", nome: "Sashimi de Salmão Trio", descricao: "Três cortes, três texturas. Edição limitada. (exemplo)", categoria: "Novidade da semana", preco: 32.0, foto: null, tipo: "novidade", ativo: true, validade: null, criado_em: "2026-06-15" },

  { id: "c1", nome: "Sashimi de Salmão", descricao: "5 cortes selecionados do dia. (exemplo)", categoria: "Sashimi", preco: 26.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c2", nome: "Sashimi de Atum", descricao: "5 cortes selecionados do dia. (exemplo)", categoria: "Sashimi", preco: 28.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c3", nome: "Nigiri de Salmão", descricao: "2 unidades, arroz temperado na medida. (exemplo)", categoria: "Nigiri", preco: 12.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c4", nome: "Nigiri de Camarão", descricao: "2 unidades, camarão selado. (exemplo)", categoria: "Nigiri", preco: 14.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c5", nome: "Temaki de Salmão", descricao: "Alga, arroz, salmão fresco e cebolinha. (exemplo)", categoria: "Temaki", preco: 24.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c6", nome: "Temaki Philadelphia", descricao: "Salmão, cream cheese e cebolinha. (exemplo)", categoria: "Temaki", preco: 26.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c7", nome: "Hot Roll de Salmão", descricao: "8 unidades empanadas e fritas na hora. (exemplo)", categoria: "Hot Roll", preco: 30.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c8", nome: "Combinado Sushiya", descricao: "20 peças variadas, ideal para 2 pessoas. (exemplo)", categoria: "Combinados", preco: 89.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c9", nome: "Cheesecake de Maracujá", descricao: "Sobremesa da casa. (exemplo)", categoria: "Sobremesas", preco: 16.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
  { id: "c10", nome: "Refrigerante Lata", descricao: "Diversos sabores. (exemplo)", categoria: "Bebidas", preco: 7.0, foto: null, tipo: "fixo", ativo: true, criado_em: "2026-01-01" },
];

function seedLocalIfEmpty() {
  if (!localStorage.getItem(LOCAL_KEY)) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(SAMPLE_ITEMS));
  }
}

function readLocal() {
  seedLocalIfEmpty();
  return JSON.parse(localStorage.getItem(LOCAL_KEY));
}

function writeLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

/**
 * Retorna os itens do cardápio.
 * @param {boolean} onlyActive - se true, só traz itens ativos (uso público).
 */
async function getItems(onlyActive = true) {
  if (DEMO_MODE) {
    let items = readLocal();
    if (onlyActive) items = items.filter((i) => i.ativo);
    return items.sort((a, b) => (a.criado_em < b.criado_em ? 1 : -1));
  }

  let query = supabaseClient.from("itens").select("*").order("criado_em", { ascending: false });
  if (onlyActive) query = query.eq("ativo", true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Cria ou atualiza um item. Se `file` for passado, faz upload da foto.
 */
async function saveItem(item, file) {
  if (DEMO_MODE) {
    const items = readLocal();
    if (file) {
      item.foto = await fileToDataUrl(file);
    }
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...item };
    } else {
      item.id = "local_" + Date.now();
      item.criado_em = new Date().toISOString();
      items.unshift(item);
    }
    writeLocal(items);
    return item;
  }

  if (file) {
    const path = `${Date.now()}_${file.name}`;
    const { error: upErr } = await supabaseClient.storage.from("fotos").upload(path, file);
    if (upErr) throw upErr;
    const { data: urlData } = supabaseClient.storage.from("fotos").getPublicUrl(path);
    item.foto = urlData.publicUrl;
  }

  if (item.id) {
    const { error } = await supabaseClient.from("itens").update(item).eq("id", item.id);
    if (error) throw error;
  } else {
    delete item.id;
    const { error } = await supabaseClient.from("itens").insert(item);
    if (error) throw error;
  }
}

async function deleteItem(id) {
  if (DEMO_MODE) {
    const items = readLocal().filter((i) => i.id !== id);
    writeLocal(items);
    return;
  }
  const { error } = await supabaseClient.from("itens").delete().eq("id", id);
  if (error) throw error;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatPreco(valor) {
  return valor != null ? "R$ " + Number(valor).toFixed(2).replace(".", ",") : "";
}
