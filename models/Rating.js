import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    review:{
        type: DataTypes.TEXT("medium"),
        allowNull: false,
    },
    ratableType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ratableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Rating;
};