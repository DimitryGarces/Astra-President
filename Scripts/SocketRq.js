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
            text: 'Faltan parámetros en la URL.',
            timer: 2000
        });
        return;
    }

    // Crear el objeto de datos
    const data = {
        device: device,
        tag: tag
    };


    let socket = io('https://serverws-gwch.onrender.com');

    // Enviar los datos al servidor WebSocket
    socket.emit('registerDevice', { device: device, tag: tag });

    socket.on('accesoConcedido', () => {
        Swal.fire({
            icon: 'success',
            title: 'Acceso concedido',
            text: 'Tu dispositivo ha sido autenticado correctamente.',
            timer: 2000
        });
        window.close();
    });

    socket.on('accesoDenegado', () => {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Alerta: La suplantación de identidad es un delito.',
            timer: 2000
        });
    });
    Swal.fire({
        icon: 'success',
        title: '¡Ya casi está listo!',
        text: 'Estamos personalizando tu experiencia Cosmos.',
        timer: 2000
    });
    
});
