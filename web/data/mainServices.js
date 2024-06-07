// mainservices.js

// Manejo de productos
let products = [];

async function fetchProducts() {
  try {
        const response = await fetch('/data/products.json');
        if (!response.ok) {
            throw new Error('Hubo un error');
        }
        const data = await response.json();
        products = data;
        crearElementosProductos();
        actualizarEventListeners(); // Asegurarse de que los event listeners se actualicen después de crear los productos
    } catch (error) {
        return console.error('Error al cargar el archivo JSON de productos:', error);
    }
}

function crearElementosProductos() {
  const contenedorItems = document.getElementById('contenedor-items');
  contenedorItems.innerHTML = '';
  products.forEach(producto => {
    const item = document.createElement('div');
    item.className = 'item';

    item.innerHTML = `
      <span class="titulo-item">${producto.name}</span>
      <img src="${producto.image}" alt="${producto.name}" class="img-item">
      <span class="precio-item">$${producto.price}</span>
      <button class="boton-item">Agregar al Carrito</button>
    `;

    contenedorItems.appendChild(item);
  });
}

// Manejo del carrito
var carritoVisible = false;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    fetchProducts(); // Cargar productos al iniciar
    actualizarEventListeners();
}

function actualizarEventListeners() {
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

function pagarClicked() {
    fetch('/api/isLoggedIn')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                alert('Debes iniciar sesión antes de realizar una compra');
                return;
            }

            const loggedUser = data.user;
            const totalPrecio = parseFloat(document.getElementsByClassName('carrito-precio-total')[0].innerText.replace('$', '').replace('.', ''));
            const itemsCarrito = document.getElementsByClassName('carrito-item');
            const numItems = itemsCarrito.length;

            const compra = {
                id: Date.now(),
                name: loggedUser.name,
                email: loggedUser.email,
                total: totalPrecio,
                fecha: new Date().toISOString(),
                items: numItems,
                comentarios: 'Ninguno'
            };

            fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(compra)
            }).then(response => {
                if (response.ok) {
                    alert('Gracias por la compra');
                    const carritoItems = document.getElementsByClassName('carrito-items')[0];
                    while (carritoItems.hasChildNodes()) {
                        carritoItems.removeChild(carritoItems.firstChild);
                    }
                    actualizarTotalCarrito();
                    ocultarCarrito();
                } else {
                    alert('Hubo un error al registrar la compra');
                }
            }).catch(error => {
                console.error('Error al registrar la compra:', error);
            });
        })
        .catch(error => {
            console.error('Error al verificar el estado de inicio de sesión:', error);
        });
}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div');
    item.classList.add('item');
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    var itemCarritoContenido = `
      <div class="carrito-item">
          <img src="${imagenSrc}" width="80px" alt="${titulo}">
          <div class="carrito-item-detalles">
              <span class="carrito-item-titulo">${titulo}</span>
              <div class="selector-cantidad">
                  <i class="fa-solid fa-minus restar-cantidad"></i>
                  <input type="text" value="1" class="carrito-item-cantidad" disabled>
                  <i class="fa-solid fa-plus sumar-cantidad"></i>
              </div>
              <span class="carrito-item-precio">${precio}</span>
          </div>
          <span class="btn-eliminar">
              <i class="fa-solid fa-trash"></i>
          </span>
      </div>
    `;

    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    item.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);
    item.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);

    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

function actualizarTotalCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var carritoRows = carritoItems.getElementsByClassName('carrito-item');
    var total = 0;

    for (var i = 0; i < carritoRows.length; i++) {
        var carritoRow = carritoRows[i];
        var precioElemento = carritoRow.getElementsByClassName('carrito-item-precio')[0];
        var cantidadElemento = carritoRow.getElementsByClassName('carrito-item-cantidad')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        var cantidad = cantidadElemento.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toFixed(2);
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementById('carrito');
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementById('contenedor-items');
    items.style.width = '60%';
}

function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementById('carrito');
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementById('contenedor-items');
        items.style.width = '100%';
    }
}
