<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profileImage'])) {
    $file = $_FILES['profileImage'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    $fileType = $file['type'];

    $fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));
    $allowed = array('jpg', 'jpeg', 'png', 'gif');

    if (in_array($fileActualExt, $allowed)) {
        if ($fileError === 0) {
            if ($fileSize < 5000000) {
                $fileNameNew = "tianguistenco." . $fileActualExt;
                $fileDestination = '../Perfiles/' . $fileNameNew;

                if (!file_exists('../Perfiles')) {
                    mkdir('../Perfiles', 0777, true);
                }

                if (move_uploaded_file($fileTmpName, $fileDestination)) {
                    // Obtener la extensión del archivo guardado
                    $fileExt = pathinfo($fileDestination, PATHINFO_EXTENSION);

                    // Establecer la cabecera Content-Type según la extensión
                    switch ($fileExt) {
                        case 'jpg':
                        case 'jpeg':
                            header('Content-Type: image/jpeg');
                            break;
                        case 'gif':
                            header('Content-Type: image/gif');
                            break;
                        case 'png':
                            header('Content-Type: image/png');
                            break;
                        default:
                            header('Content-Type: application/octet-stream');
                    }

                    // Mostrar la imagen
                    readfile($fileDestination);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Error al mover el archivo']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'El archivo es demasiado grande']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al subir el archivo']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Solo se permiten archivos JPG, JPEG, PNG y GIF']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['ayuntamiento'])) {
    $ayuntamiento = $_GET['ayuntamiento'];

    // Buscar el archivo de imagen en la carpeta "Perfiles"
    $files = glob('../Perfiles/' . $ayuntamiento . '.*');

    if (count($files) > 0) {
        // Obtener el nombre del archivo con extensión
        $imagen = basename($files[0]);
        echo json_encode(['success' => true, 'imagen' => $imagen]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se encontró la imagen']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Solicitud inválida']);
}
