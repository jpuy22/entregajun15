//Juan Rodriguez
const express = require('express');
const ProductManager = require('./productManager');

const app = express();

const path = 'misproductos.txt'
const productManager = new ProductManager(path);

app.get('/products', async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      let limitedProducts = products.slice(0, limit);
      res.json({ products: limitedProducts });
    } else {
      res.json({ products });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});

app.get('/products/:pid', async (req, res) => {
    try {
      let productId = parseInt(req.params.pid);
      let product = await productManager.getProductById(productId);
  
      if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  });

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando, puerto ${port}`);
});
