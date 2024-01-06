const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => console.log("servidor en el puerto 3001"));
const lecturaProducts = async () => {
  try {
    let productosNoParse = await fs.promises.readFile(
      "./Productos.json",
      "utf-8"
    );
    let productos = await JSON.parse(productosNoParse);
    return productos;
  } catch (error) {
    console.error(
      error.code == "ENOENT"
        ? "El archivo no existe"
        : `Ha ocurrido un nuevo error ${error}`
    );
  }
};

app.get("/products", async (req, res) => {
  try {
    const products = await lecturaProducts();
    if (!products)
      return res.send({ message: "No hay productos para mostrar" });
    const limit = req.query.limit;
    if (!limit) {
      // chequeo si limit viene vacio devuelvo en la respuesta todos los productos
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
    const products = await lecturaProducts();
    //Chequea que haya productos
    if (!products)
      return res.send({ message: "No hay productos para mostrar" });

    const id = parseInt(req.params.id);
    //Chequea que el id ingresado sea de tipo number
    if (isNaN(id)) {
      return res.status(400).send({ message: "El ID debe ser NUMERICO" });
    }
    const product = products.find((prod) => prod.id == id);
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
