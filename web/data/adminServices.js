// adminServices.js

document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/history')  // Cambiar la ruta para obtener los datos desde la API
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("tbody");
            tableBody.innerHTML = ""; 
            data.forEach(historial => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>#${historial.id}</td>
                    <td>
                        <div class="client">
                            <div class="client-img bg-img" style="background-image: url(/images/user.jpeg)"></div>
                            <div class="client-info">
                                <h4>${historial.name}</h4>
                                <small>${historial.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>$${historial.total}</td>
                    <td>${new Date(historial.fecha).toLocaleDateString()}</td>
                    <td>${historial.items}</td>
                    <td>${historial.comentarios}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

// Funciones relacionadas con la administración de productos
$(document).ready(function() {
    // Mostrar el pop-up al hacer clic en el botón
    $("#add-product-button").click(function() {
      $("#product-form-popup").fadeIn(300);
    });
  
    // Cerrar el pop-up al hacer clic en "Cerrar" o fuera del pop-up
    $(".close-popup, .popup").click(function(event) {
      if ($(event.target).hasClass("popup") || $(event.target).hasClass("close-popup")) {
        $("#product-form-popup").fadeOut(300);
      }
    });
  
    // Evitar que se cierre el pop-up al hacer clic dentro de él
    $(".popup-content").click(function(event) {
      event.stopPropagation();
    });
  
    // Añadir producto
    $("#product-form").submit(function(event) {
      event.preventDefault();
  
      const name = $("#product-name").val();
      const price = $("#product-price").val();
      const description = $("#product-description").val();
      const image = $("#product-image").val();
  
      const newProduct = {
        name: name,
        price: price,
        description: description,
        image: image
      };
  
      // Enviar la solicitud POST para añadir el producto
      fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Producto añadido:', data);
        $("#product-form-popup").fadeOut(300);
        // Actualizar la lista de productos si es necesario
        crearElementosProductos();  // Si tienes una función para actualizar la lista de productos
      })
      .catch(error => console.error('Error al añadir el producto:', error));
    });
});
