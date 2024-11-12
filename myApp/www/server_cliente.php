<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');

include 'conexion.php';

try {
    // Conexión a la base de datos
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Manejo de la solicitud OPTIONS para CORS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'fetchAll':
            $stmt = $pdo->query("SELECT * FROM clientes");
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($clientes);
            break;

        case 'fetch':
            $id_cliente = $_POST['id_cliente'];
            $stmt = $pdo->prepare("SELECT * FROM clientes WHERE id_cliente = ?");
            $stmt->execute([$id_cliente]);
            $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($cliente);
            break;

        case 'add':
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $direccion = $_POST['direccion'];

            $stmt = $pdo->prepare("INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nombre, $email, $telefono, $direccion]);
            echo json_encode(['success' => true, 'message' => 'Cliente creado con éxito.']);
            break;

        case 'update':
            $id_cliente = $_POST['id'];
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $telefono = $_POST['telefono'];
            $direccion = $_POST['direccion'];

            $stmt = $pdo->prepare("UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id_cliente = ?");
            $stmt->execute([$nombre, $email, $telefono, $direccion, $id_cliente]);
            echo json_encode(['success' => true, 'message' => 'Cliente actualizado con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];

            $stmt = $pdo->prepare("DELETE FROM clientes WHERE id_cliente = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Cliente eliminado con éxito.']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
