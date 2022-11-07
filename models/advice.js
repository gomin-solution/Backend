"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Advice extends Model {
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
      //   this.hasMany(models.Comment, {
      //     foreignKey: "adviceId",
      //     sourceKey: "adviceId",
      //   });
      //   this.hasMany(models.Save, {
      //     foreignKey: "adviceId",
      //     sourceKey: "adviceId",
      //   });
    }
  }
  Advice.init(
    {
      adviceId: {
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
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adviceImg1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adviceImg2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //   isSave: {
      //     type: DataTypes.BOOLEAN,
      //     allowNull: true,
      //   },
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
      modelName: "Advice",
    }
  );
  return Advice;
};
