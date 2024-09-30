const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    salt: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

module.exports = User;
