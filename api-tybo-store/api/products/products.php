<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductsList.php';

$connection = new Connection();
$db = $connection->connect();

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 1000;
$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : 10;

$service = new ProductsList($db);
$tablesResult = $service->list(
    $company_id,
    $limit,
    $offset
);
echo json_encode($tablesResult);
