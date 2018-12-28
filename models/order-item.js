const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER
  }
});

module.exports = OrderItem;
