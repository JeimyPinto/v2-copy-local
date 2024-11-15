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
            $stmt = $pdo->query("SELECT * FROM detalle_factura JOIN productos ON detalle_factura.id_producto = productos.id_producto JOIN facturas ON detalle_factura.id_factura = facturas.id_factura ORDER BY detalle_factura.id_detalle ASC");
            $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($detalles);
            break;

        case 'fetch':
            $id = $_POST['id_detalle'];
            $stmt = $pdo->prepare("SELECT * FROM detalle_factura WHERE id_detalle = ?");
            $stmt->execute([$id]);
            $detalle = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($detalle);
            break;
        case 'fetchByFactura':
            $id_factura = $_POST['id_factura'];
            $stmt = $pdo->prepare("
                    SELECT 
                        detalle_factura.*, 
                        productos.nombre AS nombre_producto, 
                        productos.descripcion, 
                        productos.precio, 
                        facturas.fecha, 
                        facturas.total, 
                        clientes.nombre AS nombre_cliente, 
                        usuarios.nombre AS nombre_usuario 
                    FROM detalle_factura 
                    JOIN productos ON detalle_factura.id_producto = productos.id_producto 
                    JOIN facturas ON detalle_factura.id_factura = facturas.id_factura 
                    JOIN clientes ON facturas.id_cliente = clientes.id_cliente 
                    JOIN usuarios ON facturas.id_usuario = usuarios.id 
                    WHERE detalle_factura.id_factura = ?
                ");
            $stmt->execute([$id_factura]);
            $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($detalles);
            break;

        case 'add':
            $id_factura = $_POST['id_factura'];
            $id_producto = $_POST['id_producto'];
            $cantidad = $_POST['cantidad'];

            // Obtener el precio del producto
            $stmt = $pdo->prepare("SELECT precio FROM productos WHERE id_producto = ?");
            $stmt->execute([$id_producto]);
            $producto = $stmt->fetch(PDO::FETCH_ASSOC);
            $precio_unitario = $producto['precio'];

            // Insertar el detalle de la factura
            $stmt = $pdo->prepare("INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
            $stmt->execute([$id_factura, $id_producto, $cantidad, $precio_unitario]);

            // Actualizar el total de la factura
            $stmt = $pdo->prepare("UPDATE facturas SET total = (SELECT SUM(cantidad * precio_unitario) FROM detalle_factura WHERE id_factura = ?) WHERE id_factura = ?");
            $stmt->execute([$id_factura, $id_factura]);

            //Actualizar el stock del producto
            $stmt = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id_producto = ?");
            $stmt->execute([$cantidad, $id_producto]);

            echo json_encode(['success' => true, 'message' => 'Detalle de factura creado con éxito.', 'id_detalle' => $pdo->lastInsertId()]);
            break;

        case 'update':
            $id_detalle = $_POST['id_detalle'];
            $id_factura = $_POST['id_factura'];
            $id_producto = $_POST['id_producto'];
            $cantidad = $_POST['cantidad'];
            $precio_unitario = $_POST['precio_unitario'];

            $stmt = $pdo->prepare("UPDATE detalle_factura SET id_factura = ?, id_producto = ?, cantidad = ?, precio_unitario = ? WHERE id_detalle = ?");
            $stmt->execute([$id_factura, $id_producto, $cantidad, $precio_unitario, $id_detalle]);
            echo json_encode(['success' => true, 'message' => 'Detalle de factura actualizado con éxito.']);
            break;

        case 'delete':
            $id_detalle = $_POST['id_detalle'];

            $stmt = $pdo->prepare("DELETE FROM detalle_factura WHERE id_detalle = ?");
            $stmt->execute([$id_detalle]);
            echo json_encode(['success' => true, 'message' => 'Detalle de factura eliminado con éxito.']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}