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

    socket.on('connect', () => {
        socket.emit('checkDevice', { device, tag });
    });

    // Escuchar acceso denegado
    socket.on('accessGranted', (data) => {
        console.log('Acceso correcto recibido:', data.message);
        Swal.fire({
            icon: 'success',
            title: 'Acceso Autorizado',
            text: data.message,
            timer: 2000,
            willClose: () => {
                window.close();
              }
        });
    });

    socket.on('accessLocked', (data) => {
        Swal.fire({
            icon: 'error',
            title: 'Dispositivo Bloqueado',
            text: data.message,
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