const socketIO = require('socket.io');

let io;
const products = [];

const configureSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    // Enviar productos iniciales
    socket.emit('productsList', products);

    // Escuchar nuevos productos
    socket.on('addProduct', (newProduct) => {
      products.push(newProduct);
      io.emit('productsList', products);
    });

    // Escuchar eliminación de productos
    socket.on('deleteProduct', (productCode) => {
      const index = products.findIndex(p => p.code === productCode);
      if (index !== -1) {
        products.splice(index, 1);
        io.emit('productsList', products);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado:', socket.id);
    });
  });
};

module.exports = {
  configureSocket,
  products
};