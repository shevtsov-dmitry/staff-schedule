// models/Employee.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
const Department = require('./Department');
const Position = require('./Position');

class Employee extends Model {}

Employee.init(
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
    },
    last_name: {
      type: DataTypes.STRING(255),
    },
    phone_number: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    hire_date: {
      type: DataTypes.DATE,
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
    modelName: 'Employee',
    tableName: 'employee',
    timestamps: false,
  }
);

module.exports = Employee;