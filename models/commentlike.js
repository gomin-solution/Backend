"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
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
  CommentLike.init(
    {
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
      modelName: "CommentLike",
    }
  );
  return CommentLike;
};
