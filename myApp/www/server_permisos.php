<?php
include 'conexion.php';
try {
    // Conexión a la base de datos
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar el método de la petición. Si es OPTIONS, se responde con 200 OK.
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'fetchAll':
            $stmt = $pdo->query("SELECT permisos_usuario.*, usuarios.nombre FROM permisos_usuario JOIN usuarios ON permisos_usuario.id_usuario = usuarios.id");
            $permisos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($permisos);
            break;

        case 'fetch':
            $id_permiso = $_POST['id_permiso'];
            error_log("Fetching permiso with id: " . $id_permiso);
            $stmt = $pdo->prepare("SELECT * FROM permisos_usuario WHERE id_permiso = ?");
            $stmt->execute([$id_permiso]);
            $permiso = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($permiso);
            break;

        case 'add':
            $id_usuario = $_POST['id_usuario'];
            $permiso = $_POST['permiso'];
            error_log("Adding permiso for user id: " . $id_usuario);

            $stmt = $pdo->prepare("INSERT INTO permisos_usuario (id_usuario, permiso) VALUES (?, ?)");
            $stmt->execute([$id_usuario, $permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso creado con éxito.']);
            break;

        case 'update':
            $id_permiso = $_POST['id_permiso'];
            $id_usuario = $_POST['id_usuario'];
            $permiso = $_POST['permiso'];
            error_log("Updating permiso with id: " . $id_permiso);

            $stmt = $pdo->prepare("UPDATE permisos_usuario SET id_usuario = ?, permiso = ? WHERE id_permiso = ?");
            $stmt->execute([$id_usuario, $permiso, $id_permiso]);
            echo json_encode(['success' => true, 'message' => 'Permiso actualizado con éxito.']);
            break;

        case 'fetchAllUsuarios':
            error_log("Fetching all usuarios");
            $stmt = $pdo->query("SELECT id, nombre FROM usuarios");
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($usuarios);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
