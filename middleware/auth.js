// middleware/auth.js
// Simple PIN-based authentication middleware.
// When APP_PIN is set in the environment, all routes require a valid session.
// When APP_PIN is NOT set (local dev), auth is skipped entirely.

const PIN = process.env.APP_PIN;

function authRequired(req, res, next) {
  // No PIN configured → no auth at all (local dev mode)
  if (!PIN) return next();

  // Login-related routes are always public
  if (req.path === "/login") return next();

  // Check session
  if (req.session && req.session.authenticated) return next();

  // Not authenticated → redirect to login
  return res.redirect("/login");
}

function loginHandler(req, res) {
  if (!PIN) return res.redirect("/");

  if (req.method === "POST") {
    const entered = (req.body.pin || "").trim();
    if (entered === PIN) {
      req.session.authenticated = true;
      return res.redirect("/");
    }
    return res.render("login", { error: "Wrong PIN — try again.", page: "login" });
  }

  // GET
  if (req.session && req.session.authenticated) return res.redirect("/");
  res.render("login", { error: null, page: "login" });
}

function logoutHandler(req, res) {
  req.session.destroy(function () {
    res.redirect("/login");
  });
}

module.exports = { authRequired, loginHandler, logoutHandler, PIN };
