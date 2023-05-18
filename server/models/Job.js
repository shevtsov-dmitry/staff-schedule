// models/Job.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
const Department = require('./Department');
const Position = require('./Position');

class Job extends Model {}

Job.init(
  {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    job_title: {
      type: DataTypes.STRING(255),
    },
    job_description: {
      type: DataTypes.TEXT,
    },
    job_requirements: {
      type: DataTypes.TEXT,
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: 'department_id',
      },
    },
    position_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Position,
        key: 'position_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'job',
    timestamps: false,
  }
);

module.exports = Job;