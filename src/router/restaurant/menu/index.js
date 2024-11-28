import express from "express";
import { Menu } from "../../../configs/dbConfig.js";

let router = express.Router({ mergeParams: true });

// Create menu items (Bulk Create)
router.post("/", async (req, res) => {
  try {
    let { restaurant_id } = req.params;
    let { menu } = req.body; // Assuming the frontend sends an array of menu items in 'items'

    const updatedMenu = menu.map((menu) => ({
      ...menu,
      RestaurantId: restaurant_id,
    }));
console.log({menu});

    const newItems = await Menu.bulkCreate(updatedMenu);

    res.status(201).json(newItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      where: {
        RestaurantId: req.params.restaurant_id,
      },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific menu item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Menu.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedItem = await Menu.findOne({ where: { id } });
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific menu item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Menu.destroy({
      where: { id },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
