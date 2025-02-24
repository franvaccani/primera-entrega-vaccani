const socket = io();

const renderProducts = (products) => {
  const container = document.getElementById('productsList');
  container.innerHTML = products.map(product => `
    <div class="col">
      <div class="card product-card h-100">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted">${product.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary">$${product.price}</span>
            <div>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.code}')">
                Eliminar
              </button>
            </div>
          </div>
          <small class="text-muted d-block mt-2">SKU: ${product.code}</small>
        </div>
      </div>
    </div>
  `).join('');
};

socket.on('productsList', (products) => {
  renderProducts(products);
});

document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newProduct = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    code: document.getElementById('code').value
  };
  
  socket.emit('addProduct', newProduct);
  e.target.reset();
});

window.deleteProduct = (code) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    socket.emit('deleteProduct', code);
  }
};