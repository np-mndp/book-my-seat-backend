import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Tables = sequelize.define("Tables", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    tableCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Tables;
};
