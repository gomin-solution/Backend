"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DailyMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyMessage.init(
    {
      msgId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      msg: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "DailyMessage",
      timestamps: false,
    }
  );
  return DailyMessage;
};
