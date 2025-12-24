const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

// =======================
// CARREGAR IMAGENS
// =======================
async function carregarImagens() {
  try {
    grid.innerHTML = "";

    const response = await fetch("/api/notion");
    const data = await response.json();

    data.forEach(postData => {
      if (!postData.images || postData.images.length === 0) return;

      const post = document.createElement("div");
      post.className = "post";

      const img = document.createElement("img");
      img.className = "grid-img";
      img.src = postData.images[0];
      img.alt = "";
