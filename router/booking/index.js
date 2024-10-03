import express from "express";

let router = express.Router();

router.get("/", (req, res) => {
  return res.send({
    message: "Hello, World!",
    desc: "This is a testing route for dev",
  });
});

export default router;
