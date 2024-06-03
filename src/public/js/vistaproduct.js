
document.addEventListener('DOMContentLoaded', function () {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const productId = addToCartBtn.dataset.productId;
    const productStock = parseInt(addToCartBtn.dataset.productStock, 10);


    addToCartBtn.addEventListener('click', function () {
        Swal.fire({
            title: '¿Estás seguro que quieres agregar este producto al carrito?',
            input: 'number',
            inputAttributes: {
                max: productStock,
                min: 1,
                step: 1,
            },
            inputValue: 1,
            text: 'Selecciona la cantidad de unidades:',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value || value < 1 || isNaN(value)) {
                    return 'Debes ingresar una cantidad válida.';
                }
                if (value > productStock) {
                    return 'No hay suficiente stock disponible.';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const quantity = parseInt(result.value); 
                fetch('/cart/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: quantity,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Producto agregado al carrito',
                            text: `Se agregaron ${quantity} unidades al carrito.`,
                        });
                    })
                    .catch(error => {
                        console.error('Error al agregar el producto al carrito:', error);
                        alert('Hubo un error al agregar el producto al carrito.');
                    });
            }
        });
    });
});
