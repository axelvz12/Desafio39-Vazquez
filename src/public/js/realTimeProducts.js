document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // Emitir evento para obtener la lista de productos al cargar la página
  socket.emit('getProducts');

  // Manejar evento de actualización de productos
  socket.on('updateProducts', (products) => {
    // Actualizar la lista de productos en la interfaz
    updateProductsList(products);
  });

  // Manejar evento de eliminación de producto
  socket.on('deleteProduct', (response) => {
    if (response.success) {
      // Eliminar el producto de la interfaz
      const productId = response.deletedProduct._id;
      const productElement = document.querySelector(`[data-product-id="${productId}"]`);
      if (productElement) {
        productElement.remove();
      }

      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado exitosamente.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message || 'No se pudo eliminar el producto.',
      });
    }
  });

  // Manejar evento de click en el botón de eliminar
  document.getElementById('realTimeProductsList').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('deleteButton')) {
      const productId = event.target.dataset.productId;

      // Agregar log para verificar el valor del ID antes de emitir el evento
      console.log("ID del producto a eliminar:", productId);

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Emitir evento para eliminar el producto solo desde el cliente
          socket.emit('deleteProduct', { productId });
        }
      });
    }
  });

  // Manejar evento de submit del formulario
  document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productThumbnail = document.getElementById('productThumbnail').value;
    const productCode = document.getElementById('productCode').value;
    const productPrice = document.getElementById('productPrice').value;
    const productStock = document.getElementById('productStock').value;

    // Emitir evento para agregar el producto solo desde el cliente
    socket.emit('newProduct', {
      title: productName,
      description: productDescription,
      thumbnail: productThumbnail,
      code: productCode,
      price: productPrice,
      stock: productStock,
    });
  });

  document.getElementById('btnGoToIndex').addEventListener('click', () => {
    // Redirigir a la página de index
    window.location.href = '/'; 
  });

  // Función para actualizar la lista de productos en la interfaz
  function updateProductsList(products) {
    const realTimeProductsList = document.getElementById('realTimeProductsList');
    realTimeProductsList.innerHTML = '';

    products.forEach(product => {
      // Verificar si el producto ha sido eliminado
      if (!product.deleted) {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdPrice = document.createElement('td');

        tdName.textContent = product.title;
        tdPrice.textContent = product.price;

        tr.appendChild(tdName);
        tr.appendChild(tdPrice);

        const tdActions = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('deleteButton');
        deleteButton.dataset.productId = product._id;
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);

        realTimeProductsList.appendChild(tr);
      }
    });
  }
});
