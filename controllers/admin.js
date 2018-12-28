const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log("Edit Mode  = ", editMode);
  if (!editMode) {
    res.redirect("/");
  }
  const proid = req.params.productId;
  console.log("product id  = ", proid);
  req.user
    .getProducts({ where: { id: proid } })
    .then(product => {
      if (!product[0]) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product[0]
      });
    })
    .catch(error => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  title = req.body.title;
  imageurl = req.body.imageurl;
  price = req.body.price;
  description = req.body.description;
  id = req.body.productId;
  req.user
    .getProducts({ where: { id: id } })
    .then(product => {
      product[0].title = title;
      product[0].imageurl = imageurl;
      product[0].price = price;
      product[0].description = description;
      return product[0].save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .error(error => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      imageurl: imageurl,
      price: price,
      description: description
    })
    .then(response => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
};
exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products =>
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      })
    )
    .catch(error => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const proid = req.body.productId;
  req.user
    .removeProduct(proid)
    .then(product => {
      console.log("Product Destroyed");
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};
