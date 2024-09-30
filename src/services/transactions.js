const Joi = require("joi");
const Category = require("../models/category");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const sequelize = require("../db");

const schema = Joi.object({
  description: Joi.string(),
  type: Joi.string().valid("expense", "income"),
  amount: Joi.number(),
  date: Joi.date(),
  accountId: Joi.string().guid({ version: "uuidv4" }),
  categoryId: Joi.string().guid({ version: "uuidv4" }),
  userId: Joi.string().guid({ version: "uuidv4" }),
});

const create = async ({ body, userId }) => {
  const { error } = schema.validate(
    { ...body, userId },
    { presence: "required" }
  );
  if (error) {
    return { status: 400, error: error.message };
  }
  const account = await Account.findOne({
    where: { id: body.accountId, userId },
  });
  if (!account) {
    return { status: 404, error: "Account not found" };
  }
  const category = await Category.findOne({
    where: { id: body.categoryId, userId },
  });
  if (!category) {
    return { status: 404, error: "Category not found" };
  }
  const user = await User.findByPk(userId);
  const amount = account.type === "joint" ? body.amount / 2 : body.amount;
  user.balance =
    body.type === "expense" ? user.balance - amount : user.balance + amount;
  await sequelize.transaction(async (t) => {
    await user.save({ transaction: t });
    await Transaction.create({ ...body, userId }, { transaction: t });
  });
  return { status: 201, data: { message: "Transaction created successfully" } };
};

module.exports = {
  create,
};
