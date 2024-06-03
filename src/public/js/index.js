const socket = io();

socket.on('updateProducts', (products) => {
  // Actualizar la lista de productos en tiempo real en la página
  const realTimeProductsList = document.getElementById('realTimeProductsList');
  realTimeProductsList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - ${product.price}`;
    realTimeProductsList.appendChild(li);
  });
});

document.getElementById('productForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;
  
  // Emitir el evento de nuevo producto al servidor
  socket.emit('newProduct', { name: productName, price: productPrice });
});

