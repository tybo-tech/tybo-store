<?php
/// companies/get.php
include_once '../../config/Connection.php';
include_once '../../models/Crud.php';

$id = $_GET['id'] ?? null;
if (!$id || trim($id) === '') {
    echo json_encode(['error' => 'Missing or invalid company ID']);
    exit;
}

$pageId = $_GET['pageId'] ?? null;

$connection = new Connection();
$db = $connection->connect();

$service = new Crud($db);
$tablesResult = $service->getCompanyForWebsite($id, $pageId);

header('Content-Type: application/json');
echo json_encode($tablesResult);
