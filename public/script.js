const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsContainer = document.getElementById("dots");

let currentImages = [];
let currentIndex = 0;

async function carregarPosts() {
  const response = await fetch("/api/notion");
  const posts = await response.json();

  grid.innerHTML = "";

  posts.forEach(post => {
    // normaliza imagens
    const images = post.images
      ? post.images
      : post.image
      ? [post.image]
      : [];

    if (images.length === 0) return;

    const img = document.createElement("img");
    img.src = images[0];

    img.addEventListener("click", () => {
      abrirModal(images);
    });

    grid.appendChild(img);
  });
}

function abrirModal(images) {
  currentImages = images;
  currentIndex = 0;

  atualizarImagem();
  criarDots();

  modal.style.display = "flex";
}

function atualizarImagem() {
  modalImage.src = currentImages[currentIndex];
  atualizarDots();

  prevBtn.style.display = currentImages.length > 1 ? "block" : "none";
  nextBtn.style.display = currentImages.length > 1 ? "block" : "none";
}

function criarDots() {
  dotsContainer.innerHTML = "";

  currentImages.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (index === currentIndex ? " active" : "");
    dotsContainer.appendChild(dot);
  });
}

function atualizarDots() {
  [...dotsContainer.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

// navegação
prevBtn.addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  atualizarImagem();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  atualizarImagem();
});

// fechar modal
closeModal.addEventListener("click", fecharModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

function fecharModal() {
  modal.style.display = "none";
  modalImage.src = "";
}

// botão atualizar
document.getElementById("refreshBtn").addEventListener("click", carregarPosts);

// inicial
carregarPosts();
