document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();
});


function configurarFormularioContacto() {
    const form = document.getElementById('form-contacto');

    if (!form) {
        console.error('Formulario de contacto no encontrado');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre) {
            alert('Por favor, ingresa tu nombre.');
            document.getElementById('nombre').focus();
            return;
        }

        if (!mensaje) {
            alert('Por favor, escribe un mensaje.');
            document.getElementById('mensaje').focus();
            return;
        }

        const numeroTelefono = '573167221636';
        const textoMensaje = `Hola, soy ${nombre} y este es mi mensaje: ${mensaje}`;

        const mensajeCodificado = encodeURIComponent(textoMensaje);

        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        window.open(urlWhatsApp, '_blank');

        alert(`¡Gracias ${nombre}! Serás redirigido a WhatsApp para completar tu mensaje.`);

        form.reset();
    });
}


function validarTelefono(numero) {
    const numerosLimpios = numero.replace(/\D/g, '');
    return numerosLimpios.length >= 10;
}