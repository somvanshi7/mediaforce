// public/js/app.js
// Client-side interactivity: counters, toasts, search, fade-in, quick-add

(function () {
  "use strict";

  // ======================== ANIMATED COUNTERS ========================
  function animateCounters() {
    document.querySelectorAll("[data-counter]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-counter"), 10);
      if (isNaN(target)) return;
      var duration = 1200;
      var start = 0;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ======================== TOAST SYSTEM ========================
  var toastContainer;
  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }
  }

  function showToast(message, type) {
    ensureToastContainer();
    var toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "success");
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  // check URL for toast triggers
  function checkToastParam() {
    var params = new URLSearchParams(window.location.search);
    var msg = params.get("toast");
    if (msg) {
      showToast(decodeURIComponent(msg), "success");
      // clean URL
      params.delete("toast");
      var newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      history.replaceState(null, "", newUrl);
    }
  }

  // ======================== FADE-IN OBSERVER ========================
  function initFadeIn() {
    var els = document.querySelectorAll(".fade-in");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { observer.observe(el); });
  }

  // ======================== CLIENT-SIDE INSTANT SEARCH ========================
  function initInstantSearch() {
    var searchInput = document.getElementById("instantSearch");
    if (!searchInput) return;
    var tickets = Array.from(document.querySelectorAll("[data-search-title]"));
    var catHeaders = Array.from(document.querySelectorAll("[data-cat-section]"));
    var resultCountEl = document.getElementById("resultCount");

    searchInput.addEventListener("input", function () {
      var query = searchInput.value.toLowerCase().trim();
      var visibleCount = 0;

      tickets.forEach(function (ticket) {
        var title = ticket.getAttribute("data-search-title").toLowerCase();
        var notes = (ticket.getAttribute("data-search-notes") || "").toLowerCase();
        var sub = (ticket.getAttribute("data-search-sub") || "").toLowerCase();
        var match = !query || title.includes(query) || notes.includes(query) || sub.includes(query);
        ticket.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });

      // show/hide category headers based on visible children
      catHeaders.forEach(function (section) {
        var cat = section.getAttribute("data-cat-section");
        var grid = section.querySelector(".ticket-grid");
        if (!grid) return;
        var anyVisible = Array.from(grid.children).some(function (c) {
          return c.style.display !== "none";
        });
        section.style.display = anyVisible ? "" : "none";
      });

      if (resultCountEl) {
        resultCountEl.textContent = visibleCount + " title" + (visibleCount === 1 ? "" : "s") + " found";
      }
    });
  }

  // ======================== SORT TOGGLE ========================
  function initSort() {
    var sortBtns = document.querySelectorAll("[data-sort]");
    if (!sortBtns.length) return;

    sortBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-sort");
        sortBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        document.querySelectorAll(".ticket-grid").forEach(function (grid) {
          var items = Array.from(grid.children);
          items.sort(function (a, b) {
            var titleA = (a.getAttribute("data-search-title") || "").toLowerCase();
            var titleB = (b.getAttribute("data-search-title") || "").toLowerCase();
            var dateA = a.getAttribute("data-date") || "";
            var dateB = b.getAttribute("data-date") || "";

            if (mode === "az") return titleA.localeCompare(titleB);
            if (mode === "za") return titleB.localeCompare(titleA);
            if (mode === "newest") return dateB.localeCompare(dateA);
            return 0;
          });
          items.forEach(function (item) { grid.appendChild(item); });
        });
      });
    });
  }

  // ======================== QUICK-ADD MODAL ========================
  function initQuickAdd() {
    var fab = document.getElementById("fab");
    var overlay = document.getElementById("quickAddOverlay");
    if (!fab || !overlay) return;

    var closeBtn = overlay.querySelector(".modal-cancel");
    var form = overlay.querySelector("form");

    fab.addEventListener("click", function () {
      overlay.classList.add("open");
      var titleInput = overlay.querySelector('input[name="title"]');
      if (titleInput) titleInput.focus();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        overlay.classList.remove("open");
      });
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("open");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) {
        overlay.classList.remove("open");
      }
    });
  }

  // ======================== TIME-AGO ========================
  function initTimeAgo() {
    document.querySelectorAll("[data-date-added]").forEach(function (el) {
      var dateStr = el.getAttribute("data-date-added");
      if (!dateStr) return;
      var added = new Date(dateStr);
      var now = new Date();
      var diffDays = Math.floor((now - added) / (1000 * 60 * 60 * 24));
      var text;
      if (diffDays === 0) text = "added today";
      else if (diffDays === 1) text = "added yesterday";
      else if (diffDays < 7) text = "added " + diffDays + " days ago";
      else if (diffDays < 30) text = "added " + Math.floor(diffDays / 7) + "w ago";
      else if (diffDays < 365) text = "added " + Math.floor(diffDays / 30) + "mo ago";
      else text = "added " + Math.floor(diffDays / 365) + "y ago";
      el.textContent = text;
    });
  }

  // ======================== INIT ========================
  document.addEventListener("DOMContentLoaded", function () {
    animateCounters();
    checkToastParam();
    initFadeIn();
    initInstantSearch();
    initSort();
    initQuickAdd();
    initTimeAgo();
  });
})();
