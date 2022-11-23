"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user1",
        as: "User1",
      });
      this.belongsTo(models.User, {
        foreignKey: "user2",
        as: "User2",
      });
      this.hasMany(models.Note, {
        foreignKey: "roomId",
        sourceKey: "roomId",
      });
    }
  }
  NoteRoom.init(
    {
      roomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      user1: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
      user2: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
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
      modelName: "NoteRoom",
    }
  );
  return NoteRoom;
};
