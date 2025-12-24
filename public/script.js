const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

async function carregarImagens() {
  grid.innerHTML = "";

  try {
    const res = await fetch("/api/notion");
    const data = await res.json();

    console.log("📦 Dados da API:", data);

    data.forEach(item => {
      if (!item.images || item.images.length === 0) return;

      const post = document.createElement("div");
      post.className = "post";

      const img = document.createElement("img");
      img.className = "grid-img";
      img.src = item.images[0];
      img.alt = "Imagem do post";

      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = item.images[0];
      });

      post.appendChild(img);
      grid.appendChild(post);
    });

  } catch (err) {
    console.error("Erro ao carregar imagens:", err);
  }
}

// fechar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  modalImg.src = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalImg.src = "";
  }
});

// botão atualizar
refreshBtn.addEventListener("click", carregarImagens);

// carregar ao abrir
carregarImagens();
