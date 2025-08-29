<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';
$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : 0;
if ($company_id <= 0) {
    echo json_encode(['error' => 'Invalid company ID']);
    exit;
}
$query = isset($_GET['query']) ?  $_GET['query'] : '';
if (strlen($query) < 2) {
    echo json_encode(['error' => 'Query must be at least 3 characters long']);
    exit;
}


$query = isset($_GET['query']) ?  $_GET['query'] : '';

$connection = new Connection();
$db = $connection->connect();

$service = new ProductCrud($db);
$tablesResult = $service->search($query,$company_id);
echo json_encode($tablesResult);
