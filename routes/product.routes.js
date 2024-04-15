const router = require("express").Router();
const productsJson = require("../data/products.json");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Product = require("../models/Product.model");

// GET "/api/product/allproducts del archivo json"
router.get("/allproducts", isAuthenticated, (req, res, next) => {
  try {
    // console.log("llamada para los productos");
    const allPrducts = productsJson.map((eachProduct) => {
      return {
        name: eachProduct.name,
        id: eachProduct.id,
        categorie: eachProduct.categorie,
        image: eachProduct.image,
      };
    });
    res.json(allPrducts);
  } catch (error) {
    next(error);
  }
});
// Post "/api/product/create"
router.post("/create", isAuthenticated, async (req, res, next) => {
  const { nombre, imagen, categoria, cantidad, precio, unidad } = req.body;

  try {
    const response = await Product.create({
      nombre,
      imagen,
      categoria,
      cantidad,
      precio,
      unidad,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

//Post "/api/product/:productId" Borrar un prodcuto concreto
router.post("/delete/:productId", isAuthenticated, async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) {
      res.json({ message: "Producto eliminado correctamente", deletedProduct });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
