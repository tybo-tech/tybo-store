<?php
include_once '../../config/Connection.php';
include_once '../../models/Category.php';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid category ID']);
    exit;
}
$connection = new Connection();
$db = $connection->connect();

$service = new Category($db);
$tablesResult = $service->getCategoryById($id);
echo json_encode($tablesResult);
