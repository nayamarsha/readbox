const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET; // Move this inside the function

  const authHeader = req.headers.authorization;           
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Token tidak valid" });
    }
    req.user = decoded;
    next();
  });
};