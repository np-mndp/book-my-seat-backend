import express from "express";
import { Restaurant } from "../../configs/dbConfig.js"; // Assuming your database setup is in this file
import { Sequelize } from "sequelize";
import tablesRouter from "./tables/index.js"
// let  = db;

let router = express.Router();

// GET All Restaurants
router.get("/", async (req, res) => {
  try {
    let lat = req.query.lat;
    let lng = req.query.lng;
    // console.log(req.query);

    var restaurants;
    if (lat != null && lng != null) {
      restaurants = await Restaurant.findAll();
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

router.use("/:restaurant_id/tables", tablesRouter)

export default router;
