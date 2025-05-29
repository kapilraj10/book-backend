const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure JWT_SECRET is set
    req.user = decoded; // this should include user._id
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;