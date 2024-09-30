require("./");
const sequelize = require("../db");

sequelize.sync({ alter: true }).then(() => {
  sequelize.close();
});
