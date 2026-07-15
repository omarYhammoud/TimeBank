import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const protect = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export const checkBookingOwnership = async (req, res, next) => {
  try {
    const { id } = req.params; // Make sure this matches your route :id
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const userId = req.user._id.toString();
    const isProvider = booking.providerId.toString() === userId;
    const isRequester = booking.requesterId.toString() === userId;

    if (!isProvider && !isRequester) {
      return res.status(403).json({ message: "Access denied: Not authorized" });
    }

    req.booking = booking;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authorization" });
  }
};