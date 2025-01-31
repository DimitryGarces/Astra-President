document.addEventListener("DOMContentLoaded", function () {
    // Obtenemos los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const device = params.get('device');  // Extraer device
    const tag = params.get('tag');  // Extraer tag

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

    let body = new FormData();
    body.append('device', device);
    body.append('tag', tag);

    fetch(`../Back-End/consulta.php`, {
        method: 'POST',
        body: body
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
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

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: data.message,
                    timer: 2000
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                timer: 2000
            });
            console.error("Error en la solicitud:", error);
        });
});
