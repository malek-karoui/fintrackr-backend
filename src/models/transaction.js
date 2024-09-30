const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Transaction = sequelize.define(
  "transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("expense", "income"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

module.exports = Transaction;
