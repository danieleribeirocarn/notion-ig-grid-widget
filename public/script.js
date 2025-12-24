const grid = document.getElementById("grid");
const refresh = document.getElementById("refresh");

async function loadImages() {
  grid.innerHTML = "carregando...";

  try {
    const res = await fetch("/api/notion");
    const data = await res.json();

    grid.innerHTML = "";

    data.forEach(item => {
      if (!item.images || item.images.length === 0) return;

      const div = document.createElement("div");
      div.className = "item";

      const img = document.createElement("img");
      img.src = item.images[0];

      div.appendChild(img);
      grid.appendChild(div);
    });

  } catch (err) {
    grid.innerHTML = "erro ao carregar";
    console.error(err);
  }
}

refresh.onclick = loadImages;
loadImages();
