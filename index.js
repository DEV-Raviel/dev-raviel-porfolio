/* ==========================================================================
   1. NAVIGATION SLIDING INDICATOR
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.navbar a');
  const indicator = document.querySelector('.nav-indicator');
  if (!indicator) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const activeLink = document.querySelector('.navbar a.active') || links[0];

  function setIndicatorPosition(el, animate = true) {
    if (!el) return;
    if (!animate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = 'left 0.35s cubic-bezier(0.25, 1, 0.4, 1), width 0.35s cubic-bezier(0.25, 1, 0.4, 1), opacity 0.2s ease';
    }
    indicator.style.left = `${el.offsetLeft}px`;
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.opacity = '1';

    if (!animate) {
      indicator.offsetHeight;
      indicator.style.transition = 'left 0.35s cubic-bezier(0.25, 1, 0.4, 1), width 0.35s cubic-bezier(0.25, 1, 0.4, 1), opacity 0.2s ease';
    }
  }

  const prevLeft = sessionStorage.getItem('nav_prev_left');
  const prevWidth = sessionStorage.getItem('nav_prev_width');

  if (prevLeft && prevWidth) {
    indicator.style.transition = 'none';
    indicator.style.left = `${prevLeft}px`;
    indicator.style.width = `${prevWidth}px`;
    indicator.style.opacity = '1';
    indicator.offsetHeight;

    requestAnimationFrame(() => {
      setIndicatorPosition(activeLink, true);
    });
  } else {
    setIndicatorPosition(activeLink, true);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      e.preventDefault();

      sessionStorage.setItem('nav_prev_left', `${link.offsetLeft}`);
      sessionStorage.setItem('nav_prev_width', `${link.offsetWidth}`);

      setIndicatorPosition(link, true);

      setTimeout(() => {
        window.location.href = href;
      }, 100);
    });
  });

  window.addEventListener('resize', () => {
    setIndicatorPosition(document.querySelector('.navbar a.active'), false);
  });
});

/* ==========================================================================
   2. GALLERY LIGHTBOX MODAL (DYNAMIC MULTI-MEDIA)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('lightboxModal');
  const lightboxContent = document.getElementById('lightboxContent');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryGrid = document.querySelector('.gallery-grid');

  if (modal && lightboxContent && galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;

      const src = card.getAttribute('data-src');
      const dataType = card.getAttribute('data-type');
      const isVideo = dataType === 'video' || (src && src.toLowerCase().endsWith('.mp4'));

      lightboxContent.innerHTML = '';

      if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';
        video.style.borderRadius = '12px';
        video.style.display = 'block';
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Enlarged View';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '80vh';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '12px';
        img.style.display = 'block';
        lightboxContent.appendChild(img);
      }

      modal.classList.add('active');
    });

    const closeModal = () => {
      modal.classList.remove('active');
      lightboxContent.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});

/* ==========================================================================
   3. UNIFIED 3D PORTFOLIO CARD FLIP HANDLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.portfolio-card-container');

  containers.forEach(container => {
    const card = container.querySelector('.portfolio-card');
    if (!card) return;

    container.addEventListener('click', (e) => {
      // 1. If user clicks any link (the image link or back card link), allow navigation & do NOT flip
      if (e.target.closest('a')) {
        return;
      }

      // 2. Click anywhere else on card (or the flip button) toggles the flip state
      card.classList.toggle('is-flipped');
    });
  });
});

/* ==========================================================================
   4. PARTICLES & CONSTELLATION CANVAS ENGINE
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    const count = Math.floor((width * height) / 9500);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDistance = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
}