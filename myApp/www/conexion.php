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