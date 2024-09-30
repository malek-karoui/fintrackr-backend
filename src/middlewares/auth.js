const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../secrets");

const allowedPaths = ["/users/login", "/users/refresh"];

module.exports = (req, res, next) => {
  if (allowedPaths.includes(req.path)) {
    return next();
  }
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }
  try {
    const { id } = jwt.verify(token, jwtSecret);
    req.userId = id;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};
