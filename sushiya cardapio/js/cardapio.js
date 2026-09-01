/* =========================================================
   RENDERIZAÇÃO — página do cliente (index.html)
   ========================================================= */

function novidadeCardHTML(item) {
  const fotoHTML = item.foto
    ? `<img src="${item.foto}" alt="${item.nome}">`
    : `<span class="ph-label">foto em breve</span>`;
  return `
    <article class="novidade-card">
      <div class="photo-ph novidade-photo">
        ${fotoHTML}
        <span class="badge-novo">novo</span>
      </div>
      <div class="novidade-body">
        <h3>${item.nome}</h3>
        <p class="muted">${item.descricao || ""}</p>
        <p class="preco">${formatPreco(item.preco)}</p>
      </div>
    </article>`;
}

function cardapioRowHTML(item) {
  const fotoHTML = item.foto
    ? `<img src="${item.foto}" alt="${item.nome}">`
    : `<span class="ph-label">·</span>`;
  return `
    <div class="cardapio-row">
      <div class="photo-ph cardapio-thumb">${fotoHTML}</div>
      <div class="cardapio-row-text">
        <h4>${item.nome}</h4>
        ${item.descricao ? `<p class="muted">${item.descricao}</p>` : ""}
      </div>
      <div class="cardapio-row-preco">${formatPreco(item.preco)}</div>
    </div>`;
}

const CATEGORY_ORDER = [
  "Entradas", "Sashimi", "Nigiri", "Temaki", "Hot Roll",
  "Combinados", "Sobremesas", "Bebidas",
];

function ordenarCategorias(categorias) {
  return [...categorias].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

async function montarPagina() {
  const todos = await getItems(true);
  const novidades = todos.filter((i) => i.tipo === "novidade");
  const fixos = todos.filter((i) => i.tipo !== "novidade");

  const trackEl = document.getElementById("novidades-track");
  const novSection = document.getElementById("novidades");
  if (novidades.length === 0) {
    novSection.style.display = "none";
  } else {
    trackEl.innerHTML = novidades.map(novidadeCardHTML).join("");
  }

  const groupsEl = document.getElementById("cardapio-groups");
  const categorias = [];
  fixos.forEach((i) => {
    if (!categorias.includes(i.categoria)) categorias.push(i.categoria);
  });

  groupsEl.innerHTML = ordenarCategorias(categorias)
    .map((cat) => {
      const itens = fixos.filter((i) => i.categoria === cat);
      return `
        <div class="cat-group">
          <p class="eyebrow cat-title">${cat}</p>
          ${itens.map(cardapioRowHTML).join("")}
        </div>`;
    })
    .join("");
}

function ativarNavegacao() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.dataset.target);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tabs.forEach((t) => t.classList.toggle("active", t.dataset.target === entry.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

montarPagina();
ativarNavegacao();
