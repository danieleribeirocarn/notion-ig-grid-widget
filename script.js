async function carregarPosts() {
  const response = await fetch("/api/notion");
  const data = await response.json();

  const grid = document.getElementById("grid");

  data.results.forEach(page => {
    const file = page.properties.Imagem?.files[0];
    if (!file) return;

    const imgUrl = file.file.url;

    const post = document.createElement("div");
    post.className = "post";

    const img = document.createElement("img");
    img.src = imgUrl;

    post.appendChild(img);
    grid.appendChild(post);
  });
}

carregarPosts();
