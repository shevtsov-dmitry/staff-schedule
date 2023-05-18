// models/Department.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
const Location = require('./Location');

class Department extends Model {}

Department.init(
  {
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING(255),
    },
    department_manager: {
      type: DataTypes.STRING(255),
    },
    department_budget: {
      type: DataTypes.DECIMAL(10, 2),
    },
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Location,
        key: 'location_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'department',
    timestamps: false,
  }
);

module.exports = Department;