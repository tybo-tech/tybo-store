<?php
// api/categories/authenticate.php
include_once '../../config/Connection.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->username) || empty($data->password)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$database = new Connection();
$db = $database->connect();

$service = new User($db);

$result = $service->authenticate($data->username, $data->password);

echo json_encode($result);
