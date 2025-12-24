const grid = document.getElementById("grid");
const refreshBtn = document.getElementById("refresh");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let modalImages = [];
let modalIndex = 0;

// ===== LOAD GRID =====
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

    img.addEventListener("click", () => {
      modalImages = post.images;
      modalIndex = currentIndex;
      openModal();
    });

    postDiv.appendChild(img);

    // Ícone carrossel
    if (post.images.length > 1) {
      const icon = document.createElement("div");
      icon.className = "carousel-icon";
      postDiv.appendChild(icon);
    }

    // Dots
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

// ===== MODAL =====
function openModal() {
  modal.style.display = "flex";
  modalImg.src = modalImages[modalIndex];
  updateNavVisibility();
}

function closeModalFn() {
  modal.style.display = "none";
  modalImg.src = "";
}

function showNext() {
  if (modalImages.length <= 1) return;
  modalIndex = (modalIndex + 1) % modalImages.length;
  modalImg.src = modalImages[modalIndex];
}

function showPrev() {
  if (modalImages.length <= 1) return;
  modalIndex =
    (modalIndex - 1 + modalImages.length) % modalImages.length;
  modalImg.src = modalImages[modalIndex];
}

function updateNavVisibility() {
  const visible = modalImages.length > 1;
  prevBtn.style.display = visible ? "block" : "none";
  nextBtn.style.display = visible ? "block" : "none";
}

// ===== EVENTS =====
closeModal.addEventListener("click", closeModalFn);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModalFn();
});

nextBtn.addEventListener("click", e => {
  e.stopPropagation();
  showNext();
});

prevBtn.addEventListener("click", e => {
  e.stopPropagation();
  showPrev();
});

// Teclado
document.addEventListener("keydown", e => {
  if (modal.style.display !== "flex") return;
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") closeModalFn();
});

// ===== SWIPE (mobile) =====
let touchStartX = 0;

modalImg.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

modalImg.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > 50) {
    diff > 0 ? showNext() : showPrev();
  }
});

// ===== UTILS =====
function updateDots(dotsContainer, activeIndex) {
  [...dotsContainer.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === activeIndex);
  });
}

// ===== REFRESH =====
refreshBtn.addEventListener("click", loadImages);

// ===== INIT =====
loadImages();
