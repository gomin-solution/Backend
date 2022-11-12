"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LikeMisson extends Model {
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
  LikeMisson.init(
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
      likeMisson: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "LikeMisson",
      timestamps: false,
    }
  );
  return LikeMisson;
};
