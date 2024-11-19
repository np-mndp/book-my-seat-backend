// const { verifyToken } = require('../utils/jwtUtils');
// const { User } = require('../models');
// import {verifyToken} from "../utils/jwtUtils.js"
import { verifyToken } from "../utils/jwtUtils.js";
import {User} from "../configs/dbConfig.js";

export let authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
