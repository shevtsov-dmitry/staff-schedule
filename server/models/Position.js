// models/Position.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
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
    job_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Job,
        key: 'job_id',
      },
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