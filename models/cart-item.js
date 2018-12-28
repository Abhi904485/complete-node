const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const CartItem = sequelize.define("CartItem", {
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

module.exports = CartItem;
