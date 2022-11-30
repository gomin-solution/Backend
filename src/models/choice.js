"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Choice extends Model {
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

      //투표여부
      this.hasMany(models.isChoice, {
        foreignKey: "choiceId",
        sourceKey: "choiceId",
      });

      this.hasMany(models.ChoiceBM, {
        foreignKey: "choiceId",
        sourceKey: "choiceId",
      });
    }
  }
  Choice.init(
    {
      choiceId: {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice1Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice2Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      choice1Per: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      choice2Per: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      choiceCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isEnd: {
        type: DataTypes.BOOLEAN,
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
      modelName: "Choice",
    }
  );
  return Choice;
};
