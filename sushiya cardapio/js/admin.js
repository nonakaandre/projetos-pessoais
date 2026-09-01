/* =========================================================
   PAINEL ADMIN — Sushiya
   ========================================================= */

const els = {
  loginScreen: document.getElementById("login-screen"),
  dashboard: document.getElementById("dashboard"),
  loginForm: document.getElementById("login-form"),
  loginError: document.getElementById("login-error"),
  demoNotice: document.getElementById("demo-notice"),
  demoEnterBtn: document.getElementById("demo-enter-btn"),
  logoutBtn: document.getElementById("logout-btn"),
  list: document.getElementById("itens-list"),
  emptyState: document.getElementById("empty-state"),
  newBtn: document.getElementById("new-item-btn"),
  modal: document.getElementById("item-modal"),
  form: document.getElementById("item-form"),
  cancelBtn: document.getElementById("cancel-btn"),
  modalTitle: document.getElementById("modal-title"),
  fotoInput: document.getElementById("f-foto"),
  fotoPreview: document.getElementById("foto-preview"),
  navItens: document.getElementById("nav-itens"),
  navQr: document.getElementById("nav-qr"),
  panelItens: document.getElementById("panel-itens"),
  panelQr: document.getElementById("panel-qr"),
  qrUrl: document.getElementById("qr-url"),
  qrDownload: document.getElementById("qr-download"),
};

let currentFotoExistente = null;

/* ---------------- AUTENTICAÇÃO ---------------- */

function mostrarDashboard() {
  els.loginScreen.style.display = "none";
  els.dashboard.style.display = "block";
  refreshList();
}

function mostrarLogin() {
  els.dashboard.style.display = "none";
  els.loginScreen.style.display = "flex";
}

async function checkAuth() {
  if (DEMO_MODE) {
    els.demoNotice.style.display = "block";
    if (sessionStorage.getItem("sushiya_demo_logado") === "1") {
      mostrarDashboard();
    } else {
      mostrarLogin();
    }
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) mostrarDashboard();
  else mostrarLogin();
}

els.demoEnterBtn?.addEventListener("click", () => {
  sessionStorage.setItem("sushiya_demo_logado", "1");
  mostrarDashboard();
});

els.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.loginError.style.display = "none";
  if (DEMO_MODE) return; // botão de demonstração cuida disso
  const email = document.getElementById("f-email").value;
  const senha = document.getElementById("f-senha").value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });
  if (error) {
    els.loginError.textContent = "E-mail ou senha incorretos.";
    els.loginError.style.display = "block";
    return;
  }
  mostrarDashboard();
});

els.logoutBtn.addEventListener("click", async () => {
  if (DEMO_MODE) {
    sessionStorage.removeItem("sushiya_demo_logado");
  } else {
    await supabaseClient.auth.signOut();
  }
  mostrarLogin();
});

/* ---------------- LISTAGEM ---------------- */

function badgeTipo(item) {
  return item.tipo === "novidade"
    ? `<span class="tag tag-red">Novidade</span>`
    : `<span class="tag">Cardápio fixo</span>`;
}

function itemRowHTML(item) {
  const fotoHTML = item.foto ? `<img src="${item.foto}" alt="">` : `<span class="ph-label">·</span>`;
  return `
    <div class="item-card" data-id="${item.id}">
      <div class="item-card-main">
        <div class="photo-ph item-thumb">${fotoHTML}</div>
        <div class="item-info">
          <div class="item-info-top">
            <h4>${item.nome}</h4>
            ${badgeTipo(item)}
            ${!item.ativo ? `<span class="tag tag-muted">Inativo</span>` : ""}
          </div>
          <p class="muted">${item.categoria} · ${formatPreco(item.preco)}</p>
        </div>
      </div>
      <div class="item-actions">
        <label class="switch" title="Ativar/desativar">
          <input type="checkbox" class="toggle-ativo" ${item.ativo ? "checked" : ""}>
          <span class="switch-track"></span>
        </label>
        <div class="item-actions-buttons">
          <button class="btn btn-ghost btn-sm edit-btn">Editar</button>
          <button class="btn btn-danger btn-sm delete-btn">Excluir</button>
        </div>
      </div>
    </div>`;
}

