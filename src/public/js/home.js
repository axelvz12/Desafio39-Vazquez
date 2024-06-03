// home.js
document.addEventListener('DOMContentLoaded', function () {
    // Botón para volver al index
    var volverButton = document.getElementById('volverButton');
    if (volverButton) {
      volverButton.addEventListener('click', function () {
        window.location.href = '/';
      });
    }
  });