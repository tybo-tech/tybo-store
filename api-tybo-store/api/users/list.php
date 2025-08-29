<?php
// api/users/list.php
include_once '../../config/Connection.php';
include_once '../../models/User.php';
$company_id = isset($_GET['company_id']) ? $_GET['company_id'] : null;

$database = new Connection();
$db = $database->connect();

$service = new User($db);
$result = $service->list(company_id: $company_id);

echo json_encode($result);
