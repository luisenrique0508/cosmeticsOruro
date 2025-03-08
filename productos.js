
document.addEventListener('DOMContentLoaded', function() {
    fetch('productos.json')
      .then(response => response.json())
      .then(data => {
        const gridContainer = document.querySelector('.grid-container');
        
        // Cargar productos y mostrarlos en la página
        data.productos.forEach(producto => {
          const gridItem = document.createElement('div');
          gridItem.classList.add('grid-item');
          
          const productImage = document.createElement('img');
          productImage.src = producto.imagen;
          productImage.alt = producto.nombre;
          
          const productName = document.createElement('div');
          productName.textContent = producto.nombre;
          
          const productPrice = document.createElement('div');
          productPrice.classList.add('price');
          productPrice.textContent = `Ahora ${producto.precio}`;
          
          const oldPrice = document.createElement('div');
          oldPrice.classList.add('old-price');
          oldPrice.textContent = `Antes ${producto.precioAntiguo}`;
          
          const addToCartButton = document.createElement('button');
          addToCartButton.classList.add('add-to-cart');
          addToCartButton.textContent = 'Agregar al carrito';
          
          // Añadir la funcionalidad de agregar al carrito
          addToCartButton.addEventListener('click', () => {
              agregarAlCarrito(producto);
          });
          
          gridItem.appendChild(productImage);
          gridItem.appendChild(productName);
          gridItem.appendChild(productPrice);
          gridItem.appendChild(oldPrice);
          gridItem.appendChild(addToCartButton);
          
          gridContainer.appendChild(gridItem);
        });
      })
      .catch(error => console.error('Error al cargar los productos:', error));
    
    // Función para agregar productos al carrito
    function agregarAlCarrito(producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Agregar producto al carrito
        carrito.push(producto);
        
        // Guardar carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Notificación de producto agregado
        alert(`${producto.nombre} ha sido agregado al carrito.`);
    }
});
