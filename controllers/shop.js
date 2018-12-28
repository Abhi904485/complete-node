const Product = require("../models/product");
exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then(products => {
      res.render("shop/product-detail.ejs", {
        product: products[0],
        pageTitle: "Product Detail",
        path: "/products"
      });
    })
    .catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(product => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: product
          });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postCart = (req, res, next) => {
  const product_id = req.body.product_id;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart
        .getProducts({ where: { id: product_id } })
        .then(products => {
          let product;
          if (products.length > 0) {
            product = products[0];
          }
          if (product) {
            let oldQuantity = product.CartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
          }
          return Product.findByPk(product_id);
        })
        .then(product => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
          });
        })
        .then(() => {
          res.redirect("/cart");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart
      .getProducts({ where: { id: prodId } })
      .then(products => {
        let product = products[0];
        return product.CartItem.destroy();
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch(error => {
        console.log(error);
      });
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder().then(order =>
        order.addProducts(
          products.map(product => {
            product.OrderItem = { quantity: product.CartItem.quantity };
            return product;
          })
        )
      );
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect("/orders"))
    .catch(error => console.log(error));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(order =>
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: order
      })
    )
    .catch(err => console.log(err));
};
