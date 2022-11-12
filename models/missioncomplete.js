"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MissionComplete extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mission, {
        foreignKey: "missionId",
        targetKey: "missionId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userKey",
        targetKey: "userKey",
      });
    }
  }
  MissionComplete.init(
    {
      missionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Missions",
          key: "missionId",
        },
      },
      userKey: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
    },
    {
      sequelize,
      modelName: "MissionComplete",
      timestamps: false,
    }
  );
  return MissionComplete;
};
