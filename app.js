"use strict";
const fs = require("fs");
class ProductManager {
  constructor(path) {
    this.variablePrivada = 0;
    this.products = [];
    this.path = path;
  }

  // AGREGAR UN PRODUCTO
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return console.log(
          "NO SE HA AGREGADO EL PRODUCTO: todos los campos son obligatorios"
        );
      } else if (typeof price !== "number" || typeof stock !== "number") {
        return console.log("los campos 'Price' y 'Stock' deben ser numeros ");
      }
      const newProduct = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      };
      if (this.products.length !== 0) {
        //chequea que no haya productos con el mismo codigo.
        const validacion = this.products.find(
          (product) => product.code === code
        );
        //en el caso que no haya producto con el mismo codigo añade el nuevo producto a this.products
        if (!validacion) {
          newProduct.id = this.variablePrivada;
          this.variablePrivada += 1;
          this.products.push(newProduct);
        } else {
          // en caso de que haya un producto con el mismo codigo aumenta el stock de dicho producto en el hipotetico caso que el duplicado de codigo signifique que es el mismo producto (para añadir algo distinto lo puse)
          validacion.stock += stock;
          const indice = this.products.findIndex(
            (producto) => producto.id === validacion.id
          );
          if (indice !== -1) {
            this.products[indice] = validacion;
          }
        }
      } else {
        //para el caso en el que no haya ningun producto registrado
        newProduct.id = this.variablePrivada;
        this.variablePrivada += 1;
        this.products.push(newProduct);
      }
      // por ultimo añado el producto al file system
      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(this.products)
      );
      return console.log("Producto registrado correctamente");
    } catch (error) {
      console.log("No se pudo registrar el producto", error);
    }
  }

  // ACTUALIZAR ALGUN PRODUCTO
  async updateProduct(id, elementNew, newValue) {
    console.log(id);
    try {
      if (!id) {
        return console.error("ERROR: ID no ingresado");
      } else if (isNaN(id)) {
        return console.error("ERROR: ID debe ser Numerico");
      }
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      let productIndex = datosParseados.findIndex(
        (product) => product.id === id
      );
      if (productIndex === -1)
        return console.log(
          "Producto no encontrado, por favor ingresa una ID correcta"
        );
      datosParseados[productIndex][elementNew] = newValue;
      this.products = datosParseados;
      const producto = datosParseados.find((prod) => prod.id === id);
      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(datosParseados)
      );
      return producto;
    } catch (error) {
      console.log("No hay datos guardados", error);
    }
  }

  // OBTENER TODOS LOS PRODUCTOS
  async getProducts() {
    try {
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      return datosParseados;
    } catch (error) {
      console.log("No hay datos guardados para devolver");
    }
  }
  // OBTENER PRODUCTO POR ID
  async getProductById(id) {
    try {
      if (!id) {
        return console.error("ERROR: ID no ingresado");
      } else if (isNaN(id)) {
        return console.error("ERROR: ID debe ser Numerico");
      }
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      return datosParseados.find((producto) => producto.id === id);
    } catch (error) {
      console.log("No hay datos guardados para devolver");
    }
  }
  async deleteProduct(id) {
    try {
      if (!id) {
        return console.error("ERROR: ID no ingresado");
      } else if (isNaN(id)) {
        return console.error("ERROR: ID debe ser Numerico");
      }
      const variableString = await fs.promises.readFile(
        `${this.path}Productos.json`,
        "utf-8"
      );
      const datosParseados = JSON.parse(variableString);
      const newProducts = datosParseados.filter(
        (producto) => producto.id !== id
      );
      this.products = newProducts;
      await fs.promises.writeFile(
        `${this.path}Productos.json`,
        JSON.stringify(newProducts)
      );
      return newProducts;
    } catch (error) {
      console.log("No hay datos guardados para devolver");
    }
  }
}

// para probar las funcionalidades de la clase

const producto = new ProductManager("./");

async function addProductAsync(
  instancia,
  title,
  description,
  price,
  thumbnail,
  code,
  stock
) {
  try {
    await instancia.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
  } catch (error) {
    console.log("hubo un error al agregar un producto", error);
  }
}

async function getProductAsync(instancia) {
  try {
    const res = await instancia.getProducts();
    console.log(res);
  } catch (error) {
    console.log(error, "getProduct");
  }
}

async function getProductByIdAsync(instancia, id) {
  try {
    const res = await instancia.getProductById(id);
    if (!res) return;
    console.log(res);
  } catch (error) {
    console.log("error", error);
  }
}

async function updateProductAsync(instancia, id, elementNew, newValue) {
  try {
    const res = await instancia.updateProduct(id, elementNew, newValue);
    if (!res) return;
    console.log("el producto actualizado es: \n", res);
  } catch (error) {
    console.log(error, "error");
  }
}

async function deleteProductAsync(instancia, id) {
  try {
    const res = await instancia.deleteProduct(id);
    if (!res) return;
    console.log("Lista actualizada de productos: \n", res);
  } catch (error) {
    console.log(error, "error");
  }
}

addProductAsync(producto, "producto1", "martillo", 500, "./img", "bc540", 25);
addProductAsync(producto, "producto2", "moladora", 500, "./img", "bc545", 25);
addProductAsync(producto, "producto3", "pala", 300, "./img", "ccc22", 15);
addProductAsync(producto, "producto4", "destor", 500, "./img", "bc543", 25);
addProductAsync(producto, "producto5", "pincel", 500, "./img", "bc542", 25);
addProductAsync(producto, "producto6", "serrucho", 300, "./img", "ccc22", 15);
addProductAsync(producto, "producto7", "pinza", 500, "./img", "bc540", 25);
addProductAsync(producto, "producto8", "carretilla", 500, "./img", "bc541", 25);
addProductAsync(producto, "producto9", "pintura", 300, "./img", "ccc223", 15);
addProductAsync(producto, "producto10", "cinta", 300, "./img", "ccc224", 15);

// [[ PARA PROBAR EL FUNCIONAMIENTO ]]
// getProductAsync(producto);

//   [[[[ TESTEO getProductById ]]]]

// (forma correcta)
// getProductByIdAsync(producto, 5);

// (comprobacion del id tipo number)
// getProductByIdAsync(producto, "asdas");

// (comprobacion enviando el id vacio)
// getProductByIdAsync(producto, "");

//   [[[[ TESTEO UPDATEPRODUCT ]]]]
// (forma correcta)
// updateProductAsync(producto, 2, "title", "pruebaUpdate");

// (comprobacion del id tipo number)
// updateProductAsync(producto, "id", "title", "pruebaUpdate");

// (comprobacion enviando el id vacio)
// updateProductAsync(producto, "", "title", "pruebaUpdate");

//   [[[[ TESTEO deleteProduct ]]]]

// (forma correcta)
// deleteProductAsync(producto,1)

// (comprobacion del id tipo number)
// deleteProductAsync(producto,"asd")

// (comprobacion enviando el id vacio)
// deleteProductAsync(producto,"")
