<?php
session_start();
include_once 'includes/db.php';

// Verificar si se enviaron los datos
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $device = isset($_POST['device']) ? trim($_POST['device']) : '';
    $tag    = isset($_POST['tag']) ? trim($_POST['tag']) : '';

    if (empty($device) || empty($tag)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos']);
        exit;
    }

    try {
        // Consultar en la base de datos
        $sql = "SELECT * FROM DatosUsuario WHERE device = ? AND tag = ?";
        $stmt = $con->prepare($sql);
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

            echo json_encode(['success' => true, 'message' => 'Correcto']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        }

        $stmt->close();
        $con->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $e->getMessage()]);
    }
}
