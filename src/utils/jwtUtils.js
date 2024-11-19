import jwt from "jsonwebtoken";
// import { jwt } from "jsonwebtoken";
// import pkg from "jsonwebtoken";
// const { jwt } = require("jsonwebtoken");

export let generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "WIP_GROUP05_BOOK_MY_SEAT_MOBILE_APP",
    {
      expiresIn: process.env.JWT_EXPIRATION || "60d",
    }
  );
};

export let verifyToken = (token) => {
  try {
    return jwt.verify(token, (process.env.JWT_SECRET || "WIP_GROUP05_BOOK_MY_SEAT_MOBILE_APP"));
  } catch (error) {
    return null;
  }
};

// export default {generateToken, verifyToken}
