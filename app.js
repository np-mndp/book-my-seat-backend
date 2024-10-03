import express from "express";
import {sequelize} from "./configs/dbConfig.js";
import path from "path";
import bodyParser from "body-parser"
import "dotenv"
import router from "./router/router.js";

// const router = require("./routes/index.js");


const app = express();

// Setting up .env
const PORT = process.env.PORT || 3000;

// //View Engine Setup
// app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public",express.static("public"));

app.use(router)

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
      await sequelize.authenticate();;
      console.log('Database connection has been established successfully.');
      await sequelize.sync();;
      app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
      });
    } catch (error) {
      console.error('Unable to start the server:', error);
    }
  }
  
  startServer();





// app.use(router.routes());

// app.use(router);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://127.0.0.1:${PORT}`);
// });