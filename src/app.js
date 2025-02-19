const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const expressHandlebars = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app); // Usamos http.createServer para habilitar WebSocket
const io = socketIo(server); // Configuramos Socket.io para el servidor

const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos (por ejemplo, JS para el front)

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Real-Time Products' });
});

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('addProduct', (product) => {
    io.emit('productAdded', product); // Emite el producto agregado a todos los clientes conectados
  });

  socket.on('deleteProduct', (productId) => {
    io.emit('productDeleted', productId); // Emite el ID del producto eliminado
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Rutas HTTP (por ejemplo, para agregar productos)
app.post('/api/products', (req, res) => {
  const newProduct = req.body;

  // Aquí puedes guardar el producto en tu base de datos o en un archivo JSON
  // Por ejemplo, si estás usando un archivo JSON:

  const fs = require('fs');
  const productsFile = './data/products.json';
  
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de productos:', err);
      return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    }

    const products = JSON.parse(data);
    products.push(newProduct); // Agregar el nuevo producto

    fs.writeFile(productsFile, JSON.stringify(products), 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el producto:', err);
        return res.status(500).json({ error: 'Error al guardar el producto' });
      }

      // Emitir el evento WebSocket para notificar a todos los clientes
      io.emit('productAdded', newProduct); // Emitir el evento WebSocket

      return res.status(201).json(newProduct); // Responder con el producto creado
    });
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});