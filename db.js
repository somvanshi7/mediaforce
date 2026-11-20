// db.js
// Handles storage for Media Force.
// When MONGODB_URI is provided, data is permanently persisted in MongoDB Atlas.
// When MONGODB_URI is missing or offline, it seamlessly falls back to data/collection.json.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const DATA_PATH = path.join(__dirname, "data", "collection.json");

let client = null;
let collection = null;
let isConnected = false;

function readLocalAll() {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  if (!raw.trim()) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("  [DB] Error parsing collection.json:", err.message);
    return [];
  }
}

function writeLocalAll(items) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("  [DB] Failed to write local backup:", err.message);
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function init() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("  [DB] No MONGODB_URI configured. Running in local file mode (data/collection.json).");
    return;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    const dbName = process.env.MONGODB_DB_NAME || "mediaforce";
    const db = client.db(dbName);
    collection = db.collection("titles");

    // Ensure index on custom id for fast lookups
    await collection.createIndex({ id: 1 }, { unique: true });
    isConnected = true;
    console.log("  [DB] Connected to MongoDB Atlas (" + dbName + ".titles)");

    // Auto-seed if database is empty
    const count = await collection.countDocuments();
    if (count === 0) {
      const localData = readLocalAll();
      if (localData.length > 0) {
        await collection.insertMany(localData);
        console.log("  [DB] Auto-seeded " + localData.length + " titles into MongoDB from collection.json.");
      }
    } else {
      console.log("  [DB] Ready: " + count + " titles loaded from MongoDB.");
    }
  } catch (err) {
    console.error("  [DB] Failed to connect to MongoDB Atlas:", err.message);
    console.log("  [DB] Falling back to local file storage (data/collection.json).");
    isConnected = false;
  }
}

async function getAll() {
  if (isConnected && collection) {
    return await collection.find({}, { projection: { _id: 0 } }).toArray();
  }
  return readLocalAll();
}

async function getById(id) {
  if (isConnected && collection) {
    return await collection.findOne({ id: id }, { projection: { _id: 0 } });
  }
  return readLocalAll().find((item) => item.id === id);
}

async function add(entry) {
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

  if (isConnected && collection) {
    await collection.insertOne({ ...newItem });
    // Keep local file in sync as an offline backup
    const items = readLocalAll();
    items.push(newItem);
    writeLocalAll(items);
  } else {
    const items = readLocalAll();
    items.push(newItem);
    writeLocalAll(items);
  }

  return newItem;
}

async function update(id, changes) {
  const existing = await getById(id);
  if (!existing) return null;

  const updatedItem = {
    ...existing,
    title: changes.title !== undefined ? changes.title.trim() : existing.title,
    category: changes.category !== undefined ? changes.category.trim() : existing.category,
    subcategory: changes.subcategory !== undefined ? changes.subcategory.trim() : existing.subcategory,
    type: changes.type !== undefined ? changes.type : existing.type,
    origin: changes.origin !== undefined ? changes.origin : existing.origin,
    status: changes.status !== undefined ? changes.status : existing.status,
    notes: changes.notes !== undefined ? changes.notes.trim() : existing.notes,
  };

  if (isConnected && collection) {
    await collection.updateOne({ id: id }, { $set: updatedItem });
    // Keep local file in sync
    const items = readLocalAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = updatedItem;
      writeLocalAll(items);
    }
  } else {
    const items = readLocalAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = updatedItem;
      writeLocalAll(items);
    }
  }

  return updatedItem;
}

async function remove(id) {
  let removed = false;
  if (isConnected && collection) {
    const res = await collection.deleteOne({ id: id });
    removed = res.deletedCount > 0;
    // Keep local file in sync
    const items = readLocalAll();
    const filtered = items.filter((i) => i.id !== id);
    writeLocalAll(filtered);
  } else {
    const items = readLocalAll();
    const filtered = items.filter((i) => i.id !== id);
    writeLocalAll(filtered);
    removed = filtered.length !== items.length;
  }
  return removed;
}

async function getCategories() {
  if (isConnected && collection) {
    const cats = await collection.distinct("category");
    return cats.filter(Boolean).sort();
  }
  const items = readLocalAll();
  return [...new Set(items.map((i) => i.category))].sort();
}

async function close() {
  if (client) {
    await client.close();
    isConnected = false;
  }
}

module.exports = {
  init,
  close,
  getAll,
  getById,
  add,
  update,
  remove,
  getCategories,
  DATA_PATH,
};
