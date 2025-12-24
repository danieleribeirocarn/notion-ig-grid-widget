const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

async function carregarImagens() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  const data = await res.json();

  data.forEach(item => {
    if (!item.images || item.images.length === 0) return;

    const post = document.createElement("div");
    post.className = "post";

    const img = document.createElement("img");
    img.className = "grid-img";
    img.src = item.images[0];

    img.addEventListener("click", () => {
      abrirModal(item.images[0]);
    });

    post.appendChild(img);
    grid.appendChild(post);
  });
}

function abrirModal(src) {
  // limpa antes
  modalImg.src = "";
  modal.style.display = "flex";

  const tempImg = new Image();
  tempImg.onload = () => {
    modalImg.src = src;
  };
  tempImg.src = src;
}

// fechar modal
closeModal.addEventListener("click", fecharModal);
modal.addEventListener("click", e => {
  if (e.target === modal) fecharModal();
});

function fecharModal() {
  modal.style.display = "none";
  modalImg.src = "";
}

// botão atualizar
refreshBtn.addEventListener("click", carregarImagens);

// carregar inicial
carregarImagens();
