document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded ejecutado');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.dataset.productId;
            console.log('ID del producto a elimr:', productId);

            if (!productId) {
                console.error('ID del producto no pasado por vista');
                return;
            }

            // Mostrar el diálogo de confirmación con SweetAlert
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el producto permanentemente',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar solicitud de eliminación al servidor
                    fetch(`/inventario/${productId}`, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                // Recargar la página después de eliminar el producto
                                location.reload();
                            } else {
                                throw new Error('Error al eliminar el producto');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Mostrar mensaje de error con SweetAlert
                            Swal.fire({
                                title: 'Error',
                                text: 'Hubo un problema al intentar eliminar el producto',
                                icon: 'error',
                                confirmButtonText: 'Aceptar'
                            });
                        });
                }
            });
        });
    });





    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-product-id');
            const row = button.closest('tr');
            const title = row.cells[0].innerText;
            const category = row.cells[1].innerText;
            const description = row.cells[2].innerText;
            const price = row.cells[3].innerText;
            const thumbnail = row.cells[4].innerText;
            const code = row.cells[5].innerText;
            const stock = row.cells[6].innerText;

            Swal.fire({
                title: 'Modificar Producto',
                html: `
                    <input id="title" type="text" value="${title}" placeholder="Título" class="swal2-input">
                    <input id="category" type="text" value="${category}" placeholder="Categoría" class="swal2-input">
                    <textarea id="description" placeholder="Descripción" class="swal2-textarea">${description}</textarea>
                    <input id="price" type="number" value="${price}" placeholder="Precio" class="swal2-input">
                    <input id="thumbnail" type="text" value="${thumbnail}" placeholder="URL del Thumbnail" class="swal2-input">
                    <input id="code" type="text" value="${code}" placeholder="Código" class="swal2-input">
                    <input id="stock" type="number" value="${stock}" placeholder="Stock" class="swal2-input">
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const modifiedTitle = Swal.getPopup().querySelector('#title').value;
                    const modifiedCategory = Swal.getPopup().querySelector('#category').value;
                    const modifiedDescription = Swal.getPopup().querySelector('#description').value;
                    const modifiedPrice = Swal.getPopup().querySelector('#price').value;
                    const modifiedThumbnail = Swal.getPopup().querySelector('#thumbnail').value;
                    const modifiedCode = Swal.getPopup().querySelector('#code').value;
                    const modifiedStock = Swal.getPopup().querySelector('#stock').value;

                    // Enviar datos modificados al servidor
                    return fetch(`/inventario/${productId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: modifiedTitle,
                            category: modifiedCategory,
                            description: modifiedDescription,
                            price: modifiedPrice,
                            thumbnail: modifiedThumbnail,
                            code: modifiedCode,
                            stock: modifiedStock
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al actualizar el producto');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Mostrar mensaje de éxito con SweetAlert
                        Swal.fire(
                            '¡Cambios guardados!',
                            'Los cambios han sido guardados correctamente.',
                            'success'
                        ).then(() => {
                            // Recargar la página
                            location.reload();
                        });
                    })
                    .catch(error => {
                        // Mostrar mensaje de error con SweetAlert
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un problema al intentar actualizar el producto',
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                    });
                }
            });
        });
    });

    const addButton = document.getElementById('add-product-btn');
    addButton.addEventListener('click', function() {
        Swal.fire({
            title: 'Agregar Producto',
            html: `
                <input id="title" type="text" placeholder="Título" class="swal2-input">
                <input id="category" type="text" placeholder="Categoría" class="swal2-input">
                <textarea id="description" placeholder="Descripción" class="swal2-textarea"></textarea>
                <input id="price" type="number" placeholder="Precio" class="swal2-input">
                <input id="thumbnail" type="text" placeholder="URL del Thumbnail" class="swal2-input">
                <input id="code" type="text" placeholder="Código" class="swal2-input">
                <input id="stock" type="number" placeholder="Stock" class="swal2-input">
            `,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const title = Swal.getPopup().querySelector('#title').value;
                const category = Swal.getPopup().querySelector('#category').value;
                const description = Swal.getPopup().querySelector('#description').value;
                const price = Swal.getPopup().querySelector('#price').value;
                const thumbnail = Swal.getPopup().querySelector('#thumbnail').value;
                const code = Swal.getPopup().querySelector('#code').value;
                const stock = Swal.getPopup().querySelector('#stock').value;

                // Enviar datos al servidor
                return fetch('/inventario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al agregar el producto');
                    }
                    return response.json();
                })
                .then(data => {
                    // Mostrar mensaje de éxito con SweetAlert
                    Swal.fire(
                        '¡Producto agregado!',
                        'El producto ha sido agregado correctamente.',
                        'success'
                    ).then(() => {
                        // Recargar la página
                        location.reload();
                    });
                })
                .catch(error => {
                    // Mostrar mensaje de error con SweetAlert
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al intentar agregar el producto',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
            }
        });
    });
});
