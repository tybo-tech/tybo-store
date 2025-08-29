<?php
/// companies/list.php
include_once '../../config/Connection.php';
include_once '../../models/Crud.php';

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
if (!$user_id || trim($user_id) === '') {
    echo json_encode(['error' => 'Missing or invalid user ID']);
    exit;
}

$connection = new Connection();
$db = $connection->connect();

$service = new Crud($db);
$tablesResult = $service->myCompanies($user_id);
echo json_encode($tablesResult);
