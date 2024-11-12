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
            $stmt = $pdo->query("SELECT * FROM productos");
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($productos);
            break;

        case 'fetch':
            $id_producto = $_POST['id_producto'];
            $stmt = $pdo->prepare("SELECT * FROM productos WHERE id_producto = ?");
            $stmt->execute([$id_producto]);
            $producto = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($producto);
            break;

        case 'add':
            $nombre = $_POST['nombre'];
            $descripcion = $_POST['descripcion'];
            $precio = $_POST['precio'];
            $stock = $_POST['stock'];

            $stmt = $pdo->prepare("INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nombre, $descripcion, $precio, $stock]);
            echo json_encode(['success' => true, 'message' => 'Producto creado con éxito.']);
            break;

        case 'update':
            $id_producto = $_POST['id'];
            $nombre = $_POST['nombre'];
            $descripcion = $_POST['descripcion'];
            $precio = $_POST['precio'];
            $stock = $_POST['stock'];

            $stmt = $pdo->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?");
            $stmt->execute([$nombre, $descripcion, $precio, $stock, $id_producto]);
            echo json_encode(['success' => true, 'message' => 'Producto actualizado con éxito.']);
            break;

        case 'delete':
            $id = $_POST['id'];

            $stmt = $pdo->prepare("DELETE FROM productos WHERE id_producto = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Producto eliminado con éxito.']);
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
