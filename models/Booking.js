import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specialAccomodations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    eventSpecial: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    loadIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    loadOut: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterLoadin(value) {
          if (value <= this.loadin) {
            throw new Error("Loadout time must be after loadin time.");
          }
        },
      },
    },
    note:{
        type: DataTypes.TEXT("medium"),
        allowNull: true,
    }
  });

  return Booking;
};
