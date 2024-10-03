import express from "express";
import bookingRouter from "./booking/index.js"
import userRouter from "./user/index.js"
import { authenticate } from "../middleware/auth.js";

let router = express.Router()

router.use("/booking",bookingRouter )
router.use("/user", userRouter)
router.get("/", authenticate, (req, res) =>{
    return res.send({
        message: "checking auth",
        user: req.user
    })
})


export default router;