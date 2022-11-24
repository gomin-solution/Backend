"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
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
      this.belongsTo(models.NoteRoom, {
        foreignKey: "roomId",
        targetKey: "roomId",
      });
    }
  }
  Note.init(
    {
      noteId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roomId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "NoteRoom",
          key: "roomId",
        },
      },
      userKey: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      note: {
        type: DataTypes.STRING,
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
      modelName: "Note",
    }
  );
  return Note;
};
