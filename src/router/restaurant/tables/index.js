import express from "express";
import { Restaurant, Tables } from "../../../configs/dbConfig.js";

let router = express.Router({ mergeParams: true });

// Get all menu items
router.get("/", async (req, res) => {
  console.log(req.params);

  try {
    const tables = await Tables.findAll({
      where: {
        RestaurantId: req.params.restaurant_id,
      },
    });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new table
router.post("/", async (req, res) => {
  try {
    let { restaurant_id } = req.params;
    let { tables } = req.body;
    const managerId = Restaurant.findOne({
      where: {
        id: req.params.restaurant_id,
      },
      attributes: ["ManagerId"],
    });
    if (req.user?.isManager) {
      const updatedTables = tables.map((table) => ({
        ...table,
        RestaurantId: restaurant_id,
      }));

      let newTable = await Tables.bulkCreate(updatedTables);

      res.status(201).json(newTable);
    } else {
      res
        .status(401)
        .json({ message: "You are not authorized to add a tables" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing table
router.put("/:id", async (req, res) => {
  try {
    let { seats, tableCount, place } = req.body;
    let [updatedRows] = await Tables.update(
      { seats, tableCount, place },
      { where: { id: req.params.id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Table not found" });
    }
    let updatedTable = await Tables.findByPk(req.params.id);
    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a table
router.delete("/:id", async (req, res) => {
  try {
    let deletedRows = await Tables.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
