const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const Account = require("../models/account");
const Category = require("../models/category");
const { jwtSecret } = require("../secrets");
const defaultAccounts = require("../setup/accounts");
const defaultCategories = require("../setup/categories");
const sequelize = require("../db");

const accessTokenTTL = "15m";
const refreshTokenTTL = "1h";

const create = async ({ body }) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "fr"] } }),
    password: Joi.string().pattern(
      /^(?=.*[A-Z])(?=.*[!@#$&*,;?])(?=.*[0-9])(?=.*[a-z]).{8,}$/
    ),
    balance: Joi.number(),
  });
  const { error } = schema.validate(body, { presence: "required" });
  if (error) {
    return { status: 400, error: error.message };
  }
  const count = await User.count({ where: { email: body.email } });
  if (count) {
    return { status: 409, error: "User already exists" };
  }
  body.salt = crypto.randomBytes(16);
  body.password = crypto.pbkdf2Sync(
    body.password,
    body.salt,
    310000,
    32,
    "sha256"
  );
  await sequelize.transaction(async (t) => {
    const { id } = await User.create(body, { transaction: t });
    await Account.bulkCreate(
      defaultAccounts.map((account) => ({ ...account, userId: id })),
      { transaction: t }
    );
    await Category.bulkCreate(
      defaultCategories.map((category) => ({ ...category, userId: id })),
      { transaction: t }
    );
  });
  return { status: 201, data: { message: "User created successfully" } };
};

const login = async ({ body: { email, password } }) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "fr"] } }),
    password: Joi.string().pattern(
      /^(?=.*[A-Z])(?=.*[!@#$&*,;?])(?=.*[0-9])(?=.*[a-z]).{8,}$/
    ),
  });
  const { error } = schema.validate(
    { email, password },
    { presence: "required" }
  );
  if (error) {
    return { status: 400, error: error.message };
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return { status: 401, error: "Invalid email" };
  }
  const hashedPassword = crypto.pbkdf2Sync(
    password,
    user.salt,
    310000,
    32,
    "sha256"
  );
  if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
    return { status: 401, error: "Invalid password" };
  }
  const tokenPayload = { id: user.id };
  const refreshToken = jwt.sign(tokenPayload, jwtSecret, {
    expiresIn: refreshTokenTTL,
  });
  const accessToken = jwt.sign(tokenPayload, jwtSecret, {
    expiresIn: accessTokenTTL,
  });
  return { status: 200, data: { accessToken, refreshToken } };
};

const refresh = async ({ body: { refreshToken } }) => {
  try {
    if (!refreshToken) {
      return { status: 400, error: "Refresh token is required" };
    }
    const { id, email } = jwt.verify(refreshToken, jwtSecret);
    const accessToken = jwt.sign({ id, email }, jwtSecret, {
      expiresIn: accessTokenTTL,
    });
    return { status: 200, data: { accessToken } };
  } catch (error) {
    return { status: 401, error: `Invalid refresh token: ${error.message}` };
  }
};

module.exports = {
  create,
  login,
  refresh,
};
