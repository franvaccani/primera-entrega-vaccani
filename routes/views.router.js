const express = require('express');
const router = express.Router();
const { products } = require('../config/socket');

router.get('/', (req, res) => {
  res.render('home', { 
    title: 'TecnoShop - Inicio',
    products 
  });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    title: 'TecnoShop - Tiempo Real'
  });
});

module.exports = router;