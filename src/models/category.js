const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const transaction = require("./transaction");

const Category = sequelize.define(
  "category",
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
      type: DataTypes.ENUM("needs", "wants", "savings", "income"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

Category.hasMany(transaction, { onDelete: "CASCADE" });
transaction.belongsTo(Category);

module.exports = Category;
