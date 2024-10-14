import Sequelize from "sequelize";
import UserModel from "../models/User.js";
import RestaurantModel from "../models/Restaurant.js";
import MenuModel from "../models/Menu.js";
import RatingModel from "../models/Rating.js";
import BookingModel from "../models/Booking.js";
import TablesModel from "../models/Tables.js";

// Option 1: Passing a connection URI
export let sequelize = new Sequelize(
  "postgres://postgres:root@localhost:5432/bookMySeat"
);

export let User = UserModel(sequelize);
export let Restaurant = RestaurantModel(sequelize);
export let Menu = MenuModel(sequelize);
export let Rating = RatingModel(sequelize);
export let Booking = BookingModel(sequelize);
export let Tables = TablesModel(sequelize);

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

Restaurant.hasMany(Rating);
Menu.hasMany(Rating);

User.hasMany(Booking);
Booking.belongsTo(User);

Restaurant.hasMany(Booking);
Booking.belongsTo(Restaurant);

Restaurant.hasMany(Tables);
Tables.belongsTo(Restaurant);
Tables.hasMany(Booking);
Booking.belongsTo(Tables);

Rating.belongsTo(Restaurant, {
  as: "restaurant",
  foreignKey: "ratableId",
  constraints: false,
});
Rating.belongsTo(Menu, {
  as: "menu",
  foreignKey: "ratableId",
  constraints: false,
});

// Option 2: Passing a connection instance
// let sequelize = new Sequelize(sequelize);
// let User = UserModel(sequelize);
// let Restaurant = RestaurantModel(sequelize);
// let Menu = MenuModel(sequelize);
// let Rating = RatingModel(sequelize);
// let Booking = BookingModel(sequelize);
// let db = {
//   User,
//   Restaurant,
//   Menu,
//   Rating,
//   Booking,
// };

// Sync all models with the database
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Database & tables created!');
//   });

// export default {sequelize, User, Restaurant, Menu, Booking, Rating};
