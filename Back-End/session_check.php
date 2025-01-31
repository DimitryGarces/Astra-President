<?php
session_start();

if (isset($_SESSION['usuario'])) {
    echo json_encode([
        'success' => true,
        'usuario' => $_SESSION['usuario']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No hay sesión activa'
    ]);
}
?>
