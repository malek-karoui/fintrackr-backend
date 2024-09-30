const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Transaction = require("./transaction");

const Account = sequelize.define(
  "account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("personal", "joint"),
      allowNull: false,
    },
    initialBalance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currentBalance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

Account.hasMany(Transaction, { onDelete: "CASCADE" });
Transaction.belongsTo(Account);

module.exports = Account;
