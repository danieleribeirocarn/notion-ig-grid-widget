const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let posts = [];
let draggedPostIndex = null;

async function carregarPosts() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  posts = await res.json();

  posts.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.draggable = true;

    const img = document.createElement("img");
    img.src = post.images[0];
    img.className = "grid-img";

    img.addEventListener("click", () => abrirModal(index, 0));

    postDiv.appendChild(img);

    /* Ícone de carrossel */
    if (post.images.length > 1) {
      const icon = document.createElement("div");
      icon.textContent = "⧉";
      icon.style.position = "absolute";
      icon.style.top = "6px";
      icon.style.right = "6px";
      icon.style.color = "white";
      icon.style.fontSize = "14px";
      postDiv.appendChild(icon);
    }

    adicionarDrag(postDiv, index);
    grid.appendChild(postDiv);
  });
}

/* ===== DRAG & DROP REAL ===== */

function adicionarDrag(element, index) {
  element.addEventListener("dragstart", () => {
    draggedPostIndex = index;
    element.classList.add("dragging");
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
  });

  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  element.addEventListener("drop", () => {
    if (draggedPostIndex === null || draggedPostIndex === index) return;

    const draggedItem = posts.splice(draggedPostIndex, 1)[0];
    posts.splice(index, 0, draggedItem);

    draggedPostIndex = null;
    renderReorderedPosts();
  });
}

function renderReorderedPosts() {
  grid.innerHTML = "";
  posts.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.draggable = true;

    const img = document.createElement("img");
    img.src = post.images[0];
    img.className = "grid-img";
    img.addEventListener("click", () => abrirModal(index, 0));

    postDiv.appendChild(img);

    if (post.images.length > 1) {
      const icon = document.createElement("div");
      icon.textContent = "⧉";
      icon.style.position = "absolute";
      icon.style.top = "6px";
      icon.style.right = "6px";
      icon.style.color = "white";
      icon.style.fontSize = "14px";
      postDiv.appendChild(icon);
    }

    adicionarDrag(postDiv, index);
    grid.appendChild(postDiv);
  });
}

/* ===== MODAL ===== */

let currentPostIndex = 0;
let currentImageIndex = 0;

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
