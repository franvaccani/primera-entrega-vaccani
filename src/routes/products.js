const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/products.json');

// Leer productos desde el archivo JSON
const readProducts = () => {
  if (!fs.existsSync(productsFilePath)) return [];
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Guardar productos en el archivo JSON
const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// GET /api/products - Lista todos los productos
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// GET /api/products/:pid - Trae un producto por su ID
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id == req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// POST /api/products - Agrega un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || stock == null || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
  }

  const products = readProducts();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || []
  };

  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid - Actualiza un producto por su ID
router.put('/:pid', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id == req.params.pid);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
  products[index] = updatedProduct;
  saveProducts(products);
  res.json(updatedProduct);
});

// DELETE /api/products/:pid - Elimina un producto por su ID
router.delete('/:pid', (req, res) => {
  let products = readProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id != req.params.pid);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  saveProducts(products);
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;