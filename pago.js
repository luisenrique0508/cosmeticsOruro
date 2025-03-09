document.addEventListener("DOMContentLoaded", function () {
    const resumenCompra = document.getElementById("resumen-compra");
    const totalElement = document.getElementById("total");
    const contactForm = document.getElementById("contact-form");
    let carrito = obtenerCarritoStorage(); // Definir carrito aquí

    function actualizarCarrito() {
        const carrito = obtenerCarritoStorage();
        resumenCompra.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            mostrarCarritoVacio();
            return;
        }

        carrito.forEach((producto, index) => {
            const item = document.createElement("div");
            item.classList.add("item");

            const precioNumerico = typeof producto.precio === 'string' ? 
                parseFloat(producto.precio.replace("Bs", "").replace(",", ".")) : 
                producto.precio;
            const cantidad = producto.cantidad || 1;
            total += precioNumerico * cantidad;

            item.innerHTML = `
                <div class="producto-carrito">
                    <div class="producto-info">
                        <p>${producto.nombre} (${cantidad} unidad(es)) - Bs${(precioNumerico * cantidad).toFixed(2)}</p>
                    </div>
                    <button class="eliminar-btn" data-index="${index}">❌</button>
                </div>
            `;
            resumenCompra.appendChild(item);
        });

        totalElement.textContent = `Total a pagar: Bs${total.toFixed(2)}`;
        configurarBotonesEliminar();
    }

    function mostrarCarritoVacio() {
        resumenCompra.innerHTML = '<p>El carrito está vacío</p>';
        totalElement.textContent = 'Total a pagar: Bs0.00';
        contactForm.style.display = 'none';
        localStorage.removeItem("carrito");
    }

    function configurarBotonesEliminar() {
        document.querySelectorAll(".eliminar-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                eliminarDelCarrito(index);
                actualizarCarrito();
                actualizarContadorCarrito(); // Actualizar el contador del carrito
            });
        });
    }

    function obtenerCarritoStorage() {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }

    function eliminarDelCarrito(index) {
        let carrito = obtenerCarritoStorage();
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    actualizarCarrito();

    // Modificar el event listener del formulario
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        carrito = obtenerCarritoStorage(); // Actualizar carrito antes de validar

        if (!carrito || carrito.length === 0) {
            alert("El carrito está vacío. Agregue productos antes de enviar.");
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const departamento = document.getElementById("departamento").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !celular || !direccion || !departamento || !mensaje) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        let resumenProductos = carrito
            .map(producto => {
                const precio = typeof producto.precio === 'string' ? 
                    parseFloat(producto.precio.replace("Bs", "").replace(",", ".")) : 
                    producto.precio;
                return `${producto.nombre} (${producto.cantidad || 1} unidad(es)) - Bs${(precio * (producto.cantidad || 1)).toFixed(2)}`;
            })
            .join("\n");

        const total = carrito.reduce((sum, producto) => {
            const precio = typeof producto.precio === 'string' ? 
                parseFloat(producto.precio.replace("Bs", "").replace(",", ".")) : 
                producto.precio;
            return sum + precio * (producto.cantidad || 1);
        }, 0);

        const textoWhatsApp = `Hola, soy ${nombre}.\n\n` +
            `Celular: ${celular}\n` +
            `Dirección: ${direccion}\n` +
            `Departamento: ${departamento}\n\n` +
            `Detalles de la compra:\n${resumenProductos}\n` +
            `Total: Bs${total.toFixed(2)}\n\n` +
            `Observación: ${mensaje}`;

        const telefonoWhatsApp = "+59168367213";
        const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
        window.open(urlWhatsApp, "_blank");
    });

    // Asegurar que el formulario esté oculto si no hay productos
    if (!carrito || carrito.length === 0) {
        contactForm.style.display = 'none';
    } else {
        contactForm.style.display = 'block';
    }

    // Inicializar el carrito al cargar la página
    actualizarCarrito();
});