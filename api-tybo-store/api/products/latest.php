<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';
$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : 0;
if ($company_id <= 0) {
    echo json_encode(['error' => 'Invalid company ID']);
    exit;
}

$connection = new Connection();
$db = $connection->connect();
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10; // Default limit to 10 if not specified

$service = new ProductCrud($db);
$tablesResult = $service->latestProducts($company_id,$limit);
echo json_encode($tablesResult);
