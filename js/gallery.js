/* ============================================================
   gallery.js — photo grid, album filters, and an accessible lightbox
   ============================================================ */

let activePhotos = [];
let currentIndex = 0;
let lastFocusedElement = null;

(async function () {
  const config = window.SITE_CONFIG;
  const { rows } = await fetchCSV(config.galleryCsvUrl, 'data/gallery.csv');
  const photos = cleanRows(rows).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  setupGallery(photos);
  setupLightboxControls();
})();

function setupGallery(photos) {
  const grid = document.getElementById('gallery-grid');
  const filtersContainer = document.getElementById('gallery-filters');
  if (!grid) return;

  if (!photos.length) {
    grid.innerHTML = '<p class="state-message">Photos are coming soon.</p>';
    return;
  }

  const albums = ['All', ...new Set(photos.map((p) => p.album).filter(Boolean))];
  filtersContainer.innerHTML = '';
  albums.forEach((album, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = album;
    btn.setAttribute('aria-pressed', String(i === 0));
    btn.addEventListener('click', () => {
      filtersContainer.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      renderGrid(album === 'All' ? photos : photos.filter((p) => p.album === album));
    });
    filtersContainer.appendChild(btn);
  });

  renderGrid(photos);
}

function renderGrid(photos) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  photos.forEach((photo, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-item';
    btn.setAttribute('aria-label', photo.caption ? `View photo: ${photo.caption}` : 'View photo');

    const img = document.createElement('img');
    img.src = resolveImagePath(photo.image, 'gallery');
    img.alt = '';
    img.loading = 'lazy';
    attachImageFallback(img);
    btn.appendChild(img);

    btn.addEventListener('click', () => openLightbox(photos, index));
    grid.appendChild(btn);
  });
}

function openLightbox(photos, index) {
  activePhotos = photos;
  currentIndex = index;
  lastFocusedElement = document.activeElement;
  showLightboxPhoto();
  const lightbox = document.getElementById('lightbox');
  lightbox.hidden = false;
  document.getElementById('lightbox-close').focus();
  document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.hidden = true;
  document.removeEventListener('keydown', handleLightboxKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function showLightboxPhoto() {
  const photo = activePhotos[currentIndex];
  if (!photo) return;
  const img = document.getElementById('lightbox-image');
  img.src = resolveImagePath(photo.image, 'gallery');
  img.alt = photo.caption || '';
  attachImageFallback(img);
  document.getElementById('lightbox-caption').textContent = photo.caption || '';
}

function showNext() {
  if (!activePhotos.length) return;
  currentIndex = (currentIndex + 1) % activePhotos.length;
  showLightboxPhoto();
}

function showPrev() {
  if (!activePhotos.length) return;
  currentIndex = (currentIndex - 1 + activePhotos.length) % activePhotos.length;
  showLightboxPhoto();
}

function handleLightboxKeydown(event) {
  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowRight') {
    showNext();
  } else if (event.key === 'ArrowLeft') {
    showPrev();
  } else if (event.key === 'Tab') {
    const focusables = Array.from(document.querySelectorAll('#lightbox button'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function setupLightboxControls() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', showNext);
  document.getElementById('lightbox-prev').addEventListener('click', showPrev);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
