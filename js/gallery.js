// ===== Populate Gallery =====
const galleryGrid = document.getElementById('galleryGrid');

galleryData.forEach((item, index) => {
  const el = document.createElement('div');
  el.className = 'gallery-item reveal';
  el.dataset.category = item.category;
  el.dataset.index = index;
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

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
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

function openLightbox(index) {
  const piece = galleryData[index];
  currentPieceImages = piece.images;
  currentImageIndex = 0;

  // Clear & add images
  lightboxImages.querySelectorAll('img').forEach(img => img.remove());
  piece.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${piece.title} - view ${i + 1}`;
    if (i === 0) img.classList.add('active');
    lightboxImages.insertBefore(img, lightboxImages.firstChild);
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
}

function goToImage(index) {
  currentImageIndex = index;
  const imgs = lightboxImages.querySelectorAll('img');
  const dots = lightboxThumbs.querySelectorAll('.lightbox-thumb');
  imgs.forEach(img => img.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  // Images are prepended so order is reversed in DOM
  imgs[imgs.length - 1 - index].classList.add('active');
  dots[index].classList.add('active');
}

document.getElementById('lightboxNext').addEventListener('click', () => {
  goToImage((currentImageIndex + 1) % currentPieceImages.length);
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
  goToImage((currentImageIndex - 1 + currentPieceImages.length) % currentPieceImages.length);
});

document.getElementById('lightboxClose').addEventListener('click', () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (e.key === 'ArrowRight') goToImage((currentImageIndex + 1) % currentPieceImages.length);
  if (e.key === 'ArrowLeft') goToImage((currentImageIndex - 1 + currentPieceImages.length) % currentPieceImages.length);
});

// Open lightbox from gallery items
galleryGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightbox(parseInt(item.dataset.index));
});

// Open lightbox from featured links
document.querySelectorAll('[data-gallery-open]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(parseInt(link.dataset.galleryOpen));
  });
});
