"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class isChoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });

      this.belongsTo(models.Choice, {
        foreignKey: "choiceId",
        targetKey: "choiceId",
      });
    }
  }
  isChoice.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userKey: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
      choiceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Choice",
          key: "choiceId",
        },
        onDelete: "cascade",
      },
      choiceNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "isChoice",
    }
  );
  return isChoice;
};
