
<?php
include_once '../../config/Connection.php';
include_once '../../models/OrderCrud.php';


$connection = new Connection();
$db = $connection->connect();

$service = new OrderCrud($db);
$tablesResult = $service->listOrders();
echo json_encode($tablesResult);
