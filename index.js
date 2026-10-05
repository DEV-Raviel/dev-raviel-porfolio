document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.navbar a');
    const indicator = document.querySelector('.nav-indicator');

    if (!indicator) return;

    // Detect current page file name
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Set active class on current link
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const activeLink = document.querySelector('.navbar a.active') || links[0];

    // Function to set position
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

        // Force browser layout repaint if transitions were disabled
        if (!animate) {
            indicator.offsetHeight; 
            indicator.style.transition = 'left 0.35s cubic-bezier(0.25, 1, 0.4, 1), width 0.35s cubic-bezier(0.25, 1, 0.4, 1), opacity 0.2s ease';
        }
    }

    // 1. Restore position from previous page load if available
    const prevLeft = sessionStorage.getItem('nav_prev_left');
    const prevWidth = sessionStorage.getItem('nav_prev_width');

    if (prevLeft && prevWidth) {
        // Start pill at previous page's position instantly
        indicator.style.transition = 'none';
        indicator.style.left = `${prevLeft}px`;
        indicator.style.width = `${prevWidth}px`;
        indicator.style.opacity = '1';
        
        // Force reflow
        indicator.offsetHeight;

        // Slide smoothly to the current page's active tab
        requestAnimationFrame(() => {
            setIndicatorPosition(activeLink, true);
        });
    } else {
        // First visit: set directly to active link
        setIndicatorPosition(activeLink, true);
    }

    // 2. Handle click: Slide pill FIRST, then navigate
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip anchor links (#) or external links
            if (!href || href.startsWith('#') || href.startsWith('http')) return;

            e.preventDefault();

            // Save current position for next page
            sessionStorage.setItem('nav_prev_left', `${link.offsetLeft}`);
            sessionStorage.setItem('nav_prev_width', `${link.offsetWidth}`);

            // Slide pill to clicked target
            setIndicatorPosition(link, true);

            // Wait 300ms for slide animation to finish before changing page
            setTimeout(() => {
                window.location.href = href;
            }, 100);
        });
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        setIndicatorPosition(document.querySelector('.navbar a.active'), false);
    });
});

// --- GALLERY LIGHTBOX MODAL ---
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const cards = document.querySelectorAll('.gallery-card');

  if (modal && modalImg) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-src');
        modalImg.src = src;
        modal.classList.add('active');
      });
    });

    const closeModal = () => modal.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});



// --- DYNAMIC MULTI-MEDIA LIGHTBOX (Event Delegation) ---
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('lightboxModal');
  const lightboxContent = document.getElementById('lightboxContent');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryGrid = document.querySelector('.gallery-grid');

  if (modal && lightboxContent && galleryGrid) {
    // Listen for clicks on the parent grid wrapper dynamically
    galleryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;

      const src = card.getAttribute('data-src');
      const dataType = card.getAttribute('data-type');
      
      // Determine media type
      const isVideo = dataType === 'video' || (src && src.toLowerCase().endsWith('.mp4'));

      // Flush previous container DOM completely
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
      // Wipe modal contents to stop audio/video playback immediately
      lightboxContent.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
});





// --- 3D PORTFOLIO CARD FLIP HANDLER ---
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.portfolio-card');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // 1. Do NOT flip card if user clicks the external link on the back side
      if (e.target.closest('.card-link')) {
        return;
      }

      // 2. Flip card when clicking any flip button or front card face
      if (e.target.closest('.flip-btn') || e.target.closest('.card-front')) {
        card.classList.toggle('is-flipped');
      }
    });
  });
});


// React Bits Style - Interactive Particles & Constellation Engine
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 140 };

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

// Track cursor movement across canvas
window.addEventListener('resize', () => { resize(); init(); });
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.7; // Velocity X
    this.vy = (Math.random() - 0.5) * 0.7; // Velocity Y
    this.size = Math.random() * 2 + 1;
    this.baseAlpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off screen boundaries
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Cursor proximity push (magnetic repulsion)
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
  // Dynamic particle count relative to screen area
  const count = Math.floor((width * height) / 9500);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  const maxDistance = 120; // Max distance to draw connecting line between nodes

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

    // Connect nodes directly to cursor when hovering nearby
    if (mouse.x !== null && mouse.y !== null) {
      const dx = particles[a].x - mouse.x;
      const dy = particles[a].y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        const alpha = (1 - dist / mouse.radius) * 0.45;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  drawConnections();
  requestAnimationFrame(animate);
}

init();
animate();

// SPA / Dynamic Page Loader (Prevents Nav & Canvas Reloading)
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.navbar a');
  const mainContainer = document.querySelector('main');

  async function loadPage(url, pushToHistory = true) {
    try {
      // 1. Fetch the target HTML file in the background
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const htmlText = await response.text();

      // 2. Parse the fetched HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const newMain = doc.querySelector('main');
      const newTitle = doc.title;

      if (newMain && mainContainer) {
        // 3. Swap main content, classes, and document title
        mainContainer.innerHTML = newMain.innerHTML;
        mainContainer.className = newMain.className;
        document.title = newTitle;

        // 4. Update browser URL without refreshing
        if (pushToHistory) {
          history.pushState({ url }, newTitle, url);
        }

        // 5. Update active link state in navbar
        updateNavState(url);

        // 6. Scroll smoothly to top of new section
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Failed to swap page smoothly:', error);
      // Fallback to standard page load if fetch fails
      window.location.href = url;
    }
  }

  function updateNavState(targetUrl) {
    const fileName = targetUrl.split('/').pop() || 'index.html';

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === fileName || (fileName === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Intercept navbar link clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Intercept local relative links only
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        
        // Don't re-fetch if already on the selected page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === href) return;

        loadPage(href);
      }
    });
  });

  // Handle browser Back / Forward navigation buttons
  window.addEventListener('popstate', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    loadPage(currentPage, false);
  });
});