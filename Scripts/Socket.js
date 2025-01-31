// request.js
document.addEventListener("DOMContentLoaded", function () {
    const device = 'l34t0r1z4d0r53cr3t0';
    const tag = '73929203';
    let socket;

    socket = io('https://serverws-gwch.onrender.com');
    socket.emit('registerDevice', { device, tag });

    socket.on('accesoConcedido', (data) => {
        Swal.fire({
            icon: 'success',
            title: 'Acceso concedido',
            text: 'Tu dispositivo ha sido autenticado correctamente.',
            timer: 2000
        });
        window.location.href = "../DashBoard/";
    });
    socket.on('accesoDenegado', (data) => {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Alerta: alguien está intentando acceder sin tu consentimiento al sistema.',
            timer: 2000
        });
    });

});
