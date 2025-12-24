const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

// Estado do carrossel
let currentImages = [];
let currentIndex = 0;

// ===============================
// CARREGAR POSTS
// ===============================
async function carregarPosts() {
  grid.innerHTML = "";

  try {
    const res = await fetch("/api/notion");
    const posts = await res.json();

    posts.forEach(post => {
      if (!post.images || post.images.length === 0) return;

      const postDiv = document.createElement("div");
      postDiv.className = "post";

      const img = document.createElement("img");
      img.src = post.images[0];
      img.className = "grid-img";

      img.onclick = () => abrirModal(post.images);

      postDiv.appendChild(img);

      // BOLINHAS NO GRID
      if (post.images.length > 1) {
        const dots = document.createElement("div");
        dots.className = "dots";

        post.images.forEach((_, i) => {
          const dot = document.createElement("div");
          dot.className = "dot";
          if (i === 0) dot.classList.add("active");
          dots.appendChild(dot);
        });

        postDiv.appendChild(dots);
      }

      grid.appendChild(postDiv);
    });

  } catch (err) {
    console.error("Erro ao carregar posts:", err);
  }
}

// ===============================
// MODAL
// ===============================
function abrirModal(images) {
  currentImages = images;
  currentIndex = 0;

  atualizarImagemModal();

  modal.style.display = "flex";
}

function atualizarImagemModal() {
  modalImg.src = currentImages[currentIndex];
}

// ===============================
// NAVEGAÇÃO DO CARROSSEL
// ===============================
document.addEventListener("keydown", e => {
  if (modal.style.display !== "flex") return;

  if (e.key === "ArrowRight") proximaImagem();
  if (e.key === "ArrowLeft") imagemAnterior();
  if (e.key === "Escape") fecharModal();
});

function proximaImagem() {
  if (currentImages.length <= 1) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  atualizarImagemModal();
}

function imagemAnterior() {
  if (currentImages.length <= 1) return;
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  atualizarImagemModal();
}

// ===============================
// FECHAR MODAL
// ===============================
function fecharModal(
