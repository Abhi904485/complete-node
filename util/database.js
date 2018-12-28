const Sequelize = require("sequelize");

const sequelize = new Sequelize("completenode", "root", "novell", {
  dialect: "mysql",
  host: "localhost",
  logging:true,
});

module.exports = sequelize;
