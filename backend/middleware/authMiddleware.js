import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authorization token",
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication is required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this resource`,
      });
    }

    next();
  };
};