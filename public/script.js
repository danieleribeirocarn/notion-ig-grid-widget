const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

// ===== MODAL =====
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

closeModal.onclick = () => modal.style.display = "none";
modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// ===== FUNÇÃO =====
async function carregarImagens() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  const data = await res.json();

  data.forEach(item => {
    if (!item.images || item.images.length === 0) return;

    let index = 0;

    // CONTAINER DO POST
    const post = document.createElement("div");
    post.className = "post";

    // IMAGEM
    const img = document.createElement("img");
    img.src = item.images[0];
    img.className = "grid-img";

    img.onclick = () => {
      modalImg.src = item.images[index];
      modal.style.display = "flex";
    };

    post.appendChild(img);

    // ===== BOLINHAS (se tiver mais de uma imagem)
    if (item.images.length > 1) {
      const dots = document.createElement("div");
      dots.className = "dots";

      item.images.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = i === 0 ? "dot active" : "dot";

        dot.onclick = e => {
          e.stopPropagation();
          index = i;
          img.src = item.images[index];
          updateDots(dots, index);
        };

        dots.appendChild(dot);
      });

      post.appendChild(dots);
    }

    grid.appendChild(post);
  });
}

function updateDots(container, activeIndex) {
  [...container.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === activeIndex);
  });
}

// ===== BOTÃO =====
refreshBtn.onclick = carregarImagens;

// ===== INIT =====
carregarImagens();
