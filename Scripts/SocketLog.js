document.addEventListener("DOMContentLoaded", function () {
    // Device y tag "hardcodeados" (como en tu ejemplo)
    const device = 'l34t0r1z4d0r53cr3t0';
    const tag = '73929203';

    // Conectar al servidor de WebSockets
    const socket = io('https://serverws-gwch.onrender.com'); // Ajusta la URL según tu necesidad

    socket.on('connect', () => {
      socket.emit('joinDevice', { device, tag });
    });
  
    socket.on('accessGranted', (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Acceso Autorizado',
        text: data.message,
        timer: 2000,
        willClose: () => {
          window.location.href = "../DashBoard/";
        }
      });
    });
  
    socket.on('accessDenied', (data) => {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: data.message,
        timer: 1500
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
  });