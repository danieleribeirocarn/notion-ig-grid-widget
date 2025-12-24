async function carregarPosts() {
  console.log("🔄 Atualizando posts...");

  const response = await fetch("/api/notion");
  const posts = await response.json();

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  posts.forEach(post => {
    if (!post.image) return;

    const img = document.createElement("img");
    img.src = post.image;
    img.alt = "Imagem do Notion";

    grid.appendChild(img);
  });

  console.log("✅ Grid atualizado");
}

// carregar automaticamente ao abrir
carregarPosts();

// BOTÃO ATUALIZAR
document.getElementById("refreshBtn").addEventListener("click", () => {
  carregarPosts();
});
