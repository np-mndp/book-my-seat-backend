import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Restaurant = sequelize.define("Restaurant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    cousine: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
    expensiveRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 3
        }
      },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });

  return Restaurant;
};
