import express from 'express';
import fs from 'fs/promises';
import PORT from './data/port.js';

import productsRouter from './routes/products.router.js'

const app = express();

console.log('el puerto es ', PORT)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter)

/*
app.get('/api/products', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const productsData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productsData);
    const product = products.find((p) => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const productsData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productsData);
    const newProductId = generateUniqueId();
    const newProduct = { id: newProductId, ...product };
    products.push(newProduct);
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = req.body;
    const productsData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productsData);
    const index = products.findIndex((p) => p.id === pid);
    if (index !== -1) {
      // No actualizar o eliminar el ID del producto
      updatedProduct.id = pid;
      products[index] = updatedProduct;
      await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const productsData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productsData);
    const updatedProducts = products.filter((p) => p.id !== pid);
    await fs.writeFile('productos.json', JSON.stringify(updatedProducts, null, 2));
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});
*/

// Rutas para el carrito
app.post('/api/carts', async (req, res) => {
  try {
    const cart = req.body;
    const cartsData = await fs.readFile('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);
    // Generar un ID único para el nuevo carrito
    const newCartId = generateUniqueId();
    const newCart = { id: newCartId, ...cart };
    carts.push(newCart);
    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cartsData = await fs.readFile('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);
    const cart = carts.find((c) => c.id === cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cartsData = await fs.readFile('carrito.json', 'utf8');
    const carts = JSON.parse(cartsData);
    const cart = carts.find((c) => c.id === cid);
    if (cart) {
      const existingProduct = cart.products.find((p) => p.product === pid);
      if (existingProduct) {
        // Incrementar la cantidad del producto existente
        existingProduct.quantity += quantity;
      } else {
        // Agregar un nuevo producto al carrito
        const newProduct = { product: pid, quantity };
        cart.products.push(newProduct);
      }
      await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}
