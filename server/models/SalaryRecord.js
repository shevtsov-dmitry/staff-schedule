// models/SalaryRecord.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
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
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: 'employee_id',
      },
    },
    position_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Position,
        key: 'position_id',
      },
    },
    bonus_coefficient: {
      type: DataTypes.DECIMAL(10, 2),
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
    date: {
      type: DataTypes.DATE,
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