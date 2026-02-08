// ===== Populate Gallery =====
const galleryGrid = document.getElementById('galleryGrid');

galleryData.forEach((item, index) => {
  const el = document.createElement('div');
  el.className = 'gallery-item reveal';
  el.dataset.category = item.category;
  el.dataset.index = index;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `View ${item.title} — ${item.category}`);
  el.style.transitionDelay = `${(index % 4) * 0.08}s`;
  el.innerHTML = `
    <img src="${item.images[0]}" alt="${item.title}" loading="lazy">
    <div class="gallery-item-overlay">
      <div class="gallery-item-info">
        <h3>${item.title}</h3>
        <span>${item.category}</span>
      </div>
    </div>
  `;
  galleryGrid.appendChild(el);
});

// ===== Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

let filterGeneration = 0;

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const gen = ++filterGeneration;

    galleryItems.forEach(item => {
      const shouldShow = filter === 'all' || item.dataset.category === filter;

      if (shouldShow) {
        // Show: clear any hiding/hidden state
        const wasHidden = item.classList.contains('hidden') || item.classList.contains('hiding');
        item.classList.remove('hidden');
        if (wasHidden) {
          item.classList.add('hiding');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.classList.remove('hiding');
            });
          });
        }
      } else {
        // Hide: animate out, then set display none
        if (!item.classList.contains('hidden')) {
          item.classList.add('hiding');
          setTimeout(() => {
            // Only finalize if this filter is still active
            if (filterGeneration === gen) {
              item.classList.add('hidden');
              item.classList.remove('hiding');
            }
          }, 400);
        }
      }
    });
  });
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImages = document.getElementById('lightboxImages');
const lightboxDetails = document.getElementById('lightboxDetails');
const lightboxThumbs = document.getElementById('lightboxThumbs');
let currentImageIndex = 0;
let currentPieceImages = [];
let previouslyFocusedElement = null;

// Focusable elements inside lightbox for focus trap
function getLightboxFocusable() {
  return lightbox.querySelectorAll('button:not([style*="display: none"])');
}

function openLightbox(index) {
  const piece = galleryData[index];
  currentPieceImages = piece.images;
  currentImageIndex = 0;
  previouslyFocusedElement = document.activeElement;

  // Clear & add images (appended in order)
  lightboxImages.querySelectorAll('img').forEach(img => img.remove());
  piece.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${piece.title} - view ${i + 1}`;
    if (i === 0) img.classList.add('active');
    lightboxImages.appendChild(img);
  });

  // Thumbnails & arrows — hide when only one image
  const arrows = lightboxImages.querySelector('.lightbox-arrows');
  lightboxThumbs.innerHTML = '';
  if (piece.images.length > 1) {
    arrows.style.display = '';
    lightboxThumbs.style.display = '';
    piece.images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `lightbox-thumb${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `View image ${i + 1} of ${piece.images.length}`);
      dot.addEventListener('click', () => goToImage(i));
      lightboxThumbs.appendChild(dot);
    });
  } else {
    arrows.style.display = 'none';
    lightboxThumbs.style.display = 'none';
  }

  // Details
  lightboxDetails.innerHTML = `
    <span class="featured-category">${piece.category}</span>
    <h2>${piece.title}</h2>
    <p>${piece.description}</p>
    <div class="lightbox-meta">
      <div class="lightbox-meta-row">
        <span class="lightbox-meta-label">Type</span>
        <span>${piece.scale}</span>
      </div>
      <div class="lightbox-meta-row">
        <span class="lightbox-meta-label">Materials</span>
        <span>${piece.medium}</span>
      </div>
      <div class="lightbox-meta-row">
        <span class="lightbox-meta-label">Technique</span>
        <span>${piece.time}</span>
      </div>
    </div>
  `;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus the close button when lightbox opens
  document.getElementById('lightboxClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  }
}

function goToImage(index) {
  currentImageIndex = index;
  const imgs = lightboxImages.querySelectorAll('img');
  const dots = lightboxThumbs.querySelectorAll('.lightbox-thumb');
  imgs.forEach(img => img.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  if (imgs[index]) imgs[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
}

document.getElementById('lightboxNext').addEventListener('click', () => {
  goToImage((currentImageIndex + 1) % currentPieceImages.length);
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
  goToImage((currentImageIndex - 1 + currentPieceImages.length) % currentPieceImages.length);
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
    return;
  }
  if (e.key === 'ArrowRight') goToImage((currentImageIndex + 1) % currentPieceImages.length);
  if (e.key === 'ArrowLeft') goToImage((currentImageIndex - 1 + currentPieceImages.length) % currentPieceImages.length);

  // Focus trap
  if (e.key === 'Tab') {
    const focusable = Array.from(getLightboxFocusable());
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

// Open lightbox from gallery items (click and keyboard)
galleryGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightbox(parseInt(item.dataset.index));
});

galleryGrid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const item = e.target.closest('.gallery-item');
    if (item) {
      e.preventDefault();
      openLightbox(parseInt(item.dataset.index));
    }
  }
});

// Open lightbox from featured links
document.querySelectorAll('[data-gallery-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    openLightbox(parseInt(btn.dataset.galleryOpen));
  });
});
