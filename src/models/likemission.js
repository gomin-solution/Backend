"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LikeMission extends Model {
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
    }
  }
  LikeMission.init(
    {
      missionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Missions",
          key: "missionId",
        },
      },
      likeMission: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "LikeMission",
      timestamps: false,
    }
  );
  return LikeMission;
};
