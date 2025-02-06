const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Leer carritos desde el archivo JSON
const readCarts = () => {
  if (!fs.existsSync(cartsFilePath)) return [];
  const data = fs.readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Guardar carritos en el archivo JSON
const saveCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// POST /api/carts - Crea un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1,
    products: []
  };

  carts.push(newCart);
  saveCarts(carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid - Lista los productos de un carrito
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id == req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid - Agrega un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id == req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const productIndex = cart.products.findIndex(p => p.product == req.params.pid);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  saveCarts(carts);
  res.json(cart);
});

module.exports = router;