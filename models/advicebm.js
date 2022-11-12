"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdviceBM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Advice, {
        foreignKey: "adviceId",
        targetKey: "adviceId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
    }
  }
  AdviceBM.init(
    {
      adviceBMId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      adviceId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Advice",
          key: "adviceId",
        },
        onDelete: 'cascade',
      },
      userKey: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userKey",
        },
      },
    },
    {
      sequelize,
      modelName: "AdviceBM",
      timestamps: false,
    }
  );
  return AdviceBM;
};