async function refreshList() {
  const itens = await getItems(false);
  if (itens.length === 0) {
    els.list.innerHTML = "";
    els.emptyState.style.display = "block";
    return;
  }
  els.emptyState.style.display = "none";
  els.list.innerHTML = itens.map(itemRowHTML).join("");

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".item-card").dataset.id;
      const item = itens.find((i) => String(i.id) === id);
      openForm(item);
    })
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.closest(".item-card").dataset.id;
      if (confirm("Excluir este item do cardápio? Essa ação não pode ser desfeita.")) {
        await deleteItem(isNaN(id) ? id : Number(id));
        refreshList();
      }
    })
  );
  document.querySelectorAll(".toggle-ativo").forEach((chk) =>
    chk.addEventListener("change", async (e) => {
      const id = e.target.closest(".item-card").dataset.id;
      const item = itens.find((i) => String(i.id) === id);
      await saveItem({ id: item.id, ativo: e.target.checked });
      refreshList();
    })
  );
}

/* ---------------- FORMULÁRIO ---------------- */

function openForm(item) {
  els.form.reset();
  els.fotoPreview.innerHTML = `<span class="ph-label">sem foto</span>`;
  currentFotoExistente = null;

  if (item) {
    els.modalTitle.textContent = "Editar item";
    document.getElementById("f-id").value = item.id;
    document.getElementById("f-nome").value = item.nome || "";
    document.getElementById("f-categoria").value = item.categoria || "";
    document.getElementById("f-descricao").value = item.descricao || "";
    document.getElementById("f-preco").value = item.preco ?? "";
    document.getElementById("f-tipo").value = item.tipo || "fixo";
    document.getElementById("f-ativo").checked = item.ativo !== false;
    if (item.foto) {
      els.fotoPreview.innerHTML = `<img src="${item.foto}" alt="">`;
      currentFotoExistente = item.foto;
    }
  } else {
    els.modalTitle.textContent = "Novo item";
    document.getElementById("f-id").value = "";
    document.getElementById("f-ativo").checked = true;
  }
  els.modal.style.display = "flex";
  document.getElementById("f-nome").focus();
}

function closeForm() {
  els.modal.style.display = "none";
}

els.newBtn.addEventListener("click", () => openForm(null));
els.cancelBtn.addEventListener("click", closeForm);
els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) closeForm();
});

els.fotoInput.addEventListener("change", () => {
  const file = els.fotoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => (els.fotoPreview.innerHTML = `<img src="${reader.result}" alt="">`);
  reader.readAsDataURL(file);
});

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const saveBtn = els.form.querySelector('button[type="submit"]');
  saveBtn.disabled = true;
  saveBtn.textContent = "Salvando...";

  const id = document.getElementById("f-id").value;
  const item = {
    nome: document.getElementById("f-nome").value.trim(),
    categoria: document.getElementById("f-categoria").value.trim(),
    descricao: document.getElementById("f-descricao").value.trim(),
    preco: parseFloat(document.getElementById("f-preco").value) || 0,
    tipo: document.getElementById("f-tipo").value,
    ativo: document.getElementById("f-ativo").checked,
  };
  if (id) item.id = isNaN(id) ? id : Number(id);
  if (!item.foto && currentFotoExistente) item.foto = currentFotoExistente;

  const file = els.fotoInput.files[0] || null;

  try {
    await saveItem(item, file);
    closeForm();
    refreshList();
  } catch (err) {
    alert("Não foi possível salvar: " + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Salvar item";
  }
});

/* ---------------- ABAS ---------------- */

els.navItens.addEventListener("click", () => {
  els.navItens.classList.add("active");
  els.navQr.classList.remove("active");
  els.panelItens.style.display = "block";
  els.panelQr.style.display = "none";
});

els.navQr.addEventListener("click", () => {
  els.navQr.classList.add("active");
  els.navItens.classList.remove("active");
  els.panelQr.style.display = "block";
  els.panelItens.style.display = "none";
  renderQRCode();
});

/* ---------------- QR CODE ---------------- */

function renderQRCode() {
  els.qrUrl.textContent = MENU_URL;
  const canvas = document.getElementById("qr-canvas");
  QRCode.toCanvas(canvas, MENU_URL, { width: 240, margin: 1, color: { dark: "#0a0a09", light: "#f2eee2" } });
}

els.qrDownload.addEventListener("click", () => {
  const canvas = document.getElementById("qr-canvas");
  const link = document.createElement("a");
  link.download = "sushiya-qrcode.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

checkAuth();
