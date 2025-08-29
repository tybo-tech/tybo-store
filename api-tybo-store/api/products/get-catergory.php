<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';
$id =$_GET['id'];

if (!$id || empty($id)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

$service = new ProductCrud($db);
$tablesResult = $service->get_catergory($id);
echo json_encode($tablesResult);
