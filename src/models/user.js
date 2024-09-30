const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Account = require("./account");
const Category = require("./category");
const Transaction = require("./transaction");

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

User.hasMany(Account, { onDelete: "CASCADE" });
Account.belongsTo(User);

User.hasMany(Category, { onDelete: "CASCADE" });
Category.belongsTo(User);

User.hasMany(Transaction, { onDelete: "CASCADE" });
Transaction.belongsTo(User);

module.exports = User;
