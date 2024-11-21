import express from "express";
import { sequelize, User } from "../../src/configs/dbConfig.js";
import path from "path";
import bodyParser from "body-parser";
import "dotenv/config";
import router from "../../src/router/router.js";
import cors from "cors"
import serverless from "serverless-http";


// let router = require("./routes/index.js");

let app = express();


// Setting up .env
let PORT = process.env.PORT || 3000;

// //View Engine Setup
// app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
app.use(cors());
app.use("/public", express.static("public"));
app.get("/", (req, res, next) => {
  //   sequelize.drop();
  res.send({
    Base: process.env.BASE_URL,
    Port: process.env.PORT,
  });
});

app.use("/api", router);

// app.get("/", async(req, res, next) => {
//     try {
//         await Sequelize.sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
//       return res.status(200).send({
//         name: "Mandeep Neupane",
//         message: "Welcome to my API"
//       })
// })

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
}

startServer();

export const handler = serverless(app);

// app.use(router.routes());

// app.use(router);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://127.0.0.1:${PORT}`);
// });


// // YOUR_BASE_DIRECTORY/netlify/functions/api.ts

// import express, { Router } from "express";


// const api = express();

// const router = Router();
// router.get("/hello", (req, res) => res.send("Hello World!"));

// api.use("/api/", router);

// export const handler = serverless(api);
