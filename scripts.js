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

function enviarWhatsApp(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const departamento = document.getElementById('departamento').value;
    const asunto = document.getElementById('asunto').value;
    
    // Validación simple
    if (!nombre || !telefono || !departamento || !asunto) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Construir mensaje
    const mensajeWhatsApp = 
        `¡Hola! Me interesa información sobre sus productos%0A%0A` +
        `👤 *Datos del cliente:*%0A` +
        `▫️ *Nombre:* ${nombre}%0A` +
        `▫️ *Teléfono:* ${telefono}%0A` +
        `▫️ *Ciudad:* ${departamento}%0A%0A` +
        `📝 *Consulta:*%0A${asunto}`;
    
    // Número de WhatsApp 
    const telefonoDestino = "+59168367213"; // Agrega el código de país (591) para Bolivia
    
    // Redireccionar a WhatsApp
    window.open(`https://wa.me/${telefonoDestino}?text=${mensajeWhatsApp}`, '_blank');
    
    // Limpiar formulario
    document.getElementById('contact-form').reset();
}