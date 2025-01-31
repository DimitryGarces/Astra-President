document.addEventListener("DOMContentLoaded", function () {
    // Obtener los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const device = params.get('device');  // Extraer device
    const tag = params.get('tag');        // Extraer tag

    // Verificar que los valores no sean null o undefined
    if (!device || !tag) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Faltan parámetros en la URL (device o tag).',
            timer: 2000
        });
        return;
    }

    // Conectarse al servidor de WebSockets
    const socket = io('https://serverws-gwch.onrender.com');  // Reemplaza con tu URL/endpoint

    // Al conectarnos, nos unimos a la sala y emitimos el registro
    socket.on('connect', () => {
        console.log('Conectado al servidor de WebSocket');

        // Unir este socket a la sala del device
        socket.emit('unirmeAlDevice', { device });

        // Emitir evento para registrar el dispositivo
        socket.emit('registerDevice', { device, tag });
    });

    // Escuchar si el servidor notifica nuevo registro para este device
    socket.on('nuevoRegistroEnDevice', (data) => {
        // Si tu servidor emite 'nuevoRegistroEnDevice'
        Swal.fire({
            icon: 'success',
            title: 'Registro Exitoso',
            text: 'Tu dispositivo ha sido autenticado correctamente.',
            timer: 2000
        });
        // Cerrar la ventana o redirigir
        window.close();
    });

    // Si tu servidor emite 'registroExitoso' (depende de tu lógica)
    socket.on('registroExitoso', (data) => {
        Swal.fire({
            icon: 'success',
            title: 'Registro Exitoso',
            text: data.message || 'Tu dispositivo se registró correctamente.',
            timer: 2000
        });
        // Cerrar la ventana o redirigir
        window.close();
    });

    // Escuchar acceso denegado
    socket.on('accesoDenegado', (data) => {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: data.mensaje || 'Alerta: La suplantación de identidad es un delito.',
            timer: 3000
        });
    });

    // Mensaje de carga inicial (opcional)
    Swal.fire({
        icon: 'info',
        title: '¡Ya casi está listo!',
        text: 'Estamos personalizando tu experiencia...',
        timer: 2000
    });
});