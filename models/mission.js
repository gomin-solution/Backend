"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.ChoiceMission, {
        foreignKey: "missionId",
      });
      this.hasOne(models.LikeMission, {
        foreignKey: "missionId",
      });
      this.hasOne(models.AdviceMission, {
        foreignKey: "missionId",
      });
      this.hasOne(models.PostMission, {
        foreignKey: "missionId",
      });
      this.hasMany(models.MissionComplete, {
        foreignKey: "missionId",
      });
    }
  }
  Mission.init(
    {
      missionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Mission",
      timestamps: false,
    }
  );
  return Mission;
};
