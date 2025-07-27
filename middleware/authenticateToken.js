const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Token missing user ID" });
    }

    req.user = { _id: userId };
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = authenticateToken;
