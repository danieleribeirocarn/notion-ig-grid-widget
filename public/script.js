const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

async function loadImages() {
  grid.innerHTML = "";

  const res = await fetch("/api/notion");
  const posts = await res.json();

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    let currentIndex = 0;

    const img = document.createElement("img");
    img.className = "grid-img";
    img.src = post.images[0];

    // ===== ABRIR MODAL =====
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = post.images[currentIndex];
    });

    postDiv.appendChild(img);

    // ===== ÍCONE DE CARROSSEL =====
    if (post.images.length > 1) {
      const icon = document.createElement("div");
      icon.className = "carousel-icon";
      postDiv.appendChild(icon);
    }

    // ===== DOTS =====
    if (post.images.length > 1) {
      const dots = document.createElement("div");
      dots.className = "dots";

      post.images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");

        dot.addEventListener("click", e => {
          e.stopPropagation();
          currentIndex = index;
          img.src = post.images[currentIndex];
          updateDots(dots, currentIndex);
        });

        dots.appendChild(dot);
      });

      postDiv.appendChild(dots);
    }

    grid.appendChild(postDiv);
  });
}

function updateDots(dotsContainer, activeIndex) {
  [...dotsContainer.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === activeIndex);
  });
}

// ===== MODAL CLOSE =====
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  modalImg.src = "";
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalImg.src = "";
  }
});

// ===== BOTÃO ATUALIZAR =====
refreshBtn.addEventListener("click", loadImages);

// ===== INIT =====
loadImages();
