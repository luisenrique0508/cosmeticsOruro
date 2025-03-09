document.addEventListener("DOMContentLoaded", () => {
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
                              <button class="btn btn-primary add-to-cart" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
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
                  agregarAlCarrito({ nombre, precio });
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
  mostrarAvisoCarrito(`${producto.nombre} ha sido agregado al carrito.`);
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  document.getElementById("cart-count").textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function mostrarAvisoCarrito(mensaje) {
  const notification = document.getElementById("cart-notification");
  notification.textContent = mensaje;
  notification.style.display = "inline";
  setTimeout(() => {
      notification.style.display = "none";
  }, 3000); // Ocultar el aviso después de 3 segundos
}