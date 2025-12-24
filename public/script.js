async function carregarPosts() {
  console.log("Iniciando carregamento...");

  const response = await fetch("/api/notion");
  const posts = await response.json();

  console.log("Posts recebidos:", posts);

  const grid = document.getElementById("grid");

  if (!grid) {
    console.error("Elemento #grid não encontrado");
    return;
  }

  grid.innerHTML = "";

  posts.forEach(post => {
    if (!post.image) return;

    const img = document.createElement("img");
    img.src = post.image;
    img.style.width = "100%";
    img.style.display = "block";

    grid.appendChild(img);
  });
}

carregarPosts();
