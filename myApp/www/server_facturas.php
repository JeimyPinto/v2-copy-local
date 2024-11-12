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
            $stmt = $pdo->query("SELECT facturas.id_factura, facturas.fecha, facturas.total, clientes.nombre, usuarios.nombre AS usuario_nombre
            FROM facturas 
            JOIN clientes ON facturas.id_cliente = clientes.id_cliente 
            JOIN usuarios ON facturas.id_usuario = usuarios.id");
            $facturas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($facturas);
            break;

        case 'fetch':
            $id = $_POST['id_factura'];
            $stmt = $pdo->prepare("SELECT * FROM facturas WHERE id_factura = ?");
            $stmt->execute([$id]);
            $factura = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(value: $factura);
            break;

        case 'add':
            $id_cliente = $_POST['id_cliente'];
            $id_usuario = $_POST['id_usuario'];
            $total = 0;

            $stmt = $pdo->prepare("INSERT INTO facturas (id_cliente, id_usuario, total) VALUES (?, ?, ?)");
            $stmt->execute([$id_cliente, $id_usuario, $total]);

            // Obtener el ID de la factura insertada
            $id_factura = $pdo->lastInsertId();

            echo json_encode(['success' => true, 'id_factura' => $id_factura]);
            break;

        case 'update':
            $id_factura = $_POST['id_factura'];
            $id_cliente = $_POST['id_cliente'];
            $id_usuario = $_POST['id_usuario'];
            $total = $_POST['total'];

            $stmt = $pdo->prepare("UPDATE facturas SET id_cliente = ?, id_usuario = ?, total = ? WHERE id_factura = ?");
            $stmt->execute([$id_cliente, $id_usuario, $total, $id_factura]);
            echo json_encode(['success' => true, 'message' => 'Factura actualizada con éxito.']);
            break;

        case 'delete':
            $id_factura = $_POST['id_factura'];

            $stmt = $pdo->prepare("DELETE FROM facturas WHERE id_factura = ?");
            $stmt->execute([$id_factura]);
            echo json_encode(['success' => true, 'message' => 'Factura eliminada con éxito.']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}