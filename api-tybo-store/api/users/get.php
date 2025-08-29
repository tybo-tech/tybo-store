<?php
// api/users/delete.php
include_once '../../config/Connection.php';
include_once '../../models/User.php';
$userId = isset($_GET['id']) ? $_GET['id'] : null;

$database = new Connection();
$db = $database->connect();

$service = new User($db);
$result = $service->getById(id: $userId);

echo json_encode($result);
