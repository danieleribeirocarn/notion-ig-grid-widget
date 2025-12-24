const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

async function loadImages() {
  grid.innerHTML = "";

  try {
    const res = await fetch("/api/notion");
    const posts = await res.json();

    posts.forEach(post => {
      if (!post.images || post.images.length === 0) return;

      const postDiv = document.createElement("div");
      postDiv.className = "post";

      let currentIndex = 0;

      const img = document.createElement("img");
      img.className = "grid-img";
      img.src = post.images[0];
      img.alt = "Post image";

      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = post.images[currentIndex];
      });

      postDiv.appendChild(img);

      // ===== CARROSSEL (se tiver mais de uma imagem) =====
      if (post.images.length > 1) {
        const dots = document.createElement("div");
        dots.className = "dots";

        post.images.forEach((_, index) => {
          const dot = document.createElement("div");
          dot.className = "dot";
          if (index === 0) dot.classList.add("active");

          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = index;
            img.src = post.images[currentIndex];

            dots.querySelectorAll(".dot").forEach(d =>
              d.classList.remove("active")
            );
            dot.classList.add("active");
          });

          dots.appendChild(dot);
        });

        postDiv.appendChild(dots);
      }

      grid.appendChild(postDiv);
    });

  } catch (error) {
    console.error("Erro ao carregar imagens:", error);
  }
}

// ===== BOTÃO ATUALIZAR =====
refreshBtn.addEventListener("click", loadImages);

// ===== MODAL =====
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  modalImg.src = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalImg.src = "";
  }
});

// ===== LOAD INICIAL =====
loadImages();
