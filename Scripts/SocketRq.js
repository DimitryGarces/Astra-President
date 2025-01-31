// request.js
document.addEventListener("DOMContentLoaded", function () {
    // Obtenemos los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const device = params.get("device");
    const tag = params.get("tag");
    fetch(`../Back-End/consulta.php?device=${device}&tag=${tag}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                socket = io(data.message);

                socket.emit('registerDevice', { device, tag });

                socket.on('accesoConcedido', (data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Acceso concedido',
                        text: 'Tu dispositivo ha sido autenticado correctamente.',
                        timer: 2000
                    });
                    window.close();
                });
                socket.on('accesoDenegado', (data) => {
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
                title: 'Acceso denegado',
                text: error,
                timer: 2000
            });
        });
});
