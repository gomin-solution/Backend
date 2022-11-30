"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChoiceBM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Choice, {
        foreignKey: "choiceId",
        targetKey: "choiceId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
    }
  }
  ChoiceBM.init(
    {
      choiceBMId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      choiceId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Choice",
          key: "choiceId",
        },
        onDelete: "cascade",
      },
      userKey: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
    },
    {
      sequelize,
      modelName: "ChoiceBM",
      timestamps: false,
    }
  );
  return ChoiceBM;
};
