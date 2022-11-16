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
        sourceKey: "fUser",
      });
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        sourceKey: "tUser",
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
      fUser: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
      tUser: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
      note: {
        type: DataTypes.STRING,
      },
      isMe: {
        type: DataTypes.BOOLEAN,
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
