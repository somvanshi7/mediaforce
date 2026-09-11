const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");

const collectionRoutes = require("./routes/collection");
const { authRequired, loginHandler, logoutHandler, PIN } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session (required for PIN auth; harmless when APP_PIN is not set)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mediaforce-local-dev-secret-" + Date.now(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Login / logout routes (public — before auth middleware)
app.get("/login", loginHandler);
app.post("/login", loginHandler);
app.get("/logout", logoutHandler);

// Auth gate — everything below this requires PIN (when APP_PIN is set)
app.use(authRequired);

// Make auth state and common data available to all views
const db = require("./db");
app.use(function (req, res, next) {
  res.locals.isAuthenticated = !!(PIN && req.session && req.session.authenticated);
  // watchlist count + total for nav badge and footer
  var items = db.getAll();
  res.locals.watchlistCount = items.filter(function (i) { return i.status === "watchlist"; }).length;
  res.locals.totalCount = items.length;
  next();
});

app.use("/", collectionRoutes);

app.listen(PORT, function () {
  console.log("\n  Media Force is running.");
  console.log("  Open http://localhost:" + PORT + " in your browser.");
  if (PIN) {
    console.log("  PIN protection is ON.");
  } else {
    console.log("  No PIN set — running in open mode (set APP_PIN env var to enable).");
  }
  console.log("");
});
