<?php
include_once '../../config/Connection.php';
include_once '../../models/OrderCrud.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->items)) {
    echo json_encode(['error' => 'Invalid request, order must have items']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$service = new OrderCrud($db);
$tablesResult = $service->addOrder($data);
echo json_encode($tablesResult);
