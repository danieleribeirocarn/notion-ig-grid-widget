const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const dotsContainer = document.getElementById("dots");

let currentImages = [];
let currentIndex = 0;

fetch("/api/notion")
  .then(res => res.json())
  .then(data => {
    grid.innerHTML = "";

    data.forEach(item => {
      if (!item.images || item.images.length === 0) return;

      const div = document.createElement("div");
      div.className = "item";

      const img = document.createElement("img");
      img.src = item.images[0];

      div.appendChild(img);

      // ÍCONE DE CARROSSEL (se tiver +1 imagem)
      if (item.images.length > 1) {
        const icon = document.createElement("div");
        icon.className = "carousel-icon";
        icon.innerText = "⧉";
        div.appendChild(icon);
      }

      div.onclick = () => openModal(item.images);

      grid.appendChild(div);
    });
  });

function openModal(images) {
  currentImages = images;
  currentIndex = 0;

  modal.classList.add("active");
  updateModal();
}

function updateModal() {
  modalImage.src = currentImages[currentIndex];

  dotsContainer.innerHTML = "";

  currentImages.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === currentIndex ? " active" : "");
    dot.onclick = () => {
      currentIndex = i;
      updateModal();
    };
    dotsContainer.appendChild(dot);
  });
}

modal.onclick = () => {
  modal.classList.remove("active");
};

