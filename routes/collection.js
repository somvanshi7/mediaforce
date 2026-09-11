const express = require("express");
const router = express.Router();
const db = require("../db");
const { categoryIcon, typeIcon } = require("../utils/categoryIcons");

// ---------- Fun fact generator ----------
function generateFunFact(collection) {
  var facts = [];
  var movies = collection.filter(function (i) { return i.type === "movie"; });
  var series = collection.filter(function (i) { return i.type === "series"; });

  // category-based facts
  var categoryCounts = {};
  collection.forEach(function (i) {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });
  var topCat = Object.entries(categoryCounts).sort(function (a, b) { return b[1] - a[1]; })[0];
  if (topCat) {
    facts.push("Your biggest genre is <strong>" + topCat[0] + "</strong> with " + topCat[1] + " titles.");
  }

  // subcategory
  var subCounts = {};
  collection.forEach(function (i) {
    if (i.subcategory) subCounts[i.subcategory] = (subCounts[i.subcategory] || 0) + 1;
  });
  var topSub = Object.entries(subCounts).sort(function (a, b) { return b[1] - a[1]; })[0];
  if (topSub && topSub[1] > 2) {
    facts.push("You've logged <strong>" + topSub[1] + "</strong> " + topSub[0] + " titles — a true fan.");
  }

  if (movies.length > 0) {
    facts.push("That's <strong>" + movies.length + "</strong> movies — roughly " + Math.round(movies.length * 2) + " hours of cinema.");
  }
  if (series.length > 10) {
    facts.push("You've tracked <strong>" + series.length + "</strong> series — binge royalty.");
  }

  var indian = collection.filter(function (i) { return i.origin === "Indian"; });
  if (indian.length > 20) {
    facts.push("<strong>" + indian.length + "</strong> Indian titles in your collection — desi at heart.");
  }

  if (facts.length === 0) return null;
  return facts[Math.floor(Math.random() * facts.length)];
}

// ---------- Home / Dashboard ----------
router.get("/", function (req, res) {
  var items = db.getAll();
  var collection = items.filter(function (i) { return i.status === "collection"; });
  var watchlist = items.filter(function (i) { return i.status === "watchlist"; });

  var stats = {
    total: collection.length,
    movies: collection.filter(function (i) { return i.type === "movie"; }).length,
    series: collection.filter(function (i) { return i.type === "series"; }).length,
    indian: collection.filter(function (i) { return i.origin === "Indian"; }).length,
    international: collection.filter(function (i) { return i.origin !== "Indian"; }).length,
    watchlist: watchlist.length,
  };

  var categoryCounts = {};
  collection.forEach(function (i) {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });
  var categories = Object.entries(categoryCounts)
    .sort(function (a, b) { return b[1] - a[1]; })
    .map(function (entry) { return { name: entry[0], count: entry[1], icon: categoryIcon(entry[0]) }; });

  var recent = items.slice()
    .sort(function (a, b) { return a.dateAdded < b.dateAdded ? 1 : -1; })
    .slice(0, 8)
    .map(function (r) { return Object.assign({}, r, { icon: typeIcon(r.type) }); });

  var funFact = generateFunFact(collection);

  res.render("index", { stats: stats, categories: categories, recent: recent, funFact: funFact, page: "home" });
});

// ---------- Browse collection ----------
router.get("/browse", function (req, res) {
  var q = req.query.q || "";
  var category = req.query.category || "";
  var type = req.query.type || "";
  var origin = req.query.origin || "";
  var items = db.getAll().filter(function (i) { return i.status === "collection"; });

  if (q) {
    var needle = q.toLowerCase();
    items = items.filter(function (i) { return i.title.toLowerCase().includes(needle); });
  }
  if (category) items = items.filter(function (i) { return i.category === category; });
  if (type) items = items.filter(function (i) { return i.type === type; });
  if (origin) items = items.filter(function (i) { return i.origin === origin; });

  // group by category for the accordion view
  var grouped = {};
  items.forEach(function (i) {
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(Object.assign({}, i, { typeIconKey: typeIcon(i.type) }));
  });
  Object.values(grouped).forEach(function (list) {
    list.sort(function (a, b) { return a.title.localeCompare(b.title); });
  });

  var allCategories = db.getCategories();
  var categoryIcons = {};
  allCategories.forEach(function (c) { categoryIcons[c] = categoryIcon(c); });

  res.render("browse", {
    grouped: grouped,
    allCategories: allCategories,
    categoryIcons: categoryIcons,
    filters: { q: q, category: category, type: type, origin: origin },
    resultCount: items.length,
    page: "browse",
  });
});

// ---------- Watchlist ----------
router.get("/watchlist", function (req, res) {
  var items = db
    .getAll()
    .filter(function (i) { return i.status === "watchlist"; })
    .sort(function (a, b) { return a.dateAdded < b.dateAdded ? 1 : -1; })
    .map(function (i) { return Object.assign({}, i, { typeIconKey: typeIcon(i.type) }); });
  res.render("watchlist", { items: items, page: "watchlist" });
});

router.post("/watchlist/:id/watched", function (req, res) {
  db.update(req.params.id, { status: "collection" });
  res.redirect("/watchlist?toast=" + encodeURIComponent("Moved to collection!"));
});

// ---------- Add ----------
router.get("/add", function (req, res) {
  var status = req.query.for === "watchlist" ? "watchlist" : "collection";
  res.render("add", {
    categories: db.getCategories(),
    defaultStatus: status,
    page: "add",
  });
});

router.post("/add", function (req, res) {
  var title = req.body.title;
  var category = req.body.category;
  var subcategory = req.body.subcategory;
  var type = req.body.type;
  var origin = req.body.origin;
  var status = req.body.status;
  var notes = req.body.notes;

  if (!title || !title.trim() || !category || !category.trim()) {
    return res.redirect("/add");
  }
  db.add({ title: title, category: category, subcategory: subcategory, type: type, origin: origin, status: status, notes: notes });
  var dest = status === "watchlist" ? "/watchlist" : "/browse";
  res.redirect(dest + "?toast=" + encodeURIComponent('"' + title.trim() + '" added!'));
});

// ---------- Edit ----------
router.get("/edit/:id", function (req, res) {
  var item = db.getById(req.params.id);
  if (!item) return res.redirect("/browse");
  res.render("edit", { item: item, categories: db.getCategories(), page: "edit" });
});

router.post("/edit/:id", function (req, res) {
  var title = req.body.title;
  var category = req.body.category;
  var subcategory = req.body.subcategory;
  var type = req.body.type;
  var origin = req.body.origin;
  var status = req.body.status;
  var notes = req.body.notes;

  db.update(req.params.id, { title: title, category: category, subcategory: subcategory, type: type, origin: origin, status: status, notes: notes });
  var backTo = status === "watchlist" ? "/watchlist" : "/browse";
  res.redirect(backTo + "?toast=" + encodeURIComponent("Changes saved!"));
});

router.post("/delete/:id", function (req, res) {
  db.remove(req.params.id);
  var backTo = req.body.from === "watchlist" ? "/watchlist" : "/browse";
  res.redirect(backTo + "?toast=" + encodeURIComponent("Title removed."));
});

// ---------- Export (backup) ----------
router.get("/export", function (req, res) {
  var items = db.getAll();
  var date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Disposition", 'attachment; filename="media-force-backup-' + date + '.json"');
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(items, null, 2));
});

module.exports = router;
