const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let posts = [];
let currentPostIndex = 0;
let currentImageIndex = 0;

async function carregarPosts() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  posts = await res.json();

  posts.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.draggable = true;
    postDiv.dataset.index = index;

    const img = document.createElement("img");
    img.src = post.images[0];
    img.className = "grid-img";

    img.addEventListener("click", () => abrirModal(index, 0));

    postDiv.appendChild(img);

    // 🔵 Ícone de carrossel
    if (post.images.length > 1) {
      const icon = document.createElement("div");
      icon.innerHTML = "⧉";
      icon.style.position = "absolute";
      icon.style.top = "6px";
      icon.style.right = "6px";
      icon.style.color = "white";
      icon.style.fontSize = "14px";
      postDiv.appendChild(icon);
    }

    // 🔵 Dots
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

    adicionarDragEvents(postDiv);
    grid.appendChild(postDiv);
  });
}

/* ===== DRAG & DROP ===== */

let draggedIndex = null;

function adicionarDragEvents(element) {
  element.addEventListener("dragstart", () => {
    draggedIndex = Number(element.dataset.index);
    element.classList.add("dragging");
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
  });

  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  element.addEventListener("drop", () => {
    const targetIndex = Number(element.dataset.index);

    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const item = posts.splice(draggedIndex, 1)[0];
    posts.splice(targetIndex, 0, item);

    carregarPosts();
  });
}

/* ===== MODAL ===== */

function abrirModal(postIndex, imageIndex) {
  currentPostIndex = postIndex;
  currentImageIndex = imageIndex;
  modalImg.src = posts[postIndex].images[imageIndex];
  modal.style.display = "flex";
}

function atualizarModal() {
  modalImg.src = posts[currentPostIndex].images[currentImageIndex];
}

nextBtn.onclick = () => {
  const imgs = posts[currentPostIndex].images;
  currentImageIndex = (currentImageIndex + 1) % imgs.length;
  atualizarModal();
};

prevBtn.onclick = () => {
  const imgs = posts[currentPostIndex].images;
  currentImageIndex =
    (currentImageIndex - 1 + imgs.length) % imgs.length;
  atualizarModal();
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

/* ===== BOTÃO ATUALIZAR ===== */

refreshBtn.onclick = carregarPosts;

carregarPosts();
