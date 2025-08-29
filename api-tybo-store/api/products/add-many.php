<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';

$dataList = json_decode(file_get_contents("php://input"));

if(!$dataList || !is_array($dataList) || empty($dataList)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}


$connection = new Connection();
$db = $connection->connect();

$service = new ProductCrud($db);
$tablesResult = $service->addMany($dataList);
echo json_encode($tablesResult);
