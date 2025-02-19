const socket = io(); // Establece la conexión WebSocket con el servidor

// Escucha el evento 'productAdded' para actualizar la lista de productos en tiempo real
socket.on('productAdded', (product) => {
  console.log('Nuevo producto agregado:', product);

  // Aquí puedes actualizar dinámicamente la interfaz de usuario
  const productList = document.getElementById('product-list');
  const productItem = document.createElement('li');
  productItem.textContent = product.title; // Muestra el título del producto (puedes agregar más detalles)
  productList.appendChild(productItem);
});

// Función para agregar un producto mediante WebSocket
function addProduct(product) {
  socket.emit('addProduct', product); // Envia el evento 'addProduct' al servidor
}

// Función para agregar un producto a través del formulario
const form = document.getElementById('add-product-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('product-title').value;
  const newProduct = { title }; // Crear el objeto de producto
  // Llamamos a la función para agregar el producto
  addProduct(newProduct);
});