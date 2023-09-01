// models/ShiftSchedule.js
import {database_url} from "server/CONSTANTS"

const { DataTypes, Model } = require('sequelize');
const sequelize = require(database_url);
const Employee = require('./Employee');
const Job = require('./Job');

class ShiftSchedule extends Model {}

ShiftSchedule.init(
  {
    shift_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    shift_start_time: {
      type: DataTypes.TIME,
    },
    shift_end_time: {
      type: DataTypes.TIME,
    },
    shift_supervisor: {
      type: DataTypes.STRING(255),
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'employee_id',
      },
    },
    date: {
      type: DataTypes.DATE,
    },
    job_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Job,
        key: 'job_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ShiftSchedule',
    tableName: 'shift_schedule',
    timestamps: false,
  }
);

module.exports = ShiftSchedule;
