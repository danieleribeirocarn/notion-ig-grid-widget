const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

// ===== MODAL =====
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ===== FUNÇÃO PRINCIPAL =====
async function carregarImagens() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  const data = await res.json();

  data.forEach(item => {
    if (!item.images || item.images.length === 0) return;

    const img = document.createElement("img");
    img.src = item.images[0];
    img.className = "grid-img";

    // 👉 abrir imagem grande
    img.addEventListener("click", () => {
      modalImg.src = item.images[0];
      modal.style.display = "flex";
    });

    grid.appendChild(img);
  });
}

// ===== BOTÃO ATUALIZAR =====
refreshBtn.addEventListener("click", carregarImagens);

// ===== INICIAL =====
carregarImagens();
