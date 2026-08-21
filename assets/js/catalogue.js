(function () {
  function waLink(product) {
    var text =
      "Hello Tattva Exim Global, I am interested in " +
      product.name +
      (product.sku ? " (SKU: " + product.sku + ")" : "") +
      " from the " +
      product.category +
      " catalogue. Please share sample/bulk details.";
    return "https://wa.me/918261016765?text=" + encodeURIComponent(text);
  }

  function esc(value) {
    if (value == null || value === "") return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function specItems(product) {
    var rows = [];
    if (product.sku) rows.push(["SKU", product.sku]);
    if (product.material) rows.push(["Material", product.material]);
    if (product.size) rows.push(["Size", product.size]);
    if (product.design) rows.push(["Design", product.design]);
    if (product.colors) rows.push(["Colors", product.colors]);
    if (product.hsCode) rows.push(["HS Code", product.hsCode]);
    if (product.bulkMOQ) rows.push(["Bulk MOQ", product.bulkMOQ]);
    if (product.leadTime) rows.push(["Lead Time", product.leadTime]);
    return rows;
  }

  function fillDetailModal(product) {
    var media = document.getElementById("productDetailMedia");
    var copy = document.getElementById("productDetailCopy");
    if (!media || !copy) return;

    media.innerHTML =
      '<img src="' + esc(product.image) + '" alt="' + esc(product.name) + '">';

    var specs = specItems(product)
      .map(function (row) {
        return "<li><strong>" + esc(row[0]) + ":</strong> " + esc(row[1]) + "</li>";
      })
      .join("");

    var notes = [];
    if (product.samplePrice) {
      notes.push("<li><strong>Sample Price:</strong> " + esc(product.samplePrice) + "</li>");
    }
    if (product.bulkPrice) {
      notes.push("<li><strong>Bulk Price:</strong> " + esc(product.bulkPrice) + "</li>");
    }

    copy.innerHTML =
      '<p class="catalogue-kicker">' +
      esc(product.category) +
      "</p>" +
      "<h2>" +
      esc(product.name) +
      "</h2>" +
      (product.section ? "<p>" + esc(product.section) + "</p>" : "") +
      '<div class="catalogue-prices mb-3">' +
      '<div class="catalogue-price-box"><span>Sample Price</span><strong>' +
      esc(product.samplePriceShort || product.samplePrice || "On enquiry") +
      "</strong></div>" +
      '<div class="catalogue-price-box"><span>Bulk Price</span><strong>' +
      esc(product.bulkPriceShort || product.bulkPrice || "On enquiry") +
      "</strong></div>" +
      "</div>" +
      '<ul class="detail-list">' +
      specs +
      notes.join("") +
      "</ul>" +
      (product.priceNote ? '<p class="product-detail-note">' + esc(product.priceNote) + "</p>" : "") +
      (product.sampleMOQNote
        ? '<p class="product-detail-note">' + esc(product.sampleMOQNote) + "</p>"
        : "") +
      '<div class="catalogue-actions">' +
      '<a class="btn btn-gold btn-luxury" href="' +
      waLink(product) +
      '" target="_blank" rel="noopener">Enquire For Sample</a>' +
      '<a class="btn btn-outline-dark btn-luxury" href="contact.html">Bulk Enquiry</a>' +
      (product.cataloguePage
        ? '<a class="btn btn-outline-dark btn-luxury" href="' +
          esc(product.cataloguePage) +
          '" target="_blank" rel="noopener">View Catalogue Page</a>'
        : "") +
      "</div>";
  }

  function init() {
    var grid = document.getElementById("catalogueGrid");
    var toolbar = document.getElementById("catalogueToolbar");
    var countEl = document.getElementById("catalogueCount");
    if (!grid) return;

    var data = window.CATALOGUE_DATA || { products: [] };
    var byId = {};
    (data.products || []).forEach(function (p) {
      byId[p.id] = p;
    });

    var cards = grid.querySelectorAll(".catalogue-card");
    var total = cards.length;

    function paint(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === "All" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
        if (match) shown += 1;
      });
      if (countEl) {
        countEl.textContent = "Showing " + shown + " of " + total + " catalogue products";
      }
    }

    if (toolbar) {
      toolbar.addEventListener("click", function (event) {
        var btn = event.target.closest(".catalogue-filter-btn");
        if (!btn) return;
        toolbar.querySelectorAll(".catalogue-filter-btn").forEach(function (el) {
          el.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        paint(btn.getAttribute("data-filter") || "All");
      });
    }

    grid.addEventListener("click", function (event) {
      var btn = event.target.closest(".catalogue-detail-btn");
      if (!btn) return;
      var product = byId[btn.getAttribute("data-id")];
      if (!product) return;
      fillDetailModal(product);
      var modalEl = document.getElementById("productDetailModal");
      if (modalEl && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    });

    if (total === 0 && data.products && data.products.length) {
      grid.innerHTML =
        '<p class="text-danger">Product cards failed to load. Please refresh the page.</p>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
