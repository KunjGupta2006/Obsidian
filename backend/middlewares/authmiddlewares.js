export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admins only" });
}

export function isAuthenticated(req, res, next) {
    // console.log(req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
