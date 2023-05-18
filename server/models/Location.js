// models/Location.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../path/to/your/database/connection');
const Department = require('./Department');

class Location extends Model {}

Location.init(
  {
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    location_name: {
      type: DataTypes.STRING(255),
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(255),
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location_manager_id: {
      type: DataTypes.INTEGER,
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: 'department_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Location',
    tableName: 'location',
    timestamps: false,
  }
);

module.exports = Location;