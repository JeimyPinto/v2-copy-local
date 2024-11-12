<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Configuración de conexión
$db_host = 'localhost';
$db_name = 'sistema_facturacion';
$db_charset = 'utf8';
$db_user = 'root';
$db_pass = '';

$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";

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
            $stmt = $pdo->query("SELECT * FROM usuarios");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
            break;

        case 'fetch':
            $id = $_POST['id'];
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($user);
            break;

        case 'add':
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $contrasenia = password_hash($_POST['contrasenia'], PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, telefono, password, sincronizado) VALUES (?, ?, ?, ?, 1)");
            $stmt->execute([$nombre, $email, $telefono, $contrasenia]);
            echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
            break;

        case 'update':
            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $contrasenia = password_hash($_POST['contrasenia'], PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, password = ?, sincronizado = 1 WHERE id = ?");
            $stmt->execute([$nombre, $email, $telefono, $contrasenia, $id]);
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];

            $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado con éxito.']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}