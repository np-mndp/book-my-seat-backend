import express from "express";
import { Booking, Tables } from "../../configs/dbConfig.js";
import { authenticate } from "../../middleware/auth.js";

let router = express.Router({ mergeParams: true });

router.get("/", authenticate, (req, res) => {
  let userId = req.user.id;
  let bookings = Booking.findAll({
    where: {
      UserId: userId,
    },
  });
  return res.json(bookings);
});

router.post("/", authenticate, async (req, res) => {
  try {
    let booking = req.body;
    booking.customer = JSON.parse(booking.customer);
    booking.specialAccomodations = JSON.parse(specialAccomodations);

    let bookingData = await Booking.create(booking);

    res.status(201).json(bookingData);
  } catch (error) {
    console.error("Error booking restaurant", error);
    res.status(400).json({ message: "Failed to create booking data" });
  }
});

export default router;
