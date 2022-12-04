"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
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
    }
  }
  UserActivity.init(
    {
      userKey: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
      commentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      choiceCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      postAdviceCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      postChoiceCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      receiveLikeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      msgOpenCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "UserActivity",
      timestamps: false,
    }
  );
  return UserActivity;
};
