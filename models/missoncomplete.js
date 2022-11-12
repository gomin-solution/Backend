"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MissonComplete extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
    }
  }
  MissonComplete.init(
    {
      missonId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Missons",
          key: "missonId",
        },
      },
      userKey: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
    },
    {
      sequelize,
      modelName: "MissonComplete",
      timestamps: false,
    }
  );
  return MissonComplete;
};
