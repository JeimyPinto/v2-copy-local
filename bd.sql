-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para sistema_facturacion
CREATE DATABASE IF NOT EXISTS `sistema_facturacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_facturacion`;

-- Volcando estructura para tabla sistema_facturacion.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.clientes: ~3 rows (aproximadamente)
INSERT INTO `clientes` (`id_cliente`, `nombre`, `email`, `telefono`, `direccion`, `created_at`) VALUES
	(1, 'Jeimy Pinto Cliente', 'jeimytatianapinto@gmail.com', '3058122481', 'Cra 29 # 27 A - 08', '2024-11-11 22:56:19'),
	(2, 'Weimar Tamayo Cliente', 'weimart24@gmail.com', '3216850880', 'CRA14A#3-03', '2024-11-11 22:58:07');

-- Volcando estructura para tabla sistema_facturacion.detalle_factura
CREATE TABLE IF NOT EXISTS `detalle_factura` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_factura` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS ((`cantidad` * `precio_unitario`)) STORED,
  PRIMARY KEY (`id_detalle`),
  KEY `id_factura` (`id_factura`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas` (`id_factura`) ON DELETE CASCADE,
  CONSTRAINT `detalle_factura_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detalle_factura_chk_1` CHECK ((`cantidad` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.detalle_factura: ~8 rows (aproximadamente)
INSERT INTO `detalle_factura` (`id_detalle`, `id_factura`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
	(1, 21, 1, 2, 5000.00),
	(2, 22, 1, 2, 5000.00),
	(3, 23, 1, 2, 5000.00),
	(4, 24, 1, 3, 5000.00),
	(5, 25, 1, 1, 5000.00),
	(6, 26, 1, 4, 5000.00),
	(7, 27, 7, 50, 4200.00),
	(8, 27, 6, 10, 5000.00),
	(9, 28, 7, 5, 4200.00),
	(10, 28, 6, 5, 5000.00),
	(11, 28, 8, 2, 2000.00);

-- Volcando estructura para tabla sistema_facturacion.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_factura`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL,
  CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.facturas: ~25 rows (aproximadamente)
INSERT INTO `facturas` (`id_factura`, `id_cliente`, `id_usuario`, `fecha`, `total`) VALUES
	(1, 1, 1, '2024-11-12 01:55:47', 0.00),
	(2, 1, 1, '2024-11-12 01:56:48', 0.00),
	(3, 2, 1, '2024-11-12 01:57:57', 0.00),
	(4, 2, 1, '2024-11-12 02:00:26', 0.00),
	(5, 2, 1, '2024-11-12 02:00:33', 0.00),
	(6, 2, 1, '2024-11-12 02:01:13', 0.00),
	(7, 2, 1, '2024-11-12 02:02:08', 0.00),
	(8, 2, 1, '2024-11-12 02:07:04', 0.00),
	(9, 2, 1, '2024-11-12 02:07:35', 0.00),
	(10, 1, 1, '2024-11-12 02:11:00', 0.00),
	(11, 2, 1, '2024-11-12 02:12:02', 0.00),
	(12, 2, 1, '2024-11-12 02:25:07', 0.00),
	(13, 2, 1, '2024-11-12 02:25:47', 0.00),
	(14, 2, 1, '2024-11-12 02:27:13', 0.00),
	(15, 2, 1, '2024-11-12 02:27:39', 0.00),
	(16, 2, 1, '2024-11-12 02:28:19', 0.00),
	(17, 1, 1, '2024-11-12 02:29:52', 0.00),
	(18, 2, 1, '2024-11-12 02:35:03', 0.00),
	(19, 1, 1, '2024-11-12 02:35:50', 0.00),
	(20, 1, 1, '2024-11-12 02:36:28', 0.00),
	(21, 2, 1, '2024-11-12 02:38:01', 0.00),
	(22, 2, 1, '2024-11-12 02:39:21', 10000.00),
	(23, 1, 1, '2024-11-12 02:39:57', 10000.00),
	(24, 2, 1, '2024-11-12 02:40:35', 15000.00),
	(25, 1, 1, '2024-11-12 02:41:04', 5000.00),
	(26, 1, 1, '2024-11-12 02:41:56', 20000.00),
	(27, 1, 1, '2024-11-12 17:53:02', 260000.00),
	(28, 1, 1, '2024-11-14 17:45:49', 50000.00);

-- Volcando estructura para tabla sistema_facturacion.permisos_usuario
CREATE TABLE IF NOT EXISTS `permisos_usuario` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `permiso` varchar(50) NOT NULL,
  PRIMARY KEY (`id_permiso`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `permisos_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.permisos_usuario: ~2 rows (aproximadamente)
INSERT INTO `permisos_usuario` (`id_permiso`, `id_usuario`, `permiso`) VALUES
	(1, 1, 'Administrador'),
	(2, 8, 'Administrador'),
	(3, 3, 'ejemplo');

-- Volcando estructura para tabla sistema_facturacion.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  CONSTRAINT `productos_chk_1` CHECK ((`stock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.productos: ~4 rows (aproximadamente)
INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `created_at`) VALUES
	(1, 'Ahuyama', 'Vegetal', 5000.00, 100, '2024-11-11 22:19:44'),
	(6, 'Pepino', 'Vegetales', 5000.00, 495, '2024-11-12 00:55:05'),
	(7, 'Salchicha', 'Zenú 200mg', 4200.00, 195, '2024-11-12 17:52:20'),
	(8, 'Coca Cola', 'bebida', 2000.00, 898, '2024-11-14 17:42:48'),
	(9, 'Chocolatina', 'Dulces', 500.00, 50, '2024-11-14 17:45:21');

-- Volcando estructura para tabla sistema_facturacion.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `sincronizado` tinyint(1) DEFAULT '0',
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sistema_facturacion.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `telefono`, `sincronizado`, `password`) VALUES
	(1, 'Jeimy Tatiana Pinto', 'jeimytatianapinto@gmail.com', '3058122487', 1, '$2y$10$G4xqLoBbtfig.rurJEOVg.4f7vKbtoaK/wZtfmeGLy.dFq0tlx5XS'),
	(3, 'Ayne del Rosario Tapia', 'tecnolojuancho@live.com', '+1597531523', 1, '$2y$10$wg7lVc1.WpUnUjXgKah9tuJCeKKk/NAAcj/tZ0f8bRGqvxdExtJu6'),
	(8, 'Weimar Tamayo', 'weimart24@gmail.com', '3165306359', 1, '$2y$10$7vnErlnPM69oNpBbu.K.IeWYI2MDlCQvgqEqAR6HP0AAtJATJQ/mK');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
