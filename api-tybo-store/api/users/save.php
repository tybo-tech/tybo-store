<?php
// api/categories/save.php
include_once '../../config/Connection.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->username)) {
    echo json_encode(["error" => "Name is required"]);
    exit;
}

$database = new Connection();
$db = $database->connect();

$service = new User($db);
// Check if it's an update or a new entry
if (!empty($data->id)) {
    $result = $service->update($data);
} else {
    $result = $service->create($data);
}

echo json_encode($result);
