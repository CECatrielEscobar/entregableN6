const express = require("express");
const fs = require("fs");
const producto = require("./app");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => console.log("servidor en el puerto 3001"));

app.get("/products", async (req, res) => {
  try {
    const products = await producto.getProducts();
    if (!products)
      return res.send({ message: "No hay productos para mostrar" });
    let limit = req.query.limit;
    limit = parseInt(limit);

    if (!limit || isNaN(limit)) {
      // chequeo si limit viene vacio o limit no es un dato de tipo "number" devuelvo en la respuesta todos los productos
      return res.send({ products });
    }

    const productsLimit = products.slice(0, limit);
    res.send({ productsLimit });
  } catch (error) {
    console.log("Ha ocurrido un error al obtener los  productos", error);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    //Chequea que el id ingresado sea de tipo number
    if (isNaN(id)) {
      return res.status(400).send({ message: "El ID debe ser NUMERICO" });
    }
    const product = await producto.getProductById(id);
    //Chequea que haya encontrado un producto con la id ingresada
    if (!product)
      return res
        .status(400)
        .send({ message: `No hay productos con el id: ${id}` });
    return res.send({ product });
  } catch (error) {
    console.log("Ha ocurrido un error al obtener los Productos", error);
  }
});
