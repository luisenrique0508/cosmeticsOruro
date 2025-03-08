document.getElementById('contact-form').addEventListener('submit', function(event) {
    var nombre = document.getElementById('nombre').value;
    var email = document.getElementById('email').value;
    var mensaje = document.getElementById('mensaje').value;

    if (nombre === '' || email === '' || mensaje === '') {
        alert('Todos los campos son obligatorios.');
        event.preventDefault();
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.write('Por favor, ingrese un correo electrónico válido.');
        event.preventDefault();
    }
});