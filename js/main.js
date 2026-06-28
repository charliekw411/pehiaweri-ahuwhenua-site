/* =========================================================
   Pehiāweri Ahuwhenua Trust — Main JS
   ========================================================= */

// ---- Mobile nav toggle ----
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ---- Active nav link ----
(function markActive() {
  const path = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (href === path || (path === '' && href === 'index.html') || (path.endsWith('/') && href === 'index.html')) {
      a.classList.add('active');
    } else if (href !== 'index.html' && path.includes(href.replace('.html', ''))) {
      a.classList.add('active');
    }
  });
})();

// ---- Lightbox with prev/next navigation ----
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg     = lightbox.querySelector('img');
  const lbClose   = lightbox.querySelector('.lightbox__close');
  const lbPrev    = lightbox.querySelector('.lightbox__prev');
  const lbNext    = lightbox.querySelector('.lightbox__next');
  const lbCounter = document.getElementById('lightbox-counter');

  // Build an index of all gallery images on this page
  const galleryItems = Array.from(document.querySelectorAll('.gallery-grid__item'));
  let currentIndex = 0;

  function showImage(index) {
    // Clamp index
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    const src = img.dataset.full || img.getAttribute('src');

    // Fade out → swap src → fade in
    lbImg.classList.add('loading');
    const newImg = new Image();
    newImg.onload = () => {
      lbImg.src = src;
      lbImg.alt = img.alt || '';
      lbImg.classList.remove('loading');
    };
    newImg.onerror = () => {
      // Fall back to thumbnail src if large version fails
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.alt || '';
      lbImg.classList.remove('loading');
    };
    newImg.src = src;

    // Update counter
    if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;

    // Show/hide arrows when only 1 image
    if (lbPrev) lbPrev.style.display = galleryItems.length > 1 ? '' : 'none';
    if (lbNext) lbNext.style.display = galleryItems.length > 1 ? '' : 'none';
  }

  function openLB(index) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    showImage(index);
  }

  function closeLB() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // Attach click to each gallery item
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLB(idx));
  });

  // Prev / Next buttons
  if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex + 1); });

  // Close on × or backdrop click
  lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });

  // Keyboard: ← → Escape
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLB();
    if (e.key === 'ArrowLeft')   showImage(currentIndex - 1);
    if (e.key === 'ArrowRight')  showImage(currentIndex + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? showImage(currentIndex + 1) : showImage(currentIndex - 1);
  });
}

// ---- Contact form (mailto fallback) ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(this);
    const name  = data.get('firstName') + ' ' + data.get('lastName');
    const email = data.get('email');
    const msg   = data.get('message');
    const subject = encodeURIComponent('Enquiry from ' + name);
    const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
    window.location.href = 'mailto:pehiawerib1b@gmail.com?subject=' + subject + '&body=' + body;
    const successEl = document.getElementById('form-success');
    if (successEl) {
      successEl.style.display = 'block';
      setTimeout(() => { successEl.style.display = 'none'; }, 6000);
    }
    this.reset();
  });
}

// ---- Scroll: slight header shadow variation ----
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
  } else {
    header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
  }
});
