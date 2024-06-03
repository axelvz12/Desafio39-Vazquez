// Manejar el evento de clic en el botón Eliminar
document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = button.dataset.userId;

            // Mostrar el diálogo de confirmación con SweetAlert
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el usuario permanentemente',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar solicitud de eliminación al servidor
                    fetch(`/users/${userId}`, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                // Recargar la página después de eliminar el usuario
                                location.reload();
                            } else {
                                throw new Error('Error al eliminar el usuario');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Mostrar mensaje de error con SweetAlert
                            Swal.fire({
                                title: 'Error',
                                text: 'Hubo un problema al intentar eliminar el usuario',
                                icon: 'error',
                                confirmButtonText: 'Aceptar'
                            });
                        });
                }
            });
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = button.getAttribute('data-user-id');
            const row = button.closest('tr');
            const firstName = row.cells[0].innerText;
            const lastName = row.cells[1].innerText;
            const age = row.cells[2].innerText;
            const email = row.cells[3].innerText;
            const role = row.cells[4].innerText;

            Swal.fire({
                title: 'Modificar Usuario',
                html: `
                    <input id="firstName" type="text" value="${firstName}" placeholder="Nombre" class="swal2-input">
                    <input id="lastName" type="text" value="${lastName}" placeholder="Apellido" class="swal2-input">
                    <input id="age" type="number" value="${age}" placeholder="Edad" class="swal2-input">
                    <input id="email" type="email" value="${email}" placeholder="Email" class="swal2-input">
                    <input id="role" type="text" value="${role}" placeholder="Rol" class="swal2-input">
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const modifiedFirstName = Swal.getPopup().querySelector('#firstName').value;
                    const modifiedLastName = Swal.getPopup().querySelector('#lastName').value;
                    const modifiedAge = Swal.getPopup().querySelector('#age').value;
                    const modifiedEmail = Swal.getPopup().querySelector('#email').value;
                    const modifiedRole = Swal.getPopup().querySelector('#role').value;

                    // Enviar datos modificados al servidor
                    return fetch(`/users/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            first_name: modifiedFirstName,
                            last_name: modifiedLastName,
                            age: modifiedAge,
                            email: modifiedEmail,
                            role: modifiedRole
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al actualizar el usuario');
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
                            text: 'Hubo un problema al intentar actualizar el usuario',
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                    });
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const addButton = document.getElementById('add-user-btn');
    addButton.addEventListener('click', function() {
        Swal.fire({
            title: 'Agregar Usuario',
            html: `
                <input id="firstName" type="text" placeholder="Nombre" class="swal2-input">
                <input id="lastName" type="text" placeholder="Apellido" class="swal2-input">
                <input id="age" type="number" placeholder="Edad" class="swal2-input">
                <input id="email" type="email" placeholder="Email" class="swal2-input">
                <input id="role" type="text" placeholder="Rol" class="swal2-input">
                <input id="password" type="password" placeholder="Contraseña" class="swal2-input">
            `,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const firstName = Swal.getPopup().querySelector('#firstName').value;
                const lastName = Swal.getPopup().querySelector('#lastName').value;
                const age = Swal.getPopup().querySelector('#age').value;
                const email = Swal.getPopup().querySelector('#email').value;
                const role = Swal.getPopup().querySelector('#role').value;
                const password = Swal.getPopup().querySelector('#password').value;

                // Enviar datos al servidor
                return fetch('/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        age: age,
                        email: email,
                        role: role,
                        password: password
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al agregar el usuario');
                    }
                    return response.json();
                })
                .then(data => {
                    // Mostrar mensaje de éxito con SweetAlert
                    Swal.fire(
                        '¡Usuario agregado!',
                        'El usuario ha sido agregado correctamente.',
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
                        text: 'Hubo un problema al intentar agregar el usuario',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
            }
        });
    });
});
