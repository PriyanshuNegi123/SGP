/**
 * Shri Girraj Ji Polymers - Interactive JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // Counter Animation for Stats
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const inc = target / speed;

      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.innerText = Math.ceil(count).toLocaleString() + suffix;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString() + suffix;
        }
      };

      updateCount();
    });
  };

  // Intersection Observer for Stats Counter Trigger
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // Smart On-Scroll Reveal Effect (with 0.3s delay)
  const setupSmartScrollReveal = () => {
    // Inject the scroll styles dynamically
    const style = document.createElement('style');
    style.id = 'smart-scroll-effects';
    style.innerHTML = `
      .reveal-up {
        opacity: 0 !important;
        transform: translateY(35px) !important;
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
        will-change: opacity, transform;
      }
      .reveal-up.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition-delay: 0.3s !important;
      }
    `;
    document.head.appendChild(style);

    // Target elements to animate (only parent-level containers or grids/columns/cards to prevent double nested triggers)
    const sections = document.querySelectorAll('section, footer, .direct-contact-card, .guarantee-contact-card');
    
    sections.forEach(section => {
      // Find columns, cards, lists, headers and tag them with reveal-up
      const targets = section.querySelectorAll(
        '.hero-left, .hero-right, ' +
        '.hero-content-left, .hero-content-right, ' +
        '.about-hero-left, .about-hero-right, ' +
        '.col-left, .col-right, ' +
        '.contact-form-wrap, .contact-details-column, ' +
        '.blog-detail-sidebar, .blog-detail-article, ' +
        '.blog-card, .product-card, .stat-item, .feature-card, ' +
        '.gallery-item, .facility-card, .guarantee-item, ' +
        '.direct-contact-item, .footer-column, ' +
        '.section-header, .about-gallery-grid > *'
      );

      if (targets.length > 0) {
        targets.forEach(target => {
          target.classList.add('reveal-up');
        });
      } else {
        // Fallback for simple sections: animate the main header/content directly
        const simpleTargets = section.querySelectorAll('h1, h2, h3, p, form, .container > *');
        simpleTargets.forEach(target => {
          target.classList.add('reveal-up');
        });
      }
    });

    // Setup intersection observer
    const animElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05, // Trigger when 5% of the element enters the viewport
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(el => {
      observer.observe(el);
    });
  };

  setupSmartScrollReveal();

  // Blog Page Tag Filtering & Search
  const initBlogFilters = () => {
    const blogTags = document.querySelectorAll('.tag-chip');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.querySelector('.search-input');

    if (!blogTags.length || !blogCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    const filterArticles = () => {
      blogCards.forEach(card => {
        // Category filtering
        const badge = card.querySelector('.blog-card-badge');
        const cardCategory = badge ? badge.textContent.trim().toLowerCase() : '';
        
        // Search query filtering
        const title = card.querySelector('.blog-card-title');
        const desc = card.querySelector('.blog-card-desc');
        const titleText = title ? title.textContent.trim().toLowerCase() : '';
        const descText = desc ? desc.textContent.trim().toLowerCase() : '';

        const matchesCategory = (activeCategory === 'all' || cardCategory.includes(activeCategory) || activeCategory.includes(cardCategory));
        const matchesSearch = (!searchQuery || titleText.includes(searchQuery) || descText.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
          card.style.display = '';
          // Ensure it's revealed in case scroll reveal didn't trigger
          card.classList.add('revealed');
        } else {
          card.style.display = 'none';
        }
      });
    };

    blogTags.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        blogTags.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.textContent.trim().toLowerCase();
        filterArticles();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      });
    }
  };

  initBlogFilters();
});
