"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DailyUpdate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyUpdate.init(
    {
      Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userKey: DataTypes.INTEGER,
      msg: DataTypes.STRING,
      isOpen: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DailyUpdate",
      timestamps: false,
    }
  );
  return DailyUpdate;
};
