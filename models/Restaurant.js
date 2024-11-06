import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Restaurant = sequelize.define(
    "Restaurant",
    {
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
        unique: false,
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
          max: 3,
        },
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },

    {
      hooks: {
        afterFind: async(instances, options) => {
          const addBaseUrl = async(instance) => {
            instance.images = instance.images.map(
              (image) => `${process.env.BASE_URL}/public/${image}`
            );
            return instance;
          };

          if (Array.isArray(instances)) {
            return Promise.all(instances.map(addBaseUrl));
          }
          if (instances) return addBaseUrl(instances);
        },
      },
    }
  );

  return Restaurant;
};
