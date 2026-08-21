document.addEventListener("DOMContentLoaded", function () {
  function getCurrentPageKey() {
    var path = window.location.pathname.toLowerCase();
    var file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    if (file === "" || file === "/") file = "index.html";

    if (file.indexOf("about") !== -1) return "about";
    if (file.indexOf("products") !== -1) return "products";
    if (file.indexOf("gallery") !== -1) return "gallery";
    if (file.indexOf("contact") !== -1) return "contact";
    return "home";
  }

  function createSharedNavbar(activeKey) {
    var isActive = function (key) {
      return activeKey === key ? " active" : "";
    };

    return (
      '<nav id="siteNavbar" class="navbar navbar-expand-lg fixed-top navbar-dark glass-nav premium-transparent-nav nav-unified">' +
      '  <div class="container-fluid px-3 px-lg-5 nav-shell">' +
      '    <button class="navbar-toggler order-1" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">' +
      '      <span class="navbar-toggler-icon"></span>' +
      "    </button>" +
      '    <a class="navbar-brand nav-center-brand d-flex align-items-center gap-3 order-2" href="index.html">' +
      '      <img src="assets/tattava_logo.png" alt="Tattva Exim Global logo" class="brand-mark">' +
      "    </a>" +
      '    <div class="collapse navbar-collapse order-3" id="mainNav">' +
      '      <div class="nav-desktop-grid w-100">' +
      '        <ul class="navbar-nav nav-left-links mb-2 mb-lg-0 align-items-lg-center">' +
      '          <li class="nav-item"><a class="nav-link' + isActive("home") + '" href="index.html">Home</a></li>' +
      '          <li class="nav-item"><a class="nav-link' + isActive("about") + '" href="about.html">About</a></li>' +
      '          <li class="nav-item"><a class="nav-link' + isActive("products") + '" href="products.html">Products</a></li>' +
      "        </ul>" +
      '        <ul class="navbar-nav nav-right-links mb-2 mb-lg-0 align-items-lg-center">' +
      '          <li class="nav-item"><a class="nav-link' + isActive("gallery") + '" href="gallery.html">Gallery</a></li>' +
      '          <li class="nav-item"><a class="nav-link' + isActive("contact") + '" href="contact.html">Contact</a></li>' +
      '          <li class="nav-item">' +
      '            <button class="btn btn-outline-light btn-luxury nav-quote-btn" type="button" data-bs-toggle="modal" data-bs-target="#quoteModal">Get a Quote</button>' +
      "          </li>" +
      "        </ul>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</nav>"
    );
  }

  function injectSharedNavbar() {
    var header = document.getElementById("siteHeader");
    if (!header) return document.getElementById("siteNavbar");

    header.innerHTML = createSharedNavbar(getCurrentPageKey());
    return document.getElementById("siteNavbar");
  }

  function lockNavbarMetrics() {
    if (!navbar) return;
    var shell = navbar.querySelector(".nav-shell");
    var brand = navbar.querySelector(".nav-center-brand");
    var logo = navbar.querySelector(".brand-mark");
    var links = navbar.querySelectorAll(".nav-left-links .nav-link, .nav-right-links .nav-link");
    var quoteBtn = navbar.querySelector(".nav-quote-btn");
    var isMobile = window.innerWidth < 992;

    if (isMobile) {
      navbar.style.minHeight = "68px";
      navbar.style.height = "auto";
      if (shell) {
        shell.style.minHeight = "68px";
        shell.style.height = "auto";
      }
      if (brand) {
        brand.style.minHeight = "54px";
        brand.style.height = "54px";
      }
      if (logo) {
        logo.style.width = "54px";
        logo.style.height = "54px";
      }
      links.forEach(function (link) {
        link.style.fontSize = "0.96rem";
        link.style.lineHeight = "1.1";
      });
      return;
    }

    navbar.style.minHeight = "78px";
    navbar.style.height = "78px";
    if (shell) {
      shell.style.minHeight = "78px";
      shell.style.height = "78px";
      shell.style.paddingTop = "0";
      shell.style.paddingBottom = "0";
    }
    if (brand) {
      brand.style.minHeight = "62px";
      brand.style.height = "62px";
    }
    if (logo) {
      logo.style.width = "62px";
      logo.style.height = "62px";
    }
    links.forEach(function (link) {
      link.style.fontSize = "0.96rem";
      link.style.lineHeight = "1";
      link.style.paddingTop = "0";
      link.style.paddingBottom = "0";
    });
    if (quoteBtn) {
      quoteBtn.style.height = "42px";
    }
  }

  var pageLoader = document.getElementById("pageLoader");
  var navbar = injectSharedNavbar();
  lockNavbarMetrics();
  var revealElements = document.querySelectorAll(".reveal");
  var parallaxElements = document.querySelectorAll("[data-parallax]");
  var counterElements = document.querySelectorAll(".counter");

  function showPageLoader() {
    if (!pageLoader) return;
    pageLoader.classList.add("is-active");
  }

  function hidePageLoader() {
    if (!pageLoader) return;
    pageLoader.classList.remove("is-active");
  }

  function shouldHandleLink(link) {
    if (!link) return false;
    if (link.target && link.target.toLowerCase() === "_blank") return false;
    if (link.hasAttribute("download")) return false;

    var rawHref = link.getAttribute("href") || "";
    if (!rawHref || rawHref === "#") return false;
    if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:") || rawHref.startsWith("javascript:")) return false;
    if (rawHref.startsWith("#")) return false;

    try {
      var targetUrl = new URL(link.href, window.location.href);
      var sameOrigin = targetUrl.origin === window.location.origin;
      if (!sameOrigin) return false;

      var currentWithoutHash = window.location.origin + window.location.pathname + window.location.search;
      var targetWithoutHash = targetUrl.origin + targetUrl.pathname + targetUrl.search;
      if (currentWithoutHash === targetWithoutHash && targetUrl.hash) return false;
    } catch (error) {
      return false;
    }

    return true;
  }

  document.addEventListener(
    "click",
    function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest("a[href]");
      if (!shouldHandleLink(link)) return;

      event.preventDefault();
      showPageLoader();
      window.setTimeout(function () {
        window.location.href = link.href;
      }, 60);
    },
    true
  );

  document.addEventListener(
    "submit",
    function (event) {
      if (event.defaultPrevented) return;
      showPageLoader();
    },
    true
  );

  hidePageLoader();

  window.addEventListener("pageshow", function () {
    hidePageLoader();
  });

  window.addEventListener("load", function () {
    hidePageLoader();
  });

  document.addEventListener("DOMContentLoaded", function () {
    hidePageLoader();
  });

  if (window.AOS) {
    window.AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 90
    });
  }

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  function handleParallax() {
    if (window.innerWidth < 992) return;
    parallaxElements.forEach(function (element) {
      var offset = window.scrollY * 0.18;
      element.style.backgroundPosition = "center calc(50% + " + offset + "px)";
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (element) {
    observer.observe(element);
  });

  function animateCounter(element) {
    var target = parseInt(element.getAttribute("data-target"), 10);
    var duration = 1500;
    var startTime = null;

    function updateCounter(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target);
      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  if (counterElements.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counterElements.forEach(function (element) {
      counterObserver.observe(element);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  handleNavbarScroll();
  handleParallax();
  window.addEventListener("resize", lockNavbarMetrics);
  window.addEventListener("scroll", handleNavbarScroll);
  window.addEventListener("scroll", handleParallax);
});
