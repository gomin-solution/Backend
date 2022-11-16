"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Advice, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });

      this.hasMany(models.Choice, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });

      this.hasMany(models.Comment, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });

      //투표여부
      this.hasMany(models.isChoice, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
      // this.hasMany(models.Choice, {
      //   foreignKey: "userKey",
      //   sourceKey: "userKey",
      // });
      // this.hasMany(models.Comment, {
      //   foreignKey: "userKey",
      //   sourceKey: "userKey",
      // });
      this.hasMany(models.AdviceBM, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });

      this.hasMany(models.ChoiceBM, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
      this.hasMany(models.MissionComplete, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
      this.hasMany(models.Note, {
        foreignKey: "userKey",
        targetKey: "fUser",
      });
      this.hasMany(models.Note, {
        foreignKey: "userKey",
        targetKey: "tUser",
      });
    }
  }
  User.init(
    {
      userKey: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      isAdult: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      userImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: "User",
    }
  );
  return User;
};
