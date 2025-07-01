const jwt = require("jsonwebtoken");
const { uerRegistrationModel } = require("../Model/UserSchema");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;



const jsonWebTokenCreate = (user) => {
  if (!user?.email) {
    throw new Error("Invalid user object. Email is required for token generation.");
  }
  const payload = {
    email: user.email,
    _id: user._id,
  };
  // const token = jwt.sign(payload, secretKey, { expiresIn: "5h" });
  const token = jwt.sign(payload, secretKey);
  return token;
};

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });
  const token = req.headers.authorization.split(" ")[0];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secretKey);
    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};



const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await uerRegistrationModel.findOne({ email: decoded.email });
    if (!user || !user.is_login) {
      return res.status(401).json({ status: false, message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

module.exports = { jsonWebTokenCreate, jwtAuthMiddleware, verifyToken };
