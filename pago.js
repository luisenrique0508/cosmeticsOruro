document.addEventListener("DOMContentLoaded", function () {
    const resumenCompra = document.getElementById("resumen-compra");
    const totalElement = document.getElementById("total");
    const contactForm = document.getElementById("contact-form");
    let carrito = obtenerCarritoStorage();

    function actualizarCarrito() {
        console.log("Actualizando carrito..."); // Debug
        carrito = obtenerCarritoStorage();
        console.log("Carrito recuperado:", carrito); // Debug

        if (!resumenCompra) {
            console.error("Elemento resumen-compra no encontrado");
            return;
        }

        resumenCompra.innerHTML = '<h3>Productos en tu carrito:</h3>';
        let total = 0;

        if (!Array.isArray(carrito) || carrito.length === 0) {
            console.log("Carrito vacío"); // Debug
            mostrarCarritoVacio();
            return;
        }

        // Crear contenedor para productos
        const productosContainer = document.createElement('div');
        productosContainer.style.display = 'flex';
        productosContainer.style.flexWrap = 'wrap';
        productosContainer.style.gap = '10px';

        carrito.forEach((producto, index) => {
            if (!producto || !producto.nombre || !producto.precio) {
                console.error("Producto inválido:", producto);
                return;
            }

            const precioNumerico = typeof producto.precio === 'string' ? 
                parseFloat(producto.precio.replace("Bs", "").replace(",", ".")) : 
                producto.precio;
            
            if (isNaN(precioNumerico)) {
                console.error("Precio inválido para producto:", producto);
                return;
            }

            const cantidad = producto.cantidad || 1;
            total += precioNumerico * cantidad;

            const productoElement = document.createElement('div');
            productoElement.className = 'producto-item';
            productoElement.style.cssText = 'flex: 1 1 calc(25% - 10px); display: flex; flex-direction: column; align-items: center; padding: 5px; border: 1px solid #ddd; border-radius: 8px;';

            productoElement.innerHTML = `
                <img src="${producto.imagen || ''}" 
                     alt="${producto.nombre}" 
                     style="width: 70px; height: 95px; object-fit: cover; border-radius: 5px;">
                <h4 style="margin: 5px 0 5px; font-size: 10px; color:white;  ;">${producto.nombre}</h4>
                <p style="margin: 5px 0; font-size: 12px; color:green; ">Cantidad: 
                    <button class="decrementar-btn" data-index="${index}" style="background: none; border: none; cursor: pointer; font-size: 12px;">➖</button>
                    ${cantidad}
                    <button class="incrementar-btn" data-index="${index}" style="background: none; border: none; cursor: pointer; font-size: 12px;">➕</button>
                </p>
                <p style="margin: 0; font-size: 12px;">Precio: Bs${(precioNumerico * cantidad).toFixed(2)}</p>
                <button class="eliminar-btn" data-index="${index}" 
                        style="background: none; border: none; cursor: pointer; font-size: 16px; color: red;">
                    ❌
                </button>
            `;
            
            productosContainer.appendChild(productoElement);
        });

        resumenCompra.appendChild(productosContainer);
        totalElement.textContent = `Total a pagar: Bs${total.toFixed(2)}`;
        contactForm.style.display = carrito.length > 0 ? 'block' : 'none';
        configurarBotonesEliminar();
        configurarBotonesCantidad();
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

    function configurarBotonesCantidad() {
        document.querySelectorAll(".incrementar-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                incrementarCantidad(index);
                actualizarCarrito();
            });
        });

        document.querySelectorAll(".decrementar-btn").forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                decrementarCantidad(index);
                actualizarCarrito();
            });
        });
    }

    function incrementarCantidad(index) {
        let carrito = obtenerCarritoStorage();
        carrito[index].cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function decrementarCantidad(index) {
        let carrito = obtenerCarritoStorage();
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function obtenerCarritoStorage() {
        const carritoData = localStorage.getItem("carrito");
        console.log("Datos del localStorage:", carritoData); // Debug
        try {
            return JSON.parse(carritoData) || [];
        } catch (e) {
            console.error("Error al parsear el carrito:", e);
            return [];
        }
    }

    function eliminarDelCarrito(index) {
        let carrito = obtenerCarritoStorage();
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    console.log("Inicializando carrito..."); // Debug
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

    // Verificar el carrito cada 2 segundos
    setInterval(actualizarCarrito, 2000);

    // Ejecutar verificación inicial
    console.log("Iniciando verificación del carrito...");
    verificarCarrito();
    actualizarCarrito();

    // Agregar listener para cambios en localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'carrito') {
            console.log("Cambio detectado en el carrito");
            actualizarCarrito();
        }
    });
});