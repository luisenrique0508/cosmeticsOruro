document.addEventListener("DOMContentLoaded", () => {
    // Limpiar el carrito al cargar la página
    // limpiarCarrito(); // Comentado para no limpiar el carrito al cargar la página
    
    fetch("productos.json")
        .then((response) => response.json())
        .then((data) => {
            const container = document.getElementById("productos-container");
            container.innerHTML = "";

            data.productos.forEach((producto) => {
                const productoHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm text-center">
                            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <p class="card-text">${producto.descripcion}</p>
                                <p class="fw-bold">Precio: ${producto.precio}</p>
                                <button class="btn btn-primary add-to-cart" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-imagen="${producto.imagen}">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += productoHTML;
            });

            document.querySelectorAll(".add-to-cart").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const nombre = event.target.getAttribute("data-nombre");
                    const precio = event.target.getAttribute("data-precio");
                    const imagen = event.target.getAttribute("data-imagen");
                    agregarAlCarrito({ nombre, precio, imagen });
                });
            });
        })
        .catch((error) => console.error("Error al cargar los productos:", error));
});

function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find((item) => item.nombre === producto.nombre);

    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    showCartNotification(`¡${producto.nombre} agregado al carrito!`);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    const contador = document.getElementById("cart-count");
    contador.textContent = total;
    contador.style.display = total > 0 ? "inline" : "none";
}

function limpiarCarrito() {
    localStorage.removeItem("carrito");
    actualizarContadorCarrito();
}