"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostMisson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Misson, {
        foreignKey: "missonId",
        targetKey: "missonId",
      });
    }
  }
  PostMisson.init(
    {
      missonId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Missons",
          key: "missonId",
        },
      },
      postMisson: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "PostMisson",
      timestamps: false,
    }
  );
  return PostMisson;
};
