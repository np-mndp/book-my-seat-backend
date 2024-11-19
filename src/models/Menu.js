import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Menu = sequelize.define("Menu", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menuItem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("Food", "Beverage"),
      allowNull: true,
    },
    calories:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
  });

  return Menu;
};
