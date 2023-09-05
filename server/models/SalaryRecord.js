// models/SalaryRecord.js
import {database_url} from "server/CONSTANTS"

const { DataTypes, Model } = require('sequelize');
const sequelize = require(database_url);
const Employee = require('./Employee');
const Position = require('./Position');

class SalaryRecord extends Model {}

SalaryRecord.init(
  {
    salary_record_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
    bonus_coefficient: {
      type: DataTypes.DECIMAL(10, 2),
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'employee_id',
      },
    },

  },
  {
    sequelize,
    modelName: 'SalaryRecord',
    tableName: 'salary_record',
    timestamps: false,
  }
);

module.exports = SalaryRecord;