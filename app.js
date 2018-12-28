const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const Order = require("./models/order");
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error);
    });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });
app.use(errorController.get404);
sequelize
  .sync({ force: true })
  .then(result => {
    return User.findByPk(1);
  })
  .error(error => {
    console.log(error);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: "Abhishek",
        email: "Abhishek9044855265@gmail.com"
      });
    }
    return user;
  })
  .error(error => {
    console.log(error);
  })
  .then(user => {
    return user.createCart();
  })
  .then(user => {
    app.listen(3000);
  })
  .catch(error => {
    console.log(error);
  });
