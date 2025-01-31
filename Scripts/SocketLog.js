document.addEventListener("DOMContentLoaded", function () {
    // Device y tag "hardcodeados" (como en tu ejemplo)
    const device = 'l34t0r1z4d0r53cr3t0';
    const tag = '73929203';

    // Conectar al servidor de WebSockets
    const socket = io('https://serverws-gwch.onrender.com'); // Ajusta la URL según tu necesidad

    // Al conectarnos, nos unimos a la sala del device y emitimos el evento de registro
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');

      // Unirse a la “sala” del device (si tu servidor lo requiere)
      socket.emit('unirmeAlDevice', { device });

      // Emitir el evento de registro de dispositivo
      socket.emit('registerDevice', { device, tag });
    });

    // Evento que el servidor emite cuando el dispositivo se registra (ajusta nombre según tu lógica)
    socket.on('nuevoRegistro', (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Acceso concedido',
        text: 'Tu dispositivo ha sido autenticado correctamente.',
        timer: 2000
      });
      // Redirigimos tras 2 segundos
      setTimeout(() => {
        window.location.href = "../DashBoard/";
      }, 2000);
    });

    // Evento que indica acceso denegado
    socket.on('accesoDenegado', (data) => {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Alerta: alguien está intentando acceder sin tu consentimiento al sistema.',
        timer: 2000
      });
    });
  });