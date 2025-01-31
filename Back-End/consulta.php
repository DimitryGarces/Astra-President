<?php
// Incluir archivo de conexión a la BD (ajusta la ruta si es diferente)
include_once 'includes/db.php';

// Obtenemos los parámetros desde $_GET
$device = isset($_GET['device']) ? $_GET['device'] : '';
$tag    = isset($_GET['tag'])    ? $_GET['tag']    : '';

// Verificamos que no estén vacíos
if (empty($device) || empty($tag)) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan parámetros device o tag'
    ]);
    exit;
}

try {
    // Preparar la consulta
    $sql = "SELECT * FROM DatosUsuario WHERE device = ? AND tag = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ss", $device, $tag);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificamos si hay resultados
    if ($result->num_rows > 0) {
        $datos = [];
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }

        echo json_encode([
            'success' => true,
            'data' => 'https://serverws-gwch.onrender.com'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontraron resultados.'
        ]);
    }

    $stmt->close();
    $con->close();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la consulta: ' . $e->getMessage()
    ]);
}
