<?php
session_start();

// Configuración de encabezados CORS si es necesario
header("Access-Control-Allow-Origin: *"); // Reemplaza '*' con tu dominio frontend para mayor seguridad
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para manejar y enviar respuestas JSON
function sendResponse($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Verificar que la solicitud sea POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, 'Método no permitido');
}

// Obtener el cuerpo de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar si la decodificación fue exitosa
if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Formato JSON inválido');
}

// Extraer y sanitizar los datos
$device = isset($data['device']) ? trim($data['device']) : '';
$tag    = isset($data['tag']) ? trim($data['tag']) : '';

// Verificar que los datos no estén vacíos
if (empty($device) || empty($tag)) {
    sendResponse(false, 'Faltan datos');
}

try {
    // Incluir la conexión a la base de datos
    include_once 'includes/db.php'; // Asegúrate de que la ruta es correcta

    // Preparar y ejecutar la consulta
    $sql = "SELECT * FROM DatosUsuario WHERE device = ? AND tag = ?";
    if ($stmt = $con->prepare($sql)) {
        $stmt->bind_param("ss", $device, $tag);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();

            // Guardar los datos en la sesión
            $_SESSION['usuario'] = [
                'device' => $device,
                'tag'    => $tag,
                'nombre' => $userData['nombre'] ?? 'Usuario'
            ];

            sendResponse(true, 'Correcto');
        } else {
            sendResponse(false, 'Credenciales incorrectas');
        }

        $stmt->close();
    } else {
        sendResponse(false, 'Error en la preparación de la consulta');
    }

    $con->close();
} catch (Exception $e) {
    sendResponse(false, 'Error en la consulta: ' . $e->getMessage());
}
?>
