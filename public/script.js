async function carregarPosts() {
  const res = await fetch("/api/notion");
  const posts = await res.json();

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  posts.forEach(post => {
    if (!post.image) return;

    const item = document.createElement("div");
    item.className = "grid-item";

    item.innerHTML = `
      <img src="${post.image}" alt="Post do Instagram" />
    `;

    grid.appendChild(item);
  });
}

carregarPosts();
