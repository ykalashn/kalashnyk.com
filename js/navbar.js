(function() {
  function injectNavbar() {
    const isIndex =
      window.location.pathname.endsWith('index.html') ||
      window.location.pathname === '/' ||
      window.location.pathname === '/index.html';

    const projectsHref = isIndex ? '#projects' : '/#projects';
    const contactHref = isIndex ? '#contact' : '/#contact';

    const navHTML = `
<nav id="mainNav" class="navbar navbar-expand-lg py-3 px-2 position-fixed top-0 w-100">
  <div class="container position-relative">
    <!-- Name left on desktop, hidden on mobile -->
    <a class="navbar-brand fw-semibold d-none d-lg-flex align-items-center position-absolute start-0 top-50 translate-middle-y" href="/" style="z-index:2;">
      <span class="navbar-name">Yevhenii Kalashnyk</span>
    </a>
    <!-- Logo left, name center, hamburger right on mobile -->
    <a class="navbar-logo-link d-flex align-items-center justify-content-center mx-auto" href="/about" >
      <img src="https://res.cloudinary.com/yevhenii-kalashnyk/image/upload/w_250,h_250/f_auto,q_auto/v1755963784/logo_trtynm.svg" alt="Logo" class="navbar-logo" />
    </a>
    <a class="navbar-name-mobile fw-semibold d-lg-none" href="/">Yevhenii Kalashnyk</a>
    <button class="navbar-toggler custom-hamburger" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavCollapse" aria-controls="mainNavCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="custom-hamburger-icon">
        <span></span>
        <span></span>
      </span>
    </button>
    <div class="collapse navbar-collapse" id="mainNavCollapse">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
        <li class="nav-item">
          <a class="nav-link" href="/about">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${projectsHref}">Projects</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${contactHref}">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    `;
    // Remove any existing nav before injecting
    const oldNav = document.getElementById('mainNav');
    if (oldNav) oldNav.remove();

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Ensure navbar-collapse is always open on large screens
    function updateNavCollapse() {
      var navCollapse = document.getElementById('mainNavCollapse');
      var toggler = document.querySelector('.custom-hamburger');
      if (!navCollapse) return;
      if (window.innerWidth >= 992) {
        // Desktop: show menu, reset hamburger, remove blur
        navCollapse.classList.add('show');
        document.body.classList.remove('menu-open');
        if (toggler) toggler.setAttribute('aria-expanded', 'false');
      } else {
        // Mobile: hide menu, reset hamburger, remove blur
        navCollapse.classList.remove('show');
        document.body.classList.remove('menu-open');
        if (toggler) toggler.setAttribute('aria-expanded', 'false');
        // Only hide if currently open
        if (navCollapse.classList.contains('show')) {
          var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
          bsCollapse.hide();
        }
      }
    }

    updateNavCollapse();
    window.addEventListener('resize', updateNavCollapse);

    // Animate hamburger icon to X when menu is open/closed
    const toggler = document.querySelector('.custom-hamburger');
    const collapse = document.getElementById('mainNavCollapse');
    if (toggler && collapse) {
      collapse.addEventListener('show.bs.collapse', function() {
        toggler.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      });
      collapse.addEventListener('hide.bs.collapse', function() {
        toggler.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    }

    // Smoothly close navbar on mobile when clicking a nav-link
    document.addEventListener('DOMContentLoaded', function() {
      var navCollapse = document.getElementById('mainNavCollapse');
      if (!navCollapse) return;
      var navLinks = navCollapse.querySelectorAll('.nav-link');
      navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          // Animate press
          link.classList.add('nav-link-pressed');
          setTimeout(function() {
            link.classList.remove('nav-link-pressed');
          }, 320);

          if (window.innerWidth < 992) {
            var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
            setTimeout(function() {
              bsCollapse.hide();
              document.body.classList.remove('menu-open'); // Ensure scroll is restored
            }, 80);
          }
        });
      });
    });

    // Hide nav on scroll down, show on scroll up, and close menu if open
    (function () {
      const nav = document.getElementById("mainNav");
      const navCollapse = document.getElementById('mainNavCollapse');
      if (!nav) return;
      let lastScrollTop = 0;
      const THRESHOLD = 8;
      const TOP_LOCK = 60;
      window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll < TOP_LOCK) {
          nav.style.transform = "translateY(0)";
          lastScrollTop = currentScroll;
          return;
        }
        if (currentScroll > lastScrollTop + THRESHOLD) {
          nav.style.transform = "translateY(-100%)";
          // Close menu if open
          if (
            navCollapse &&
            navCollapse.classList.contains('show') &&
            window.innerWidth < 992
          ) {
            var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
            bsCollapse.hide();
          }
        } else if (currentScroll < lastScrollTop - THRESHOLD) {
          nav.style.transform = "translateY(0)";
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      }, { passive: true });
    })();

    // Use Bootstrap collapse events to toggle menu-open class on body
    const navCollapse = document.getElementById('mainNavCollapse');
    if (navCollapse) {
      navCollapse.addEventListener('show.bs.collapse', function () {
        document.body.classList.add('menu-open');
      });
      navCollapse.addEventListener('hide.bs.collapse', function () {
        document.body.classList.remove('menu-open');
      });
    }

    // Remove menu-open if navbar is removed (edge case)
    document.addEventListener('DOMContentLoaded', function() {
      const observer = new MutationObserver(function() {
        if (!document.getElementById('mainNav')) {
          document.body.classList.remove('menu-open');
        }
      });
      observer.observe(document.body, { childList: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbar);
  } else {
    injectNavbar();
  }
})();
