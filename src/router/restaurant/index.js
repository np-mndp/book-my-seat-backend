import express from "express";
import { Restaurant, sequelize } from "../../configs/dbConfig.js"; // Assuming your database setup is in this file
import tablesRouter from "./tables/index.js";
import menuRouter from "./menu/index.js";

// let  = db;

const router = express.Router();

const haversineQuery = (latitude, longitude, radius) => `
  (6371 * acos(
    cos(radians(${latitude})) * 
    cos(radians((location->>'lat')::double precision)) * 
    cos(radians((location->>'lng')::double precision) - radians(${longitude})) + 
    sin(radians(${latitude})) * 
    sin(radians((location->>'lat')::double precision))
  )) < ${radius}
`;

// GET All Restaurants
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    console.log({ lat, lng, radius });

    let restaurants;
    if (lat != null && lng != null && radius != null) {
      // restaurants = await Restaurant.findAll();

      restaurants = await Restaurant.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(
                `6371 * acos(cos(radians(${lat})) * cos(radians((location->>'lat')::double precision)) * cos(radians(${lng}) - radians((location->>'lng')::double precision)) + sin(radians(${lat})) * sin(radians((location->>'lat')::double precision)))`
              ),
              "distance",
            ],
          ],
        },
        order: sequelize.col("distance"),
        group: ["Restaurant.id"], // Ensure to group by primary key or unique identifier
        having: sequelize.literal(
          `6371 * acos(cos(radians(${lat})) * cos(radians((location->>'lat')::double precision)) * cos(radians(${lng}) - radians((location->>'lng')::double precision)) + sin(radians(${lat})) * sin(radians((location->>'lat')::double precision))) < ${radius}`
        ),
        limit: 10,
      });

      // restaurants = await Restaurant.findAll({
      //   where: sequelize.where(
      //     sequelize.literal(
      //       "6371 * acos(cos(radians(" +
      //         lat +
      //         ")) * cos(radians((location->>'lat')::double precision)) * cos(radians(" +
      //         lng +
      //         ") - radians((location->>'lng')::double precision)) + sin(radians(" +
      //         lat +
      //         ")) * sin(radians((location->>'lat')::double precision))) < 500"
      //     )
      //     // sequelize.literal(
      //     //   `6371 * acos(cos(radians(${lat})) * cos(radians((location->>'lat')::double precision)) * cos(radians(${lng}) - radians((location->>'lng')::double precision)) + sin(radians(${lat})) * sin(radians((location->>'lat')::double precision))) < ${radius}`
      //     // )
      //   ),
      // });
    } else {
      restaurants = await Restaurant.findAll();
    }
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET a Single Restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST Create a New Restaurant
router.post("/", async (req, res) => {
  try {
    // console.log({ body: (req.body) });
    req.body.location = JSON.parse(req.body.location);
    req.body.images = JSON.parse(req.body.images);
    req.body.cousine = JSON.parse(req.body.cousine);

    let restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(400).json({ message: "Failed to create restaurant" });
  }
});

// PUT Update a Restaurant by ID
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let [updatedCount, [updatedRestaurant]] = await Restaurant.update(
      req.body,
      { where: { id } }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH Partially Update a Restaurant by ID
router.patch("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let [updatedCount, [updatedRestaurant]] = await Restaurant.update(
      req.body,
      { where: { id } }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE a Restaurant by ID
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let deletedCount = await Restaurant.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.use("/:restaurant_id/tables", tablesRouter);
router.use("/:restaurant_id/menu", menuRouter);

export default router;
