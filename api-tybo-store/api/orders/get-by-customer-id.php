<?php
include_once '../../config/Connection.php';
include_once '../../models/OrderCrud.php';

$customer_id =$_GET['customer_id'];

if (!$customer_id || empty($customer_id)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$service = new OrderCrud($db);
$tablesResult = $service->getOrderByCustomerId($customer_id);
echo json_encode($tablesResult);
