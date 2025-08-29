<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductCrud.php';

$connection = new Connection();
$db = $connection->connect();

$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : 0;
if ($company_id <= 0) {
    echo json_encode(['error' => 'Invalid company ID']);
    exit;
}


$featured = isset($_GET['featured']) ? (int) $_GET['featured'] : 0;
$on_sale = isset($_GET['on_sale']) ? (int) $_GET['on_sale'] : 0;
$category_id = isset($_GET['category_id']) ? (int) $_GET['category_id'] : 0;

$service = new ProductCrud($db);
$tablesResult = $service->listProducts(
    $company_id,
    $featured,
    $on_sale,
    $category_id
);
echo json_encode($tablesResult);
