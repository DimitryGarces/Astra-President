// request.js
document.addEventListener("DOMContentLoaded", function () {
    // Obtenemos los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const device = params.get("device");
    const tag = params.get("tag");

    // Opcional: podrías mostrar los valores obtenidos en consola
    console.log("Device:", device);
    console.log("Tag:", tag);

    // Hacemos la solicitud al archivo PHP que se encargará de consultar la base de datos
    // Supongamos que se llama "consulta.php" (cámbialo al nombre que desees)
    fetch(`../Back-End/consulta.php?device=${device}&tag=${tag}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                socket = io(data.message);

                socket.emit('registerDevice', { device, tag });

                socket.on('accesoConcedido', (data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Acceso concedido',
                        text: 'Tu dispositivo ha sido autenticado correctamente.'
                    });
                });
                socket.on('accesoDenegado', (data) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso denegado',
                        text: 'Alerta: alguien está intentando acceder sin tu consentimiento al sistema.'
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: data.message
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: error
            });
        });
});
