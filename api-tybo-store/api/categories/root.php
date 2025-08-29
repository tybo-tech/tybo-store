<?php
include_once '../../config/Connection.php';
include_once '../../models/Category.php';

$company_id = isset($_GET['company_id']) ? (int) $_GET['company_id'] : 0;
if ($company_id <= 0) {
    echo json_encode(['error' => 'Invalid company ID']);
    exit;
}
$connection = new Connection();
$db = $connection->connect();

$service = new Category($db);
$tablesResult = $service->getRootCategories($company_id );
echo json_encode($tablesResult);
