const jwt = require('jsonwebtoken');

const JWT_SECRET = "bookStore123";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log("No Authorization header in request");
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token received:", token);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;  
    next();
  });
}

module.exports = { authenticateToken };
