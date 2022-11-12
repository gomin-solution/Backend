"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Misson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.ChoiceMisson, {
        foreignKey: "missonId",
      });
      this.hasOne(models.LikeMisson, {
        foreignKey: "missonId",
      });
      this.hasOne(models.AdviceMisson, {
        foreignKey: "missonId",
      });
      this.hasOne(models.PostMisson, {
        foreignKey: "missonId",
      });
      this.hasMany(models.MissonComplete, {
        foreignKey: "missonId",
      });
    }
  }
  Misson.init(
    {
      missonId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Misson",
      timestamps: false,
    }
  );
  return Misson;
};
