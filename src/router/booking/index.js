import express from "express";
import { Booking, Restaurant, Tables, User } from "../../configs/dbConfig.js";
import { authenticate, isAuthenticated } from "../../middleware/auth.js";
import { Op, where } from "sequelize";

let router = express.Router({ mergeParams: true });

router.get("/", authenticate, async (req, res) => {
  let pastBookings, bookings, lastMonthCount, totalCount;
  const monthAgo = new Date().setMonth(new Date().getMonth() - 1);
  try {
    if (req.user?.isManager) {
      bookings = await Booking.findAll({
        include: {
          model: Restaurant,
          attributes: ["title", "images"],
          required: true,
          include: {
            model: User,
            attributes: ["name"],
            required: true,
            where: {
              id: req.user.id,
            },
          },
        },
        where: {
          loadIn: { [Op.gt]: Date.now() },
        },
      });

      pastBookings = await Booking.findAll({
        include: {
          model: Restaurant,
          attributes: ["title", "images"],
          required: true,
          include: {
            model: User,
            attributes: ["name"],
            required: true,
            where: {
              id: req.user.id,
            },
          },
        },
        where: {
          loadIn: { [Op.lt]: Date.now() },
        },
      });

      // bookings.forEach((booking) => {
      //   if (booking.Restaurant) {
      //     booking.Restaurant.images = `${process.env.BASE_URL}/public/${booking.Restaurant.images[0]}`;
      //   }
      // });

      // console.log(bookings);
    } else {
      let userId = req.user.id;
      pastBookings = await Booking.findAll({
        where: {
          UserId: userId,
          loadIn: { [Op.lt]: Date.now() },
        },
        include: [
          {
            model: Restaurant,
            // as: 'restaurant',
            attributes: ["id", "title", "location", "images"],
          },
        ],
      });
      bookings = await Booking.findAll({
        where: {
          UserId: userId,
          loadIn: { [Op.gt]: Date.now() },
        },
        include: [
          {
            model: Restaurant,
            // as: 'restaurant',
            attributes: ["id", "title", "location", "images"],
          },
        ],
      });
    }

    const totalCount = pastBookings.length + bookings.length;
    return res.json({ bookings, pastBookings, totalCount });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    let booking = req.body;
    console.log(booking);

    // booking.customer = JSON.parse(booking.customer);
    booking.specialAccomodations = {};
    booking.UserId = req.user.id;

    let optimalTable = await Tables.findOne({
      group: ["id"],
      having: {
        seats: {
          [Op.gte]: booking.guests,
        },
      },
      order: [["seats", "ASC"]],
    });

    console.log(optimalTable);

    booking.TableId = optimalTable.id;

    // let prebookedCount = Booking.count({
    //   where: {
    //     TableId: optimalTable.id,

    // })

    console.log(`Booking:  ${JSON.stringify(booking)}`);

    let bookingData = await Booking.create(booking);

    res.status(201).json(bookingData);
  } catch (error) {
    console.error("Error booking restaurant", error);
    res.status(400).json({ message: "Failed to create booking data" });
  }
});

export default router;
