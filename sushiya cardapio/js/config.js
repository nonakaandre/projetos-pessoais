/* =========================================================
   CONFIGURAÇÃO — Sushiya Cardápio Digital
   =========================================================
   Depois de criar seu projeto gratuito em supabase.com,
   troque os dois valores abaixo pelos seus (Settings > API).
   Enquanto estiverem com os valores de exemplo, o site
   inteiro roda em "modo demonstração", usando os dados de
   exemplo definidos em js/data.js — assim dá pra ver e testar
   tudo sem precisar configurar nada ainda.
   ========================================================= */

const SUPABASE_URL = "COLOQUE_SUA_URL_AQUI";
const SUPABASE_ANON_KEY = "COLOQUE_SUA_CHAVE_ANON_AQUI";

const DEMO_MODE = SUPABASE_URL === "COLOQUE_SUA_URL_AQUI" || !SUPABASE_URL;

// URL pública do cardápio (usada para gerar o QR Code no painel admin).
// Troque pelo endereço final depois de publicar (ex: cardapio.sushiyaemcasa.com.br)
const MENU_URL = "https://cardapio.sushiyaemcasa.com.br";

let supabaseClient = null;
if (!DEMO_MODE && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
