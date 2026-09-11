// utils/categoryIcons.js
// Maps each category to a small hand-drawn icon key (see views/partials/icon.ejs).
// Falls back to "star" for any custom category you add later that isn't in this list.

const CATEGORY_ICON_MAP = {
  "SuperHero": "shield-bolt",
  "Classics": "star",
  "Sci-Fi / Fantasy / Mystery / Thrillers": "rocket",
  "Applied Sciences / Life / Philosophy": "bulb",
  "War / Battle / War Areas": "helmet",
  "Adventure / Survival / Animals": "compass",
  "Romance / Drama / Musical": "heart",
  "Stressful / Melodrama": "raincloud",
  "Sports": "trophy",
  "Comedy": "mask",
  "Action / Suspense / Mystery / Thrillers": "crosshair",
  "Horror": "ghost",
  "Miniseries": "hourglass",
  "Western / Drama / Action / Crime / Thriller": "badge-star",
  "Sci-Fi / Cyber": "chip",
  "Fantasy / War / SuperHero / Sports / Zombies": "sword-shield",
  "Anime": "torii",
  "Korean Drama / Thriller": "blossom",
  "Indian Web Series": "lotus",
};

function categoryIcon(category) {
  return CATEGORY_ICON_MAP[category] || "star";
}

function typeIcon(type) {
  return type === "series" ? "tv" : "reel";
}

module.exports = { categoryIcon, typeIcon, CATEGORY_ICON_MAP };
