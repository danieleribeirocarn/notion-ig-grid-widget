async function carregarPosts() {
  const res = await fetch("/api/notion");
  const posts = await res.json();

  const grid = document.getElementById("grid");

  posts
    .filter(post => post.show)
    .slice(0, 9)
    .forEach(post => {
      const img = document.createElement("img");
      img.src = post.image;
      img.title = post.caption;
      grid.appendChild(img);
    });
}

carregarPosts();
