"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdviceMisson extends Model {
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
  AdviceMisson.init(
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
      adviceMisson: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "AdviceMisson",
      timestamps: false,
    }
  );
  return AdviceMisson;
};
