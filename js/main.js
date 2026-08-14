/* ================================================================
   WEBSITE RESMI DESA PAPASAN
   Main JavaScript
   ================================================================ */

// Apply dark mode early to prevent flicker
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', function () {

    // ================================================================
    // DARK MODE TOGGLE
    // ================================================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        
        darkModeToggle.addEventListener('click', function (e) {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'light';
            
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                newTheme = 'dark';
            }
            localStorage.setItem('theme', newTheme);
        });
    }

    // ================================================================
    // LOADING SCREEN
    // ================================================================
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = '';
            }, 800);
        });
        // Fallback: hide after 3 seconds regardless
        setTimeout(function () {
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }, 3000);
    }

    // ================================================================
    // NAVBAR SCROLL EFFECT
    // ================================================================
    const navbar = document.querySelector('.navbar-main');
    const tickerStrip = document.querySelector('.ticker-strip');

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run on load

    // ================================================================
    // ACTIVE NAV LINK HIGHLIGHT
    // ================================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-main .nav-link');

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        // Handle dropdown parent active state
        if (link.closest('.dropdown-menu')) {
            const parentDropdown = link.closest('.nav-item.dropdown');
            if (href === currentPage && parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    });

    // ================================================================
    // BACK TO TOP BUTTON
    // ================================================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================================================================
    // COUNTER ANIMATION
    // ================================================================
    const counters = document.querySelectorAll('[data-counter]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(startValue + (target - startValue) * easeOut);

            el.textContent = current.toLocaleString('id-ID') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Intersection Observer for counters
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    // ================================================================
    // NEWS TICKER
    // ================================================================
    const tickerTrack = document.getElementById('ticker-track');
    const tickerOriginal = document.getElementById('ticker-original');

    if (tickerTrack && tickerOriginal) {
        // Duplicate ticker content for seamless loop
        const clone = tickerOriginal.cloneNode(true);
        clone.id = 'ticker-clone';
        tickerTrack.appendChild(clone);
    }

    // ================================================================
    // GALLERY FILTER
    // ================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-filter-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Remove active from all buttons
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(function (item) {
                if (filter === 'semua' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ================================================================
    // NEWS SEARCH
    // ================================================================
    const searchInput = document.getElementById('newsSearch');
    const newsCards = document.querySelectorAll('.news-card-item');

    if (searchInput && newsCards.length > 0) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            newsCards.forEach(function (card) {
                const title = (card.getAttribute('data-title') || '').toLowerCase();
                const text = (card.textContent || '').toLowerCase();

                if (title.includes(query) || text.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ================================================================
    // NEWS CATEGORY FILTER
    // ================================================================
    const catLinks = document.querySelectorAll('.category-filter-link');

    catLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            catLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            newsCards.forEach(function (card) {
                if (category === 'semua' || card.getAttribute('data-category') === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // ================================================================
    // INITIALIZE AOS (Animate on Scroll)
    // ================================================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            delay: 50
        });
    }

    // ================================================================
    // INITIALIZE FANCYBOX (Lightbox)
    // ================================================================
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox]', {
            Thumbs: { type: 'classic' },
            Toolbar: {
                display: {
                    left: [],
                    middle: [],
                    right: ['close'],
                },
            },
            Images: { zoom: true },
            Carousel: { transition: 'slide' },
        });
    }

    // ================================================================
    // CONTACT FORM HANDLER (Front-end only)
    // ================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitBtn.disabled = true;

            // Simulate sending
            setTimeout(function () {
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Pesan Terkirim!';
                submitBtn.classList.remove('btn-primary-custom');
                submitBtn.style.background = '#4CAF50';

                // Show success message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success mt-3';
                alertDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.';
                contactForm.appendChild(alertDiv);

                // Reset after 3 seconds
                setTimeout(function () {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.add('btn-primary-custom');
                    submitBtn.style.background = '';
                    if (alertDiv.parentNode) alertDiv.remove();
                }, 4000);
            }, 1500);
        });
    }

    // ================================================================
    // SHARE BUTTONS (News Detail)
    // ================================================================
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const type = this.getAttribute('data-share');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl = '';

            switch (type) {
                case 'facebook':
                    shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                    break;
                case 'twitter':
                    shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
                    break;
                case 'whatsapp':
                    shareUrl = 'https://api.whatsapp.com/send?text=' + title + '%20' + url;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(window.location.href).then(function () {
                        const icon = btn.querySelector('i');
                        icon.className = 'fas fa-check';
                        setTimeout(function () {
                            icon.className = 'fas fa-link';
                        }, 2000);
                    });
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // ================================================================
    // PARALLAX DECORATIVE ELEMENTS
    // ================================================================
    window.addEventListener('scroll', function () {
        const decorElements = document.querySelectorAll('.decorative-dots');
        decorElements.forEach(function (el) {
            const speed = parseFloat(el.getAttribute('data-speed') || '0.3');
            el.style.transform = 'translateY(' + (window.scrollY * speed) + 'px)';
        });
    });

    // ================================================================
    // BERITA ACARA TABS (SD & MI)
    // ================================================================
    const baTabBtns = document.querySelectorAll('.ba-tab-btn');
    if (baTabBtns.length > 0) {
        baTabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');

                // Remove active from all buttons
                baTabBtns.forEach(function (b) { b.classList.remove('active'); });
                // Add active to clicked button
                this.classList.add('active');

                // Hide all tab contents
                document.querySelectorAll('.ba-tab-content').forEach(function (content) {
                    content.classList.remove('active');
                });

                // Show target tab content
                const targetContent = document.getElementById('tab-' + targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

});

// ================================================================
// FADE IN UP ANIMATION (for dynamic elements)
// ================================================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
