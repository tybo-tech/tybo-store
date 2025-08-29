<?php
include_once '../../config/Connection.php';
include_once '../../models/TyboWebsite.php';
$id = $_GET['id'];
$pageId = $_GET['pageId'] ?? 'home';

if (!$id || empty($id)) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}
$connection = new Connection();
$db = $connection->connect();

$service = new TyboWebsite($db);
$tablesResult = $service->getWebsiteById($id,$pageId);
echo json_encode($tablesResult);
