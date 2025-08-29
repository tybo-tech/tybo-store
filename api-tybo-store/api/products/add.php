<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->name)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$service = new ProductCrud($db);
$tablesResult = $service->addProduct($data);
echo json_encode($tablesResult);
