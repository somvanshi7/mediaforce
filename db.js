// db.js
// This is the whole "database": one JSON file on your disk, read and
// rewritten on every change. That file — data/collection.json — IS your
// collection. Back it up by copying it, committing it to git, or using
// the Export button in the app. As long as that file exists, nothing is lost.

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "data", "collection.json");

function readAll() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  if (!raw.trim()) return [];
  return JSON.parse(raw);
}

function writeAll(items) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2), "utf-8");
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getAll() {
  return readAll();
}

function getById(id) {
  return readAll().find((item) => item.id === id);
}

function add(entry) {
  const items = readAll();
  const newItem = {
    id: makeId(),
    title: entry.title.trim(),
    category: entry.category.trim(),
    subcategory: (entry.subcategory || "").trim(),
    type: entry.type === "series" ? "series" : "movie",
    origin: ["Indian", "International", "Mixed"].includes(entry.origin) ? entry.origin : "International",
    status: entry.status === "watchlist" ? "watchlist" : "collection",
    notes: (entry.notes || "").trim(),
    dateAdded: new Date().toISOString().slice(0, 10),
  };
  items.push(newItem);
  writeAll(items);
  return newItem;
}

function update(id, changes) {
  const items = readAll();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  items[idx] = {
    ...items[idx],
    title: changes.title !== undefined ? changes.title.trim() : items[idx].title,
    category: changes.category !== undefined ? changes.category.trim() : items[idx].category,
    subcategory: changes.subcategory !== undefined ? changes.subcategory.trim() : items[idx].subcategory,
    type: changes.type !== undefined ? changes.type : items[idx].type,
    origin: changes.origin !== undefined ? changes.origin : items[idx].origin,
    status: changes.status !== undefined ? changes.status : items[idx].status,
    notes: changes.notes !== undefined ? changes.notes.trim() : items[idx].notes,
  };
  writeAll(items);
  return items[idx];
}

function remove(id) {
  const items = readAll();
  const filtered = items.filter((item) => item.id !== id);
  writeAll(filtered);
  return filtered.length !== items.length;
}

function getCategories() {
  const items = readAll();
  return [...new Set(items.map((i) => i.category))].sort();
}

module.exports = { getAll, getById, add, update, remove, getCategories, DATA_PATH };
