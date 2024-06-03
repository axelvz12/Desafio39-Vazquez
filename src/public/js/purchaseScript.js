// RUTA RELATIVA: public/js/purchaseScript.js
document.addEventListener('DOMContentLoaded', () => {
  const purchaseForm = document.getElementById('purchaseForm');
  const userIdInput = document.getElementById('userId');

  // Agregar evento al enviar el formulario
  purchaseForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener el ID del usuario del input oculto
    const userId = userIdInput.value;

    try {
      const response = await fetch('/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const ticket = await response.json();
        console.log('Compra confirmada:', ticket);
        // Mostrar SweetAlert2 para confirmar la compra
        Swal.fire({
          icon: 'success',
          title: 'Compra confirmada',
          text: '¡Gracias por tu compra!',
          willClose: () => {
            // Redirigir a otra página
            window.location.href = '/products'; 
          }
        });
      } else {
        console.error('Error al confirmar la compra:', response.statusText);
        // Mostrar SweetAlert2 para informar al usuario sobre el error
        Swal.fire({
          icon: 'error',
          title: 'Error al confirmar la compra',
          text: 'Hubo un problema al procesar tu compra. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error('Error al confirmar la compra:', error.message);
      // Mostrar SweetAlert2 para informar al usuario sobre el error
      Swal.fire({
        icon: 'error',
        title: 'Error al confirmar la compra',
        text: 'Hubo un problema al procesar tu compra. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  });
});
