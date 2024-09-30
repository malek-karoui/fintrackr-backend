const { Sequelize } = require("sequelize");
const {
  mysqlHost,
  mysqlUser,
  mysqlPassword,
  mysqlDatabase,
} = require("./secrets");

const sequelize = new Sequelize(mysqlDatabase, mysqlUser, mysqlPassword, {
  host: mysqlHost,
  dialect: "mysql",
  define: {
    freezeTableName: true,
    underscored: true,
  },
  // logging: console.log,
});

module.exports = sequelize;
