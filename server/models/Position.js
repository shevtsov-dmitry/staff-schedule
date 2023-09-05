// models/Position.js
import {database_url} from "server/CONSTANTS"

const { DataTypes, Model } = require('sequelize');
const sequelize = require(database_url);
const Job = require('./Job');

class Position extends Model {}

Position.init(
  {
    position_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    position_title: {
      type: DataTypes.STRING(255),
    },
    position_description: {
      type: DataTypes.TEXT,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
    },
    hours_per_week: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    sequelize,
    modelName: 'Position',
    tableName: 'position',
    timestamps: false,
  }
);

module.exports = Position;