<?php
include_once '../../config/Connection.php';
include_once '../../models/OrderCrud.php';

$id =$_GET['id'];

if (!$id || empty($id)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$service = new OrderCrud($db);
$tablesResult = $service->getOrder($id);
echo json_encode($tablesResult);
