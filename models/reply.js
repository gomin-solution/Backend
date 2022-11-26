"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Comment, {
        foreignKey: "commentId",
        sourceKey: "commentId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        sourceKey: "userKey",
      });
    }
  }
  Reply.init(
    {
      replyId: {
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
      commentId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Comment",
          key: "commentId",
        },
        onDelete: "cascade",
      },
      route: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      count: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.STRING,
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
      modelName: "Reply",
    }
  );
  return Reply;
};
