<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductQuery.php';

$id = $_GET['id'];

if (!$id || empty($id)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$productQuery = new ProductQuery($db);
$result = $productQuery->getById($id);

echo json_encode($result);
