const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

async function carregarPosts() {
  console.log("🔄 Atualizando posts...");

  const response = await fetch("/api/notion");
  const posts = await response.json();

  grid.innerHTML = "";

  posts.forEach(post => {
    if (!post.image) return;

    const img = document.createElement("img");
    img.src = post.image;
    img.alt = "Imagem do Notion";

    // 👉 abrir imagem grande
    img.addEventListener("click", () => {
      modalImage.src = post.image;
      modal.style.display = "flex";
    });

    grid.appendChild(img);
  });

  console.log("✅ Grid atualizado");
}

// carregar ao abrir
carregarPosts();

// botão atualizar
document.getElementById("refreshBtn").addEventListener("click", () => {
  carregarPosts();
});

// fechar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  modalImage.src = "";
});

// clicar fora da imagem fecha
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalImage.src = "";
  }
});
